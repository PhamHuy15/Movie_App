export default function Loading() {
    return (
        <div className="px-5 pt-24 lg:px-10">
            <div className="h-[55vh] animate-pulse rounded-3xl bg-white/5" />
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-6">
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-white/5" />
                ))}
            </div>
        </div>
    );
}
