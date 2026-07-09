export interface Product {
  sku: string;
  name: string;
  description: string;
  source: string;
  length: number;
  width: number;
  height: number;
  price: number;
  image_url: string;
  score?: number;
}

export interface SearchResponse {
  results: Product[];
}
