import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LowStockItem } from "@/types";

interface LowStockWarningProps {
  items: LowStockItem[];
}

export function LowStockWarning({ items }: LowStockWarningProps) {
  return (
    <Card className="border-amber-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base font-semibold">Low Stock Alerts</CardTitle>
          </div>
          {items.length > 0 && (
            <Badge variant="warning">{items.length} item{items.length !== 1 ? "s" : ""}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            All items are well stocked.
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-md bg-amber-50 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-700">{item.quantity} left</p>
                  <p className="text-xs text-muted-foreground">Reorder at {item.reorder_level}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-2" asChild>
              <Link href="/inventory">Manage inventory</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
