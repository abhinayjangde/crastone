import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { FireAnimation } from "@/components/shared/FireAnimation";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

export default function Processing() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("pending");
    const [progress, setProgress] = useState(0);



    // Mock progress simulation based on status
    useEffect(() => {
        let targetProgress = 0;
        if (status === "pending") targetProgress = 10;
        if (status === "processing") targetProgress = 30;
        if (status === "converted to images") targetProgress = 60;
        if (status === "analyzing") targetProgress = 85;
        if (status === "completed") targetProgress = 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= targetProgress) return prev;
                return prev + 1;
            });
        }, 100);
        return () => clearInterval(timer);
    }, [status]);

    useEffect(() => {
        if (!id) return;

        const pollStatus = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/status/${id}`);
                const currentStatus = response.data?.status;

                // Only update status if valid
                if (currentStatus) {
                    setStatus(currentStatus);
                }

                if (currentStatus === "completed" || currentStatus === "failed") {
                    return currentStatus;
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
            return null;
        };

        const intervalId = setInterval(async () => {
            const result = await pollStatus();
            if (result === "completed") {
                clearInterval(intervalId);
                setProgress(100);
                toast.success("Scorecard ready! ⚡");
                setTimeout(() => navigate(`/results/${id}`), 500);
            } else if (result === "failed") {
                clearInterval(intervalId);
                toast.error("Processing failed. Please try again.");
                setTimeout(() => navigate("/"), 2000);
            }
        }, 3000);

        return () => clearInterval(intervalId);
    }, [id, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 animate-fadeIn">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                <FireAnimation />
            </div>

            <Card className="w-full max-w-lg border-blue-500/20 bg-card/60 backdrop-blur-sm">
                <CardContent className="pt-6 flex flex-col items-center gap-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
                        Roasting in Progress...
                    </h2>
                    <p className="text-center text-muted-foreground">
                        Our AI is currently examining your resume for maximum emotional damage.
                    </p>

                    <UploadProgress status={status} progress={progress} />

                    <div className="text-xs text-muted-foreground/50 mt-4">
                        ID: {id}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
