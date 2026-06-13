import { useQuery } from "@tanstack/react-query";
import { getDashboard, getRecentActivities } from "@/services/dashboard";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    refetchInterval: 60_000, // auto-refresh every minute
  });
}

export function useRecentActivities() {

  return useQuery({

    queryKey: ["recent-activities"],

    queryFn: getRecentActivities,

  });

}