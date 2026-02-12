import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

export function SeverityBadge({ severity, className }) {
    const getSeverityColor = (s) => {
        switch (s) {
            case "mild": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "medium": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "spicy": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "extra_crispy": return "bg-pink-500/10 text-pink-500 border-pink-500/20";
            default: return "bg-muted text-muted-foreground";
        }
    };

    const getLabel = (s) => {
        if (!s) return "Unknown";
        return s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <Badge variant="outline" className={cn("gap-1", getSeverityColor(severity), className)}>
            {severity === "extra_crispy" && <Zap className="w-3 h-3" />}
            {getLabel(severity)}
        </Badge>
    );
}
