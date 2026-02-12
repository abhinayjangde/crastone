import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { SeverityBadge } from "./SeverityBadge";

export function RoastSection({ roasts }) {
    return (
        <Accordion type="single" collapsible className="w-full space-y-4">
            {roasts.map((item, index) => (
                <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-blue-500/10 rounded-lg bg-card/30 px-4 data-[state=open]:bg-card/50 transition-colors"
                >
                    <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-4 w-full text-left">
                            <span className="font-semibold text-lg flex-1">{item.title}</span>
                            <SeverityBadge severity={item.severity} />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-muted-foreground text-base leading-relaxed">
                        {item.roast}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
