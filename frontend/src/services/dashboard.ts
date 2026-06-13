import { apiClient } from "@/lib/axios";
import type { DashboardData, LowStockItem } from "@/types";
import type { RecentActivity } from "@/types";


export async function getDashboard(): Promise<DashboardData> {
  const res = await apiClient.get("/dashboard");
  return res.data;
}

export async function getLowStockProducts(): Promise<LowStockItem[]> {
  const res = await apiClient.get("/dashboard/low-stock");
  return res.data;
}

export async function getRecentActivities(): Promise<RecentActivity[]> {

  const res = await apiClient.get("/dashboard/activities");

  return res.data;

}