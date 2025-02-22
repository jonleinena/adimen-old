"use client"

export function MetricsDashboard() {
    return (
        <div className="rounded-lg border bg-background/50 p-6 backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Performance Metrics</h3>
                <span className="text-sm text-muted-foreground">Last 30 days</span>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Automated Tasks</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold">1,234</span>
                        <span className="text-sm text-green-500">+12.3%</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Time Saved</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold">267h</span>
                        <span className="text-sm text-green-500">+24.5%</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Cost Reduction</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold">€15.4k</span>
                        <span className="text-sm text-green-500">+18.2%</span>
                    </div>
                </div>
            </div>
        </div>
    )
} 