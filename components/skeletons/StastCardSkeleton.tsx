import { Card, CardContent, CardHeader } from "../ui/card";

export const StatsCardSkeleton = () => (
  <Card className="h-60 animate-pulse">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 bg-muted rounded"></div>
        <div className="h-4 w-4 bg-muted rounded"></div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-8 w-16 bg-muted rounded mb-3"></div>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-3 w-3 bg-muted rounded"></div>
        <div className="h-3 w-32 bg-muted rounded"></div>
      </div>
      <div className="h-32 w-full bg-muted rounded"></div>
    </CardContent>
  </Card>
);