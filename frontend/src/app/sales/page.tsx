"use client";

import { useState } from "react";
import { ShoppingCart, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { RecordSaleForm } from "@/components/sales/RecordSaleForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSales, useCreateSale } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { CreateSaleFormValues } from "@/lib/validations";

export default function SalesPage() {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: sales, isLoading } = useSales({ page, page_size: 15 });
  const { data: productsData } = useProducts({ page_size: 200 });
  const createSale = useCreateSale();

  const products = productsData?.items ?? [];

  const handleCreateSale = async (data: CreateSaleFormValues) => {
    setActionError(null);
    try {
      await createSale.mutateAsync(data);
      setShowModal(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to record sale.");
    }
  };

  return (
    <ProtectedRoute>
      <AppShell title="Sales">
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Sales</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Record and review all sales transactions.
              </p>
            </div>
            <Button onClick={() => { setShowModal(true); setActionError(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              Record sale
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Sales history</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Qty</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Unit price</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading &&
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-4 w-8 ml-auto" /></td>
                          <td className="px-4 py-3 hidden sm:table-cell"><Skeleton className="h-4 w-16 ml-auto" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-4 w-16 ml-auto" /></td>
                          <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-32 ml-auto" /></td>
                        </tr>
                      ))}

                    {!isLoading && sales?.items.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                            <p className="font-medium">No sales recorded yet</p>
                            <p className="text-muted-foreground text-xs">
                              Record your first sale to see it here.
                            </p>
                            <Button
                              size="sm"
                              className="mt-1"
                              onClick={() => setShowModal(true)}
                            >
                              Record sale
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {!isLoading &&
                      sales?.items.map((sale) => (
                        <tr key={sale.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium">{sale.product_name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{sale.product_sku}</p>
                          </td>
                          <td className="px-4 py-3 text-right">{sale.quantity}</td>
                          <td className="px-4 py-3 text-right hidden sm:table-cell text-muted-foreground">
                            {formatCurrency(sale.unit_price)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {formatCurrency(sale.total_amount)}
                          </td>
                          <td className="px-4 py-3 text-right hidden md:table-cell text-muted-foreground text-xs">
                            {formatDateTime(sale.created_at)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {sales && sales.pages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
                  <p className="text-xs text-muted-foreground">
                    Page {sales.page} of {sales.pages} ({sales.total} sales)
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
                      disabled={page === sales.pages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={showModal} onOpenChange={(o) => !o && setShowModal(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Record a sale
              </DialogTitle>
            </DialogHeader>
            {actionError && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive">{actionError}</p>
              </div>
            )}
            <RecordSaleForm
              products={products}
              onSubmit={handleCreateSale}
              isLoading={createSale.isPending}
            />
          </DialogContent>
        </Dialog>
      </AppShell>
    </ProtectedRoute>
  );
}
