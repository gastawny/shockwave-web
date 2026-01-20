export function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20">
      <div className="absolute z-[100] w-40 lg:w-56 h-40 lg:h-56 rounded-full animate-ring">
        <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
      </div>
    </div>
  )
}
