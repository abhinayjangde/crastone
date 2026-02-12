import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DropZone } from "@/components/upload/DropZone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Zap } from "lucide-react";
import axios from "axios";

export default function Home() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFileId, setUploadedFileId] = useState(null);
    const [waitingForRedirect, setWaitingForRedirect] = useState(false);
    const navigate = useNavigate();

    // Effect to handle redirect once upload completes if user already clicked roast
    useEffect(() => {
        if (waitingForRedirect && uploadedFileId) {
            navigate(`/processing/${uploadedFileId}`);
        }
    }, [waitingForRedirect, uploadedFileId, navigate]);

    const uploadFile = async (file) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data && response.data.file_id) {
                setUploadedFileId(response.data.file_id);
                // If user is already waiting, the useEffect will handle the redirect
            } else {
                toast.error("Upload succeeded but no ID returned.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            // Only show error if user is actively trying to roast
            if (waitingForRedirect) {
                toast.error("Upload failed. Please try again.");
            }
            // Reset waiting state on error so user can try again
            setWaitingForRedirect(false);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (file) => {
        if (file) {
            if (file.type !== "application/pdf") {
                toast.error("Please upload a PDF file only.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            setSelectedFile(file);
            setUploadedFileId(null); // Reset previous upload
            uploadFile(file); // Start background upload immediately
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setUploadedFileId(null);
        setIsUploading(false);
        setWaitingForRedirect(false);
    };

    const handleRoastClick = () => {
        if (!selectedFile) return;

        if (uploadedFileId) {
            // Upload already finished
            navigate(`/processing/${uploadedFileId}`);
        } else if (isUploading) {
            // Upload still in progress, wait for it
            setWaitingForRedirect(true);
        } else {
            // Upload failed or didn't start? Retry
            uploadFile(selectedFile);
            setWaitingForRedirect(true);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Hero Section */}
            <section className="text-center space-y-4 pt-12">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2 animate-fire-pulse">
                    <Zap className="w-8 h-8 text-blue-500 animate-flicker" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                    RESUME ROASTER
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                    Get your resume <span className="text-blue-400 font-medium">brutally analyzed</span> by AI.
                    Honest feedback to help you land the job.
                </p>
            </section>

            {/* Upload Card */}
            <Card className="border-border/50 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 max-w-2xl mx-auto w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-400" />
                        Drop your Resume
                    </CardTitle>
                    <CardDescription>
                        Upload your PDF here. We promise (not) to be gentle.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DropZone
                        onFileSelect={handleFileSelect}
                        selectedFile={selectedFile}
                        isUploading={false} // Hide visual upload progress from DropZone
                        uploadProgress={0}
                        onRemoveFile={handleRemoveFile}
                    />

                    <Button
                        onClick={handleRoastClick}
                        disabled={!selectedFile || (waitingForRedirect && isUploading)}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {waitingForRedirect && isUploading ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">⏳</span> Finalizing Upload...
                            </span>
                        ) : (
                            "Analyze My Resume ⚡"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
