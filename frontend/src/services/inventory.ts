import { apiClient } from "@/lib/axios";
import type {
  AddStockRequest,
  RemoveStockRequest,
  StockMovement,
} from "@/types";

interface MovementFilters {
  product_id?: number;
  movement_type?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedMovements {
  items: StockMovement[];
  total: number;
  page: number;
  pages: number;
}

/** Fetch stock movement history */
export async function getStockMovements(
  filters: MovementFilters = {}
): Promise<PaginatedMovements> {
  const res = await apiClient.get(
    "/inventory/history",
    { params: filters }
  );

  return res.data;
}

/** Add stock */
export async function addStock(
  data: AddStockRequest
) {
  const res = await apiClient.post(
    "/inventory/add-stock",
    data
  );

  return res.data;
}

/** Remove stock */
export async function removeStock(
  data: RemoveStockRequest
) {
  const res = await apiClient.post(
    "/inventory/remove-stock",
    data
  );

  return res.data;
}