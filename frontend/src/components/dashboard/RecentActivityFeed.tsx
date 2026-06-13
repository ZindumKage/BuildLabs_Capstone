import { ShoppingCart, PackagePlus, PackageMinus, Package, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import type { RecentActivity } from "@/types";

const activityConfig = {
  sale: { icon: ShoppingCart, color: "text-blue-500 bg-blue-50" },
  stock_in: { icon: PackagePlus, color: "text-emerald-500 bg-emerald-50" },
  stock_out: { icon: PackageMinus, color: "text-amber-500 bg-amber-50" },
  new_product: { icon: Package, color: "text-purple-500 bg-purple-50" },
} as const;

interface RecentActivityFeedProps {
  activities: RecentActivity[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDateTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
