import { SkeletonStats, SkeletonChart } from "@/components/ui/skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function RelatoriosLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <Skeleton className="h-10 w-[150px]" />
      </div>

      <SkeletonStats />
      <SkeletonChart />

      <div className="grid gap-6 md:grid-cols-2">
        <SkeletonChart />
        <SkeletonChart />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  )
}
