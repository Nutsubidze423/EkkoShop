export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#2C2C2C]">
      <Skeleton className="w-full aspect-[4/3]" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-2.5 w-14" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px"
      style={{ backgroundColor: '#2C2C2C' }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ backgroundColor: '#F5F1E3' }}>
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  )
}
