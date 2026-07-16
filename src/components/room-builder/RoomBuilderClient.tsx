'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import RoomCatalogPanel from '@/components/room-builder/RoomCatalogPanel';
import RoomItemToolbar from '@/components/room-builder/RoomItemToolbar';
import RoomSummaryBar from '@/components/room-builder/RoomSummaryBar';
import RoomToolbar, { type ToolId } from '@/components/room-builder/RoomToolbar';
import RoomViewport from '@/components/room-builder/RoomViewport';
import { DEMO_ROOM_SCANS } from '@/lib/demo/dashboard';
import { loadKycData } from '@/lib/demo/kyc';
import {
  createPlacedItem,
  getDefaultScanId,
  getRoomDimensions,
  loadScene,
  resetScene,
  saveScene,
  sceneTotal,
  clampLift,
  type PlacedItem,
  type RoomScene,
} from '@/lib/demo/roomBuilder';

export default function RoomBuilderClient() {
  const searchParams = useSearchParams();
  const initialScan = searchParams.get('scan') ?? getDefaultScanId();

  const [scanId, setScanId] = useState(initialScan);
  const [scene, setScene] = useState<RoomScene | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState<ToolId>('build');
  const [saveToast, setSaveToast] = useState('');
  const [history, setHistory] = useState<PlacedItem[][]>([]);
  const [dims, setDims] = useState(getRoomDimensions(initialScan));

  useEffect(() => {
    const kyc = loadKycData();
    if (kyc?.roomDimensions?.width) {
      setDims({
        width: kyc.roomDimensions.width,
        depth: kyc.roomDimensions.length,
        height: kyc.roomDimensions.height,
      });
    } else {
      setDims(getRoomDimensions(scanId));
    }
  }, [scanId]);

  useEffect(() => {
    setScene(loadScene(scanId));
    setSelectedId(null);
    setHistory([]);
  }, [scanId]);

  useEffect(() => {
    const param = searchParams.get('scan');
    if (param && param !== scanId) setScanId(param);
  }, [searchParams, scanId]);

  const pushHistory = useCallback((items: PlacedItem[]) => {
    setHistory((h) => [...h.slice(-20), items]);
  }, []);

  const updateScene = useCallback(
    (updater: (prev: RoomScene) => RoomScene, recordHistory = true) => {
      setScene((prev) => {
        if (!prev) return prev;
        if (recordHistory) pushHistory(prev.placedItems);
        const next = updater(prev);
        saveScene(next);
        return next;
      });
    },
    [pushHistory],
  );

  const handleAdd = (sku: string) => {
    updateScene((prev) => ({
      ...prev,
      placedItems: [...prev.placedItems, createPlacedItem(sku)],
    }));
    setTool('decorate');
  };

  const handleRemove = useCallback(
    (id: string) => {
      updateScene((prev) => ({
        ...prev,
        placedItems: prev.placedItems.filter((item) => item.id !== id),
      }));
      setSelectedId((current) => (current === id ? null : current));
    },
    [updateScene],
  );

  const handleRotate = useCallback(
    (id: string, delta: number) => {
      updateScene((prev) => ({
        ...prev,
        placedItems: prev.placedItems.map((item) =>
          item.id === id
            ? { ...item, rotation: (((item.rotation + delta) % 360) + 360) % 360 }
            : item,
        ),
      }));
    },
    [updateScene],
  );

  const handleLift = useCallback(
    (id: string, delta: number) => {
      updateScene((prev) => ({
        ...prev,
        placedItems: prev.placedItems.map((item) =>
          item.id === id ? { ...item, lift: clampLift(item.lift + delta) } : item,
        ),
      }));
    },
    [updateScene],
  );

  const handleSetLift = useCallback(
    (id: string, lift: number) => {
      updateScene((prev) => ({
        ...prev,
        placedItems: prev.placedItems.map((item) =>
          item.id === id ? { ...item, lift: clampLift(lift) } : item,
        ),
      }));
    },
    [updateScene],
  );

  const handleResetLayout = () => {
    if (!scene) return;
    pushHistory(scene.placedItems);
    const next = resetScene(scanId);
    setScene(next);
    setSelectedId(null);
    setSaveToast('Layout reset');
    setTimeout(() => setSaveToast(''), 2500);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedId) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'q' || e.key === 'Q' || e.key === '[') {
        e.preventDefault();
        handleRotate(selectedId, -15);
      } else if (e.key === 'e' || e.key === 'E' || e.key === ']') {
        e.preventDefault();
        handleRotate(selectedId, 15);
      } else if (e.key === 'r' || e.key === 'R' || e.key === 'PageUp') {
        e.preventDefault();
        handleLift(selectedId, 0.12);
      } else if (e.key === 'f' || e.key === 'F' || e.key === 'PageDown') {
        e.preventDefault();
        handleLift(selectedId, -0.12);
      } else if (e.key === 'Escape') {
        setSelectedId(null);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleRemove(selectedId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, handleRotate, handleLift, handleRemove]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    updateScene((s) => ({ ...s, placedItems: prev }), false);
  };

  const handleSave = () => {
    if (!scene) return;
    saveScene(scene);
    setSaveToast('Room saved');
    setTimeout(() => setSaveToast(''), 2500);
  };

  if (!scene) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F3F4F6] border-t-[#658EC2]" />
      </div>
    );
  }

  const total = sceneTotal(scene.placedItems);
  const uniqueProducts = new Set(scene.placedItems.map((i) => i.sku)).size;
  const selectedItem = selectedId
    ? scene.placedItems.find((i) => i.id === selectedId) ?? null
    : null;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#F4F5F4]">
      {/* Compact header */}
      <header className="shrink-0 border-b border-[#E5E7EB] bg-white px-4 py-2.5 sm:px-5 sm:py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="font-serif text-xl font-bold text-[#111827] sm:text-2xl">
              Room Builder
            </h1>
            <p className="text-xs text-[#6B7280] sm:text-sm">
              Design your room in 3D and shop the look.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {DEMO_ROOM_SCANS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScanId(s.id)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold sm:px-3 sm:py-1.5 ${
                  scanId === s.id
                    ? 'bg-[#FFF0F5] text-[#DB2777] ring-1 ring-[#DB2777]/30'
                    : 'bg-[#F9FAFB] text-[#374151] ring-1 ring-[#E5E7EB]'
                }`}
              >
                {s.title}
              </button>
            ))}
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#374151] shadow-sm hover:bg-[#F9FAFB] sm:text-sm"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              Save Room
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#374151] shadow-sm hover:bg-[#F9FAFB] sm:text-sm"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
              Share
            </button>
            {saveToast && (
              <span className="text-xs font-medium text-emerald-600 sm:text-sm">{saveToast}</span>
            )}
          </div>
        </div>
      </header>

      {/* Main workspace — fills remaining height */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <RoomToolbar active={tool} onChange={setTool} />

        <div className="relative h-full min-h-0 min-w-0 flex-1">
          {selectedItem && (
            <RoomItemToolbar
              item={selectedItem}
              onRotate={(delta) => handleRotate(selectedItem.id, delta)}
              onLift={(delta) => handleLift(selectedItem.id, delta)}
              onRemove={() => handleRemove(selectedItem.id)}
              onDeselect={() => setSelectedId(null)}
            />
          )}

          <RoomViewport
              viewMode={viewMode}
              zoom={zoom}
              placedItems={scene.placedItems}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onMove={(id, x, y) =>
                updateScene((prev) => ({
                  ...prev,
                  placedItems: prev.placedItems.map((item) =>
                    item.id === id ? { ...item, x, y } : item,
                  ),
                }))
              }
              onLift={handleSetLift}
            />

            {/* Viewport controls */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-xl border border-[#E5E7EB] bg-white p-1 shadow-md">
              <button
                type="button"
                onClick={() => setViewMode('2d')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${viewMode === '2d' ? 'bg-[#DB2777] text-white' : 'text-[#6B7280]'}`}
              >
                2D
              </button>
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${viewMode === '3d' ? 'bg-[#DB2777] text-white' : 'text-[#6B7280]'}`}
              >
                3D
              </button>
              <div className="mx-1 h-5 w-px bg-[#E5E7EB]" />
              <button
                type="button"
                onClick={handleResetLayout}
                className="rounded-lg px-2 py-1.5 text-xs font-semibold text-[#6B7280] hover:bg-[#F9FAFB]"
                title="Reset to default layout"
              >
                Reset
              </button>
              <div className="mx-1 h-5 w-px bg-[#E5E7EB]" />
              <button
                type="button"
                onClick={handleUndo}
                disabled={history.length === 0}
                className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-30"
                title="Undo"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 10h10a5 5 0 015 5v0a5 5 0 01-5 5H8" />
                  <path d="M7 6L3 10l4 4" />
                </svg>
              </button>
            </div>

            <div className="absolute bottom-4 right-4 flex flex-col gap-1 rounded-xl border border-[#E5E7EB] bg-white p-1 shadow-md">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
                className="rounded-lg p-1.5 text-[#374151] hover:bg-[#F9FAFB]"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
                className="rounded-lg p-1.5 text-[#374151] hover:bg-[#F9FAFB]"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F9FAFB]"
                title="Reset zoom"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
                </svg>
              </button>
            </div>
        </div>

        <RoomCatalogPanel
          placedItems={scene.placedItems}
          onAdd={handleAdd}
          onSelectPlaced={setSelectedId}
          onRemove={handleRemove}
        />
      </div>

      <RoomSummaryBar
        dimensions={dims}
        itemCount={scene.placedItems.length}
        productCount={uniqueProducts}
        total={total}
        onViewList={() => setSelectedId(null)}
      />
    </div>
  );
}
