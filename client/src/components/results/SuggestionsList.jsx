import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { PriorityBadge } from "./PriorityBadge";

export function SuggestionsList({ suggestions }) {
    const [filter, setFilter] = useState("all");

    const categories = ["all", ...new Set(suggestions.map(s => s.category))];

    const filteredSuggestions = filter === "all"
        ? suggestions
        : suggestions.filter(s => s.category === filter);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Actionable Advice</h3>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(c => (
                            <SelectItem key={c} value={c} className="capitalize">
                                {c}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[100px]">Priority</TableHead>
                            <TableHead>Issue & Recommendation</TableHead>
                            <TableHead className="hidden md:table-cell">Category</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSuggestions.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <PriorityBadge priority={item.priority} />
                                </TableCell>
                                <TableCell className="space-y-1">
                                    <div className="font-medium text-foreground">{item.issue}</div>
                                    <div className="text-muted-foreground text-sm">{item.recommendation}</div>
                                    {item.example && (
                                        <div className="bg-muted/30 p-2 rounded text-xs mt-2 border-l-2 border-blue-500/30 italic">
                                            Example: "{item.example}"
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Badge variant="secondary" className="capitalize">{item.category}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
