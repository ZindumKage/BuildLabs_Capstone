import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSale, getSales } from "@/services/sales";
import type { CreateSaleRequest } from "@/types";
import { productKeys } from "./useProducts";
import { inventoryKeys } from "./useInventory";

interface SaleFilters {
  product_id?: number;
  page?: number;
  page_size?: number;
}

export const saleKeys = {
  all: ["sales"] as const,
  lists: (filters: SaleFilters) => [...saleKeys.all, "list", filters] as const,
};

export function useSales(filters: SaleFilters = {}) {
  return useQuery({
    queryKey: saleKeys.lists(filters),
    queryFn: () => getSales(filters),
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSaleRequest) => createSale(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: saleKeys.all });
      qc.invalidateQueries({ queryKey: productKeys.all });
      qc.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}
