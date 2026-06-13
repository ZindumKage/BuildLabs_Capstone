"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Package, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { DeleteConfirmDialog } from "@/components/products/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useProduct, useDeleteProduct } from "@/hooks/useProducts";
import { formatCurrency, formatDateTime, isLowStock } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [showDelete, setShowDelete] = useState(false);

  const { data: product, isLoading, isError } = useProduct(id);
  const deleteMutation = useDeleteProduct();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    router.push("/products");
  };

  return (
    <ProtectedRoute>
      <AppShell title="Product Details">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Back button */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="text-muted-foreground text-sm">Back to products</span>
          </div>

          {isLoading && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {isError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-8 text-center">
              <Package className="h-10 w-10 text-destructive mx-auto mb-3" />
              <p className="font-medium text-destructive">Product not found</p>
              <Button variant="outline" asChild className="mt-4">
                <Link href="/products">Back to products</Link>
              </Button>
            </div>
          )}

          {product && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-xl">{product.name}</CardTitle>
                        {isLowStock(product.quantity, product.reorder_level) && (
                          <Badge variant="warning" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Low stock
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm font-mono mt-1">{product.sku}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/products/${product.id}/edit`}>
                          <Pencil className="mr-1.5 h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDelete(true)}
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  {product.description && (
                    <>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <Separator />
                    </>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-1">Category</p>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-1">Unit price</p>
                      <p className="font-semibold">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-1">In stock</p>
                      <p
                        className={`font-semibold ${
                          isLowStock(product.quantity, product.reorder_level)
                            ? "text-amber-600"
                            : ""
                        }`}
                      >
                        {product.quantity} units
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-1">Reorder level</p>
                      <p className="font-semibold">{product.reorder_level} units</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-1">Created</p>
                      <p className="text-sm">{formatDateTime(product.created_at)}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-1">Last updated</p>
                      <p className="text-sm">{formatDateTime(product.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/inventory?product=${product.id}`}>
                    View stock history
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/sales?product=${product.id}`}>
                    View sales
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>

        <DeleteConfirmDialog
          open={showDelete}
          onOpenChange={setShowDelete}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
          itemName={product?.name ?? ""}
        />
      </AppShell>
    </ProtectedRoute>
  );
}
