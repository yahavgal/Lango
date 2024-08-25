import { challenges } from "@/database/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
    id: number;
    imageSrc: string | null;
    audioSrc: string | null;
    text: string;
    shortcut: string;
    selected?: boolean;
    disabled?: boolean;
    status: "correct" | "wrong" | "none";
    onClick: () => void;
    type: typeof challenges.$inferSelect["type"];
};

export const Card = ({ id, imageSrc, audioSrc, text, shortcut, selected, disabled, status, onClick, type }: Props) => {
    return (
        <div 
            className={cn(
                "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 p-4 lg:p-6 cursor-pointer, active:border-b-2",
                selected && "border-sky-300 bg-sky-100 hover:bg-sky-100",
                selected && status == "correct" && "border-purple-300 bg-purple-100 hover:bg-purple-100",
                selected && status == "wrong" && "border-rose-300 bg-rose-100 hover:bg-rose-100",
                disabled && "pointer-events-none hover:bg-white",
                type === "ASSIST" && "lg:p-3 w-full"
            )}
            onClick={() => {}}
        >
            {imageSrc && (
                <div className="relative aspect-square mb-4 max-h-[80px] w-full lg:max-h-[150px]">
                    <Image src={imageSrc} fill alt={text} />
                </div>    
            )}
            <div className={cn(
                "flex items-center justify-between",
                type === "ASSIST" && "flex-col-reverse",
            )}>
                {type === "ASSIST" && <div />}
                <p className={cn(
                    "text-neutral-600 text-sm lg:text-base",
                    selected && "text-sky-500",
                    selected && status == "correct" && "text-purple-500",
                    selected && status == "wrong" && "text-rose-500",
                )}>
                    {text}
                </p>
                <div className={cn(
                    "lg:w-[30px] lg:h-[30px] w-[20px] h-[20px] rounded-lg border-2 flex items-center justify-center text-neutral-400 lg:text-[15px] text-xs font-semibold",
                    selected && "border-sky-300 text-sky-500",
                    selected && status == "correct" && "border-purple-500 text-purple-500",
                    selected && status == "wrong" && "border-rose-500 text-rose-500",
                )}>
                    {shortcut}
                </div>
            </div>
        </div>
    );
}