"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { createSaleSchema, type CreateSaleFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface RecordSaleFormProps {
  products: Product[];
  onSubmit: (data: CreateSaleFormValues) => void;
  isLoading?: boolean;
}

export function RecordSaleForm({ products, onSubmit, isLoading }: RecordSaleFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateSaleFormValues>({
    resolver: zodResolver(createSaleSchema),
  });

  const selectedProductId = watch("product_id");
  const quantity = watch("quantity");
  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const estimatedTotal =
    selectedProduct && quantity ? selectedProduct.price * quantity : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Product *</Label>
        <Select
          value={selectedProductId ? String(selectedProductId) : ""}
          onValueChange={(v) => setValue("product_id", Number(v))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a product..." />
          </SelectTrigger>
          <SelectContent>
            {products.map((p) => (
              <SelectItem key={p.id} value={String(p.id)} disabled={p.quantity === 0}>
                {p.name} — {formatCurrency(p.price)} ({p.quantity} available)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.product_id && (
          <p className="text-xs text-destructive">{errors.product_id.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Quantity *</Label>
        <Input
          type="number"
          min="1"
          max={selectedProduct?.quantity}
          placeholder="1"
          {...register("quantity")}
        />
        {errors.quantity && (
          <p className="text-xs text-destructive">{errors.quantity.message}</p>
        )}
      </div>

      {estimatedTotal !== null && (
        <div className="rounded-md bg-muted p-3">
          <p className="text-sm text-muted-foreground">
            Estimated total:{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(estimatedTotal)}
            </span>
          </p>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Record sale
      </Button>
    </form>
  );
}
