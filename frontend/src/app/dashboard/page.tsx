"use client";

import {
  Package,
  Layers,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  CalendarDays,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { LowStockWarning } from "@/components/dashboard/LowStockWarning";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard, useRecentActivities } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getLowStockProducts } from "@/services/dashboard";
import { RoleGuard } from "@/components/auth/RoleGuard";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();
  const { data: recentActivities = [] } = useRecentActivities();
  const { data: lowStockItems = [] } = useQuery({
    queryKey: ["low-stock"],

    queryFn: getLowStockProducts,
  });
  return (
    <RoleGuard allowedRoles={["admin"]}>
    <ProtectedRoute>
      <AppShell title="Dashboard">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Here&apos;s what&apos;s happening with your inventory today.
            </p>
          </div>

          {isLoading && <DashboardSkeleton />}

          {isError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center">
              <p className="text-sm text-destructive font-medium">
                Failed to load dashboard data. Check your API connection.
              </p>
            </div>
          )}

          {data && (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <StatCard
                  title="Total products"
                  value={data.total_products}
                  icon={Package}
                />
                <StatCard
                  title="Total stock units"
                  value={data.total_stock.toLocaleString()}
                  icon={Layers}
                />
                <StatCard
                  title="Low stock items"
                  value={data.low_stock_products}
                  icon={AlertTriangle}
                  variant={data.low_stock_products > 0 ? "warning" : "default"}
                  description={
                    data.low_stock_products > 0
                      ? "Items at or below reorder level"
                      : "All items well stocked"
                  }
                />
                <StatCard
                  title="Best selling product"
                  value={data.best_selling_product ?? "—"}
                  icon={TrendingUp}
                  variant="success"
                />
                <StatCard
                  title="Units sold today"
                  value={data.sales_today}
                  icon={TrendingUp}
                />

                <StatCard
                  title="Revenue today"
                  value={formatCurrency(data.revenue_today)}
                  icon={DollarSign}
                />

                <StatCard
                  title="Units sold this month"
                  value={data.sales_this_month}
                  icon={CalendarDays}
                />

                <StatCard
                  title="Revenue this month"
                  value={formatCurrency(data.revenue_this_month)}
                  icon={DollarSign}
                  variant="success"
                />
              </div>

              {/* Bottom panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivityFeed activities={recentActivities} />
                <LowStockWarning items={lowStockItems} />
              </div>
            </>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
    </RoleGuard>
  );
}
