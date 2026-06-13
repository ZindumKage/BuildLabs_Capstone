"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  addStockSchema,
  removeStockSchema,
  type AddStockFormValues,
  type RemoveStockFormValues,
} from "@/lib/validations";
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
import type { Product } from "@/types";

interface ProductSelectProps {
  products: Product[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function ProductSelect({ products, value, onChange, error }: ProductSelectProps) {
  return (
    <div className="space-y-1.5">
      <Label>Product *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a product..." />
        </SelectTrigger>
        <SelectContent>
          {products.map((p) => (
            <SelectItem key={p.id} value={String(p.id)}>
              {p.name} ({p.sku}) — {p.quantity} in stock
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Add Stock Form ────────────────────────────────────────────────────────────

interface AddStockFormProps {
  products: Product[];
  onSubmit: (data: AddStockFormValues) => void;
  isLoading?: boolean;
}

export function AddStockForm({ products, onSubmit, isLoading }: AddStockFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddStockFormValues>({
    resolver: zodResolver(addStockSchema),
    defaultValues: { movement_type: "purchase" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ProductSelect
        products={products}
        value={watch("product_id") ? String(watch("product_id")) : ""}
        onChange={(v) => setValue("product_id", Number(v))}
        error={errors.product_id?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Quantity *</Label>
          <Input type="number" min="1" placeholder="50" {...register("quantity")} />
          {errors.quantity && (
            <p className="text-xs text-destructive">{errors.quantity.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Movement type *</Label>
          <Select
            value={watch("movement_type")}
            onValueChange={(v) =>
              setValue("movement_type", v as AddStockFormValues["movement_type"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="adjustment">Adjustment</SelectItem>
              <SelectItem value="return">Return</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Input placeholder="Optional notes..." {...register("notes")} />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Add stock
      </Button>
    </form>
  );
}

// ─── Remove Stock Form ─────────────────────────────────────────────────────────

interface RemoveStockFormProps {
  products: Product[];
  onSubmit: (data: RemoveStockFormValues) => void;
  isLoading?: boolean;
}

export function RemoveStockForm({ products, onSubmit, isLoading }: RemoveStockFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RemoveStockFormValues>({
    resolver: zodResolver(removeStockSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ProductSelect
        products={products}
        value={watch("product_id") ? String(watch("product_id")) : ""}
        onChange={(v) => setValue("product_id", Number(v))}
        error={errors.product_id?.message}
      />

      <div className="space-y-1.5">
        <Label>Quantity to remove *</Label>
        <Input type="number" min="1" placeholder="10" {...register("quantity")} />
        {errors.quantity && (
          <p className="text-xs text-destructive">{errors.quantity.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Input placeholder="Reason for removal..." {...register("notes")} />
      </div>

      <Button type="submit" disabled={isLoading} variant="destructive" className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Remove stock
      </Button>
    </form>
  );
}
