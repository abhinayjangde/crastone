import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PriorityBadge({ priority, className }) {
    const getPriorityColor = (p) => {
        switch (p) {
            case "low": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "medium": return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
            case "high": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <Badge variant="outline" className={cn("capitalize", getPriorityColor(priority), className)}>
            {priority} Priority
        </Badge>
    );
}
