export interface CompareRequest {
  userInput: string;
  pincode: string;
  includeOutOfStock?: boolean;
}

export interface ExtractedItem {
  rawText: string;
  normalized: string;
  category: string;
  subcategory: string;
  confidence: number;
}

export interface PlatformPrice {
  platform: string;
  productId: string;
  productName: string;
  imageUrl: string;
  productUrl: string;
  price: number;
  mrp: number;
  discountPct: number;
  available: boolean;
  stockLabel: string;
  deliveryTime: string;
  unit: string;
  score: number;
}

export interface ItemComparison {
  item: ExtractedItem;
  prices: PlatformPrice[];
  bestPrice: PlatformPrice;
  availableAnywhere: boolean;
}

export type BasketStrategy = 'CHEAPEST' | 'BALANCED' | 'FEWEST_PLATFORMS';

export interface BasketItem {
  itemName: string;
  platform: string;
  productName: string;
  productUrl: string;
  imageUrl: string;
  unit: string;
  price: number;
  mrp: number;
  discountPct: number;
  deliveryTime: string;
  available: boolean;
}

export interface Basket {
  strategy: BasketStrategy;
  title: string;
  description: string;
  items: BasketItem[];
  totalEstimate: number;
  platformCount: number;
  platforms: string[];
  unavailableCount: number;
}

export interface CompareResponse {
  extractedItems: ExtractedItem[];
  comparisons: ItemComparison[];
  baskets: Basket[];
  notFoundItems: string[];
  processingTimeMs: number;
}

export const PLATFORM_COLORS: Record<string, string> = {
  zepto:            '#8B5CF6',
  blinkit:          '#F59E0B',
  swiggy_instamart: '#F97316',
  bigbasket:        '#16A34A',
  jiomart:          '#2563EB',
};
