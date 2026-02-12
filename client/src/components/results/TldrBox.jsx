import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export function TldrBox({ content }) {
    return (
        <Card className="bg-blue-950/10 border-blue-500/20">
            <CardContent className="pt-6 flex gap-4 items-start">
                <Info className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-blue-400 mb-1">TL;DR</h4>
                    <p className="text-muted-foreground">{content}</p>
                </div>
            </CardContent>
        </Card>
    );
}
