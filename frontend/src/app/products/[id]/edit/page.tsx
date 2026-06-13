"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProductForm } from "@/components/products/ProductForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import type { ProductFormValues } from "@/lib/validations";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: product, isLoading } = useProduct(id);
  const updateProduct = useUpdateProduct(id);

  const handleSubmit = async (data: ProductFormValues) => {
    setServerError(null);
    try {
      await updateProduct.mutateAsync(data);
      router.push(`/products/${id}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to update product.");
    }
  };

  return (
    <ProtectedRoute>
      <AppShell title="Edit Product">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/products/${id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Edit product</h2>
              <p className="text-muted-foreground text-sm">
                {product ? product.name : "Loading..."}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product details</CardTitle>
              <CardDescription>Update the fields below and save.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              )}
              {serverError && (
                <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3">
                  <p className="text-sm text-destructive">{serverError}</p>
                </div>
              )}
              {product && (
                <ProductForm
                  defaultValues={product}
                  onSubmit={handleSubmit}
                  isLoading={updateProduct.isPending}
                  submitLabel="Save changes"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
