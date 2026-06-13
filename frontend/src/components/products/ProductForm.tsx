"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/types";
import { Loader2 } from "lucide-react";

interface ProductFormProps {
  defaultValues?: Partial<Product>;
  onSubmit: (data: ProductFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = "Save product",
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
     
      description: defaultValues?.description ?? "",
      category: defaultValues?.category ?? "",
      price: defaultValues?.price ?? 0,
      quantity: defaultValues?.quantity ?? 0,
      reorder_level: defaultValues?.reorder_level ?? 5,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Product name *</Label>
          <Input id="name" placeholder="Coca Cola 500ml" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Optional product description..."
          rows={3}
          {...register("description")}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="category">Category *</Label>
          <Input id="category" placeholder="Beverages" {...register("category")} />
          {errors.category && (
            <p className="text-xs text-destructive">{errors.category.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Price (NGN) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="1.99"
            {...register("price")}
          />
          {errors.price && (
            <p className="text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="quantity">Initial quantity *</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            placeholder="100"
            {...register("quantity")}
          />
          {errors.quantity && (
            <p className="text-xs text-destructive">{errors.quantity.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reorder_level">Reorder level *</Label>
          <Input
            id="reorder_level"
            type="number"
            min="0"
            placeholder="10"
            {...register("reorder_level")}
          />
          {errors.reorder_level && (
            <p className="text-xs text-destructive">{errors.reorder_level.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
