import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ScoreDashboard } from "@/components/results/ScoreDashboard";
import { RoastSection } from "@/components/results/RoastSection";
import { HiddenGems } from "@/components/results/HiddenGems";
import { SuggestionsList } from "@/components/results/SuggestionsList";
import { TldrBox } from "@/components/results/TldrBox";
import { FinalVerdict } from "@/components/results/FinalVerdict";
import { Flame, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

// Sample Mock Data from Guide
const mockResult = {
    roast_result: {
        headline: "This resume has more buzzwords than a beehive 🐝",
        opening_roast: "I've seen better formatting on a ransom note. Did you design this in MS Paint while blindfolded?",
        roast_sections: [
            {
                title: "Design & Layout",
                roast: "Your margins are tighter than your chances of getting a callback. The font size changes more than my mood on a Monday.",
                severity: "spicy"
            },
            {
                title: "Experience Section",
                roast: "You 'managed' things and 'helped' with stuff. Groundbreaking. Tell me you have no metrics without telling me you have no metrics.",
                severity: "extra_crispy"
            }
        ],
        hidden_gems: [
            "Good use of action verbs in recent role",
            "Education section is clean and well-organized",
            "Contact info is complete and professional"
        ],
        suggestions: [
            {
                category: "content",
                priority: "high",
                issue: "No quantified achievements in experience section",
                recommendation: "Add specific numbers, percentages, or dollar amounts to demonstrate impact",
                example: "Instead of 'Improved sales', write 'Increased quarterly sales by 34% ($2.1M revenue)'"
            },
            {
                category: "formatting",
                priority: "medium",
                issue: "Inconsistent bullet point formatting",
                recommendation: "Use the same bullet style throughout and ensure consistent indentation"
            }
        ],
        scores: {
            overall: 52,
            formatting: 45,
            content: 58,
            impact: 42,
            ats_friendly: 65
        },
        final_verdict: "Your resume isn't hopeless, it just needs CPR – Content, Precision, and Results. Fix the suggestions above and you'll go from 'meh' to 'yes, schedule the interview!'",
        tldr: "Too many buzzwords, not enough numbers. Your experience reads like job descriptions, not achievements. Fix formatting inconsistencies and add metrics to stand out."
    },
    metadata: {
        pages_processed: 2,
        model_used: "llama-3.2-90b-vision",
        processed_at: "2026-02-03T10:30:00Z",
        version: "2.0"
    },
    user_message: "🔥 Your resume roast is ready! We've analyzed your resume and prepared some brutally honest (but helpful) feedback. Remember: even the harshest roast comes from a place of wanting you to succeed. Take the feedback, improve, and come back stronger! 💪"
};

export default function Results() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/result/${id}`);
                setData(response.data);
            } catch (error) {
                console.warn("Using mock data due to fetch error:", error);
                // Fallback to mock data for demo purposes
                setData(mockResult);
                toast.info("Showing sample roast (Backend not connected)");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        } else {
            // Direct access fallback
            setData(mockResult);
            setLoading(false);
        }
    }, [id]);

    if (loading) return <LoadingSpinner />;

    // Check for nested output (FileResponse schema) or direct response
    const result = data?.output?.roast_result || data?.roast_result;
    const user_message = data?.output?.user_message || data?.user_message;

    if (!result) return (
        <div className="text-center pt-20">
            <h2 className="text-2xl font-bold mb-4">Roast Not Found</h2>
            <p className="text-muted-foreground mb-4">
                Raw Data Status: {data?.status || "Unknown"}
            </p>
            {/* Debugging helper */}
            <details className="text-left max-w-lg mx-auto mb-6 bg-muted p-4 rounded text-xs overflow-auto">
                <summary>Debug Info</summary>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </details>
            <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn pb-12">
            <Button
                variant="ghost"
                className="mb-4 hover:bg-blue-500/10 hover:text-blue-500"
                onClick={() => navigate("/")}
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Roast Another Resume
            </Button>

            {/* Header Section */}
            <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-black leading-tight bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
                    {result.headline}
                </h1>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3 text-blue-200">
                    <Flame className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-sm md:text-base font-medium">{user_message}</p>
                </div>
            </div>

            <TldrBox content={result.tldr} />

            <ScoreDashboard scores={result.scores} />

            {/* Opening Roast Quote */}
            <div className="relative py-8 my-8 text-center">
                <span className="absolute top-0 left-0 text-6xl text-blue-500/20 font-serif">"</span>
                <p className="text-2xl md:text-3xl font-serif italic text-muted-foreground px-8 leading-relaxed">
                    {result.opening_roast}
                </p>
                <span className="absolute bottom-0 right-0 text-6xl text-blue-500/20 font-serif">"</span>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="roast" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-muted/40 p-1 mb-8 gap-2">
                    <TabsTrigger value="roast" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
                        🔥 The Roast
                    </TabsTrigger>
                    <TabsTrigger value="suggestions" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white transition-all">
                        💡 Improvements
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="roast" className="space-y-8 animate-fadeIn">
                    <RoastSection roasts={result.roast_sections} />
                    <HiddenGems gems={result.hidden_gems} />
                </TabsContent>

                <TabsContent value="suggestions" className="animate-fadeIn">
                    <SuggestionsList suggestions={result.suggestions} />
                </TabsContent>
            </Tabs>

            <FinalVerdict verdict={result.final_verdict} />
        </div>
    );
}
