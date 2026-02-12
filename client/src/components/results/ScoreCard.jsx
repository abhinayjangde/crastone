import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function ScoreCard({ title, score, max = 100, className }) {
    const getScoreColor = (value) => {
        if (value < 40) return "text-red-500";
        if (value < 70) return "text-yellow-500";
        return "text-green-500";
    };

    const getProgressColor = (value) => {
        if (value < 40) return "bg-red-500";
        if (value < 70) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <Card className={cn("bg-card/50 border-muted/20", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between mb-2">
                    <span className={cn("text-3xl font-bold", getScoreColor(score))}>{score}</span>
                    <span className="text-sm text-muted-foreground mb-1">/{max}</span>
                </div>
                <Progress
                    value={(score / max) * 100}
                    className="h-2 bg-muted/30"
                    indicatorClassName={getProgressColor(score)}
                />
            </CardContent>
        </Card>
    );
}
