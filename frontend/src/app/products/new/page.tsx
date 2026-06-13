"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProductForm } from "@/components/products/ProductForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCreateProduct } from "@/hooks/useProducts";
import type { ProductFormValues } from "@/lib/validations";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (data: ProductFormValues) => {
    setServerError(null);
    try {
      const product = await createProduct.mutateAsync(data);
      router.push(`/products/${product.id}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to create product.");
    }
  };

  return (
    <ProtectedRoute>
      <AppShell title="Add Product">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Add product</h2>
              <p className="text-muted-foreground text-sm">
                Fill in the details to add a new product to your catalogue.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product details</CardTitle>
              <CardDescription>Fields marked with * are required.</CardDescription>
            </CardHeader>
            <CardContent>
              {serverError && (
                <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3">
                  <p className="text-sm text-destructive">{serverError}</p>
                </div>
              )}
              <ProductForm
                onSubmit={handleSubmit}
                isLoading={createProduct.isPending}
                submitLabel="Create product"
              />
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
