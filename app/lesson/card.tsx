/* Imports */
import { challenges } from "@/database/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback } from "react";
import { useAudio, useKey } from "react-use";

// Define the properties (props) that the Card component will accept.
// This ensures that the component is used correctly throughout the app.
type Props = {
    id: number; // Unique identifier for the card
    imageSrc: string | null; // Optional image source for the card
    audioSrc: string | null; // Optional audio source for the card
    text: string; // Text content of the card
    shortcut: string; // Keyboard shortcut to trigger card actions
    selected?: boolean; // Flag to indicate if the card is selected
    disabled?: boolean; // Flag to indicate if the card is disabled
    status: "correct" | "wrong" | "none"; // Status of the card selection
    onClick: () => void; // Function to handle card click events
    type: typeof challenges.$inferSelect["type"]; // Type of challenge for the card
};

// Card component to display interactive elements like images, text, and audio.
// Handles user interaction with mouse clicks and keyboard shortcuts.
export const Card = ({ id, imageSrc, audioSrc, text, shortcut, selected, disabled, status, onClick, type }: Props) => {
    // useAudio hook to manage audio playback
    const [audio, _, controls] = useAudio({ src: audioSrc || "" });
    
    // handleClick function to manage click events
    // Plays the audio (if available) and triggers the onClick event
    const handleClick = useCallback(() => {
        if (disabled) return; // Prevent interaction if the card is disabled

        controls.play(); // Play audio if available

        onClick(); // Trigger the onClick function passed as a prop
    }, [disabled, onClick, controls]);
    
    // useKey hook to handle keyboard shortcuts
    useKey(shortcut, handleClick, {}, [handleClick]);

    return (
        <div 
            className={cn(
                "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 p-4 lg:p-6 cursor-pointer active:border-b-2",
                selected && "border-sky-300 bg-sky-100 hover:bg-sky-100", // Styles when selected
                selected && status == "correct" && "border-purple-300 bg-purple-100 hover:bg-purple-100", // Styles when correct
                selected && status == "wrong" && "border-rose-300 bg-rose-100 hover:bg-rose-100", // Styles when wrong
                disabled && "pointer-events-none hover:bg-white", // Disable interactions when disabled
                type === "ASSIST" && "lg:p-3 w-full" // Additional styles for "ASSIST" type
            )}
            onClick={handleClick} // Attach the handleClick function to the onClick event
        >
            {audio} {/* Render the audio element */}

            {/* Render the image if imageSrc is provided */}
            {imageSrc && (
                <div className="relative aspect-square mb-4 max-h-[80px] w-full lg:max-h-[150px]">
                    <Image src={imageSrc} fill alt={text} />
                </div>    
            )}

            <div className={cn(
                "flex items-center justify-between",
                type === "ASSIST" && "flex-col-reverse", // Different layout for "ASSIST" type
            )}>
                {type === "ASSIST" && <div />} {/* Empty div for layout adjustment */}

                {/* Render the text with conditional styling based on selection and status */}
                <p className={cn(
                    "text-neutral-600 text-sm lg:text-base",
                    selected && "text-sky-500", // Style when selected
                    selected && status == "correct" && "text-purple-500", // Style when correct
                    selected && status == "wrong" && "text-rose-500", // Style when wrong
                )}>
                    {text}
                </p>

                {/* Render the shortcut key display with conditional styling */}
                <div className={cn(
                    "lg:w-[30px] lg:h-[30px] w-[20px] h-[20px] rounded-lg border-2 flex items-center justify-center text-neutral-400 lg:text-[15px] text-xs font-semibold",
                    selected && "border-sky-300 text-sky-500", // Style when selected
                    selected && status == "correct" && "border-purple-500 text-purple-500", // Style when correct
                    selected && status == "wrong" && "border-rose-500 text-rose-500", // Style when wrong
                )}>
                    {shortcut}
                </div>
            </div>
        </div>
    );
}
