export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse space-y-8">
        <div className="h-4 bg-secondary rounded w-1/3" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-secondary rounded" />
          <div className="space-y-4">
            <div className="h-8 bg-secondary rounded w-3/4" />
            <div className="h-6 bg-secondary rounded w-1/4" />
            <div className="h-4 bg-secondary rounded w-full" />
            <div className="h-4 bg-secondary rounded w-2/3" />
            <div className="h-10 bg-secondary rounded w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
}