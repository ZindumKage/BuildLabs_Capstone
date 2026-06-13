import { apiClient } from "@/lib/axios";
import type {
  CreateProductRequest,
  PaginatedResponse,
  Product,
  ProductFilters,
  UpdateProductRequest,
} from "@/types";

/** Fetch a paginated, filtered list of products */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> {
  const res = await apiClient.get<PaginatedResponse<Product>>("/products", {
    params: filters,
  });
  return res.data;
}

/** Fetch a single product by ID */
export async function getProduct(id: number): Promise<Product> {
  const res = await apiClient.get<Product>(`/products/${id}`);
  return res.data;
}

/** Create a new product */
export async function createProduct(data: CreateProductRequest): Promise<Product> {
  const res = await apiClient.post<Product>("/products", data);
  return res.data;
}

/** Update an existing product */
export async function updateProduct(
  id: number,
  data: UpdateProductRequest
): Promise<Product> {
  const res = await apiClient.put<Product>(`/products/${id}`, data);
  return res.data;
}

/** Permanently delete a product */
export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}

/** Fetch all unique categories (for filter dropdowns) */
export async function getCategories(): Promise<string[]> {
  const res = await apiClient.get<string[]>("/products/categories");
  return res.data;
}
