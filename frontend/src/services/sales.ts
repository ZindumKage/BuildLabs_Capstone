import { apiClient } from "@/lib/axios";
import type { CreateSaleRequest, PaginatedResponse, Sale } from "@/types";

interface SaleFilters {
  product_id?: number;
  page?: number;
  page_size?: number;
}

/** Fetch paginated sales history */
export async function getSales(
  filters: SaleFilters = {}
): Promise<PaginatedResponse<Sale>> {
  const res = await apiClient.get<PaginatedResponse<Sale>>("/sales", {
    params: filters,
  });
  return res.data;
}

/** Record a new sale */
export async function createSale(data: CreateSaleRequest): Promise<Sale> {
  const res = await apiClient.post<Sale>("/sales", data);
  return res.data;
}
