"use client";

import { useState } from "react";
import {
  PackagePlus,
  PackageMinus,
  Warehouse,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import {
  AddStockForm,
  RemoveStockForm,
} from "@/components/inventory/StockForms";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useStockMovements,
  useAddStock,
  useRemoveStock,
} from "@/hooks/useInventory";
import { useProducts } from "@/hooks/useProducts";
import { formatDateTime } from "@/lib/utils";
import type {
  AddStockFormValues,
  RemoveStockFormValues,
} from "@/lib/validations";
import type { MovementType } from "@/types";

const movementBadge: Record<
  MovementType,
  {
    label: string;
    variant: "success" | "destructive" | "secondary" | "warning";
  }
> = {
  purchase: { label: "Purchase", variant: "success" },
  sale: { label: "Sale", variant: "destructive" },
  adjustment: { label: "Adjustment", variant: "secondary" },
  return: { label: "Return", variant: "warning" },
};

type ModalMode = "add" | "remove" | null;

export default function InventoryPage() {
  const [modal, setModal] = useState<ModalMode>(null);
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: movements, isLoading } = useStockMovements({
    page,
    page_size: 15,
  });
  const { data: productsData } = useProducts({ page_size: 200 });
  console.log("productsData", productsData);
//console.log("products", products);
  const addStock = useAddStock();
  const removeStock = useRemoveStock();

const products = productsData?.items ?? [];

  const handleAddStock = async (data: AddStockFormValues) => {
    setActionError(null);
    try {
      await addStock.mutateAsync(data);
      setModal(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to add stock.",
      );
    }
  };

  const handleRemoveStock = async (data: RemoveStockFormValues) => {
    setActionError(null);
    try {
      await removeStock.mutateAsync(data);
      setModal(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to remove stock.",
      );
    }
  };

  return (
    <ProtectedRoute>
      <AppShell title="Inventory">
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Track all stock movements — purchases, sales, adjustments, and
                returns.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setModal("add");
                  setActionError(null);
                }}
              >
                <PackagePlus className="mr-2 h-4 w-4" />
                Add stock
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setModal("remove");
                  setActionError(null);
                }}
              >
                <PackageMinus className="mr-2 h-4 w-4" />
                Remove stock
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Stock movement history
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Product
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                        Type
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                        Qty
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                        Notes
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading &&
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-3">
                            <Skeleton className="h-4 w-32" />
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <Skeleton className="h-5 w-20" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-4 w-10 ml-auto" />
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <Skeleton className="h-4 w-28" />
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <Skeleton className="h-4 w-32 ml-auto" />
                          </td>
                        </tr>
                      ))}
                    {!isLoading && movements?.items.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Warehouse className="h-10 w-10 text-muted-foreground" />
                            <p className="font-medium">
                              No stock movements yet
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Add or remove stock to see movements here.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                    {!isLoading &&
                      movements?.items.map((movement) => {
                        const badge = movementBadge[
                          movement.movement_type as keyof typeof movementBadge
                        ] ?? {
                          label: movement.movement_type,
                          variant: "secondary" as const,
                        };
                        return (
                          <tr
                            key={movement.id}
                            className="border-b hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <p className="font-medium">
                                {movement.product_name}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {movement.product_sku}
                              </p>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <Badge variant={badge.variant}>
                                {badge.label}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right font-semibold">
                              <span
                                className={
                                  movement.movement_type === "sale"
                                    ? "text-destructive"
                                    : "text-emerald-600"
                                }
                              >
                                {movement.movement_type === "sale" ? "−" : "+"}
                                {movement.quantity}
                              </span>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                              {movement.notes || "—"}
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell text-right text-muted-foreground text-xs">
                              {formatDateTime(movement.created_at)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              {movements && movements.pages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
                  <p className="text-xs text-muted-foreground">
                    Page {movements.page} of {movements.pages}
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
                      disabled={page === movements.pages}
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

        <Dialog
          open={modal === "add"}
          onOpenChange={(o) => !o && setModal(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PackagePlus className="h-5 w-5 text-emerald-600" />
                Add stock
              </DialogTitle>
            </DialogHeader>
            {actionError && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive">{actionError}</p>
              </div>
            )}
            <AddStockForm
              products={products}
              onSubmit={handleAddStock}
              isLoading={addStock.isPending}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={modal === "remove"}
          onOpenChange={(o) => !o && setModal(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PackageMinus className="h-5 w-5 text-destructive" />
                Remove stock
              </DialogTitle>
            </DialogHeader>
            {actionError && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive">{actionError}</p>
              </div>
            )}
            <RemoveStockForm
              products={products}
              onSubmit={handleRemoveStock}
              isLoading={removeStock.isPending}
            />
          </DialogContent>
        </Dialog>
      </AppShell>
    </ProtectedRoute>
  );
}
