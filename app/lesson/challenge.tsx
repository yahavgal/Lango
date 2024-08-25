import { challengeOptions, challenges } from "@/database/schema"
import { cn } from "@/lib/utils";
import { Card } from "./card";

type Props = {
    options: typeof challengeOptions.$inferSelect[];
    onSelect: (id:number) => void;
    status: "correct" | "wrong" | "none";
    selectedOption: number;
    disabled?: boolean;
    type: typeof challenges.$inferSelect["type"];
}

export const Challenge = ({ options, onSelect, status, selectedOption, disabled, type }: Props) => {
    return (
        <div className={cn(
            "grid gap-2",
            type == "ASSIST" && "grid-cols-1",
            type == "SELECT" && "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
        )}>
            {options.map((option, index) => (
                <Card
                    key={option.id}
                    id={option.id}
                    imageSrc={option.imageSrc}
                    audioSrc={option.audioSrc}
                    text={option.text}
                    shortcut={`${index + 1}`}
                    selected={selectedOption === option.id}
                    disabled={disabled}
                    status={status}
                    onClick={() => onSelect(option.id)}
                    type={type}
                />
            ))}
        </div>
    );
};