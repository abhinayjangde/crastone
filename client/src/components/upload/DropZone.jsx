import { useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function DropZone({ onFileSelect, selectedFile, isUploading, uploadProgress, onRemoveFile }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        onFileSelect(file);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "relative group cursor-pointer border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-300",
                isDragging
                    ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
                    : "border-muted-foreground/20 hover:border-blue-500/50 hover:bg-muted/30",
                isUploading ? "pointer-events-none opacity-50" : ""
            )}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => onFileSelect(e.target.files[0])}
                className="hidden"
            />

            {selectedFile ? (
                <div className="flex flex-col items-center gap-3 animate-fadeIn w-full">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-lg">{selectedFile.name}</p>
                        <Badge variant="outline" className="mt-1 border-blue-500/30 text-blue-400 bg-blue-500/5">
                            {formatFileSize(selectedFile.size)} PDF
                        </Badge>
                    </div>
                    {!isUploading && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFile();
                            }}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1"
                        >
                            <X className="w-4 h-4 mr-2" /> Change File
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium group-hover:text-blue-400 transition-colors">
                            Click to upload or drag & drop
                        </p>
                        <p className="text-sm text-muted-foreground">PDF files only, max 5MB</p>
                    </div>
                </>
            )}

            {isUploading && (
                <div className="w-full mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1" />
                </div>
            )}
        </div>
    );
}
