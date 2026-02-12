import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Gem } from "lucide-react";

export function HiddenGems({ gems }) {
    if (!gems || gems.length === 0) return null;

    return (
        <Card className="border-green-500/20 bg-green-950/5">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-500">
                    <Gem className="w-5 h-5" /> Hidden Gems
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {gems.map((gem, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{gem}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
