import { SkeletonStats, SkeletonChart, SkeletonTable } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-[200px] animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-[300px] animate-pulse rounded-md bg-muted" />
      </div>

      <SkeletonStats />
      <SkeletonChart />
      <SkeletonTable />
    </div>
  )
}
