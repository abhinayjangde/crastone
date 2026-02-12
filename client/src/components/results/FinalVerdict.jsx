import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, FileDown } from "lucide-react";
import { toast } from "sonner";

export function FinalVerdict({ verdict }) {
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <Card className="bg-linear-to-r from-blue-950/30 to-cyan-950/30 border-blue-500/30">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-500">
                    The Final Verdict
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-lg leading-relaxed">{verdict}</p>

                {/* <div className="flex gap-4 border-t border-white/10 pt-6">
                    <Button variant="outline" className="flex-1" onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-2" /> Share Result
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white">
                        <FileDown className="w-4 h-4 mr-2" /> Download PDF
                    </Button>
                </div> */}
            </CardContent>
        </Card>
    );
}
