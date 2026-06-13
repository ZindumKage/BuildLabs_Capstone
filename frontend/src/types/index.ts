// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}
export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  reorder_level: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  reorder_level: number;
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

export interface ProductFilters {
  search?: string;
  category?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

// ─── Inventory ───────────────────────────────────────────────────────────────

export type MovementType = "purchase" | "sale" | "adjustment" | "return";

export interface StockMovement {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  movement_type: MovementType;
  quantity: number;
  notes: string;
  created_at: string;
}

export interface AddStockRequest {
  product_id: number;
  quantity: number;
  movement_type: "purchase" | "adjustment" | "return";
  notes?: string;
}

export interface RemoveStockRequest {
  product_id: number;
  quantity: number;
  notes?: string;
}

// ─── Sales ───────────────────────────────────────────────────────────────────

export interface Sale {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  created_at: string;
}

export interface CreateSaleRequest {
  product_id: number;
  quantity: number;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  total_products: number;
  total_stock: number;
  low_stock_count: number;
  best_selling_product: string | null;
  sales_today: number;
  sales_this_month: number;
}

export interface RecentActivity {
  id: number;
  type: "sale" | "stock_in" | "stock_out" | "new_product";
  description: string;
  timestamp: string;
}

export interface LowStockItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  reorder_level: number;
}

export interface DashboardData {
  total_products: number;
  total_stock: number;
  low_stock_products: number;
  sales_today: number;
  sales_this_month: number;
  revenue_today: number;
  revenue_this_month: number;
  best_selling_product: string | null;
}

// ─── AI Assistant ─────────────────────────────────────────────────────────────

export interface AIQueryRequest {
  question: string;
  history?: AIMessage[];
}

export interface AIQueryResponse {
  answer: string;
}

export interface AIMessage {
  role: string;

  content: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}
