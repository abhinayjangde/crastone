import { ScoreCard } from "./ScoreCard";
import { Card } from "@/components/ui/card";

export function ScoreDashboard({ scores }) {
    const { overall, formatting, content, impact, ats_friendly } = scores;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Score Radial */}
            <Card className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-card/80 to-background/50 border-blue-500/20 aspect-square md:aspect-auto">
                <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* SVG Radial Progress */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                            className="text-muted/20"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                        />
                        <circle
                            className="text-blue-500 transition-all duration-1000 ease-out"
                            strokeWidth="8"
                            strokeDasharray={264}
                            strokeDashoffset={264 - (264 * overall) / 100}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black">{overall}</span>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Overall</span>
                    </div>
                </div>
            </Card>

            {/* Grid for minor scores */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ScoreCard title="Formatting" score={formatting} />
                <ScoreCard title="Content" score={content} />
                <ScoreCard title="Impact" score={impact} />
                <ScoreCard title="ATS Friendly" score={ats_friendly} />
            </div>
        </div>
    );
}
