"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Package,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { DeleteConfirmDialog } from "@/components/products/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts, useCategories, useDeleteProduct } from "@/hooks/useProducts";
import { formatCurrency, isLowStock } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data, isLoading } = useProducts({
    search: search || undefined,
    category: category || undefined,
    page,
    page_size: 10,
  });

  const { data: categories } = useCategories();
  const deleteMutation = useDeleteProduct();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <ProtectedRoute>
      <AppShell title="Products">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Products</h2>
              <p className="text-muted-foreground text-sm mt-1">
                {data ? `${data.total} product${data.total !== 1 ? "s" : ""} total` : "Manage your product catalogue"}
              </p>
            </div>
            <Button asChild>
              <Link href="/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add product
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Select
              value={category || "all"}
              onValueChange={(v) => { setCategory(v === "all" ? "" : v); setPage(1); }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">SKU</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Price</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Stock</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading &&
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-4 py-3"><Skeleton className="h-4 w-36" /></td>
                        <td className="px-4 py-3 hidden sm:table-cell"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-16 ml-auto" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-12 ml-auto" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-20 ml-auto" /></td>
                      </tr>
                    ))}

                  {!isLoading && data?.items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Package className="h-10 w-10 text-muted-foreground" />
                          <p className="font-medium">No products found</p>
                          <p className="text-muted-foreground text-xs">
                            {search || category
                              ? "Try adjusting your filters."
                              : "Add your first product to get started."}
                          </p>
                          {!search && !category && (
                            <Button asChild size="sm" className="mt-1">
                              <Link href="/products/new">Add product</Link>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    data?.items.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium">{product.name}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground font-mono text-xs">
                          {product.sku}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge variant="secondary">{product.category}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={
                              isLowStock(product.quantity, product.reorder_level)
                                ? "text-amber-600 font-semibold"
                                : "text-foreground"
                            }
                          >
                            {product.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => router.push(`/products/${product.id}`)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => router.push(`/products/${product.id}/edit`)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(product)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
                <p className="text-xs text-muted-foreground">
                  Page {data.page} of {data.pages} ({data.total} items)
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page === data.pages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete dialog */}
        <DeleteConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
          itemName={deleteTarget?.name ?? ""}
        />
      </AppShell>
    </ProtectedRoute>
  );
}
