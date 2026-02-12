import { Button } from "@/components/ui/button";
import { FileQuestion, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                <FileQuestion className="w-24 h-24 text-blue-500 relative z-10" />
                <AlertTriangle className="w-8 h-8 text-cyan-500 absolute -top-2 -right-2 animate-bounce" />
            </div>

            <h1 className="text-4xl font-bold text-foreground">
                404: Resume Not Found
            </h1>

            <p className="text-xl text-muted-foreground max-w-md">
                We looked everywhere. Maybe your career ghosted you?
                Just kidding. The page doesn't exist.
            </p>

            <Button
                size="lg"
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
            >
                Go back to Safety
            </Button>
        </div>
    );
}
