import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function UploadProgress({ status, progress, className }) {
    const getStatusText = (s) => {
        switch (s) {
            case "pending": return "Queueing resume...";
            case "processing": return "Starting roast...";
            case "converted to images": return "Scanning layout...";
            case "analyzing": return "Generating roasted content...";
            case "completed": return "Finalizing roast...";
            case "failed": return "Roast failed (too crispy?)";
            default: return "Processing...";
        }
    };

    return (
        <div className={cn("w-full max-w-md space-y-4", className)}>
            <div className="flex justify-between text-sm font-medium">
                <span className="text-blue-400 animate-pulse transition-all duration-300">
                    {getStatusText(status)}
                </span>
                <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress
                value={progress}
                className="h-3 bg-muted/50 border border-blue-500/10"
                indicatorClassName="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-[length:200%_100%] animate-shimmer"
            />
        </div>
    );
}
