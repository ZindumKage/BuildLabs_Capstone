import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addStock, getStockMovements, removeStock } from "@/services/inventory";
import type { AddStockRequest, RemoveStockRequest } from "@/types";
import { productKeys } from "./useProducts";

interface MovementFilters {
  product_id?: number;
  movement_type?: string;
  page?: number;
  page_size?: number;
}

export const inventoryKeys = {
  all: ["inventory"] as const,
  movements: (filters: MovementFilters) => [...inventoryKeys.all, "movements", filters] as const,
};

export function useStockMovements(filters: MovementFilters = {}) {
  return useQuery({
    queryKey: inventoryKeys.movements(filters),
    queryFn: () => getStockMovements(filters),
  });
}

export function useAddStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddStockRequest) => addStock(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all });
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useRemoveStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RemoveStockRequest) => removeStock(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all });
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
