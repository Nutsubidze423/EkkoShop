export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

export function ProductCardSkeleton() {
  return (
    <div className="product-card flex flex-col h-full" style={{ backgroundColor: '#F5F1E3' }}>
      <Skeleton className="w-full aspect-[4/3] shrink-0" />
      <div className="flex flex-col flex-1 p-5 space-y-2">
        <Skeleton className="h-2.5 w-14" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-3 mt-auto border-t" style={{ borderColor: '#E8E2D3' }}>
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
