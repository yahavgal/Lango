/* Imports */
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";

/**
 * Type definition for the props of the `Card` component.
 * 
 * @typedef {Object} Props
 * @property {string} title - The title of the course to be displayed on the card.
 * @property {string} imageSrc - The source URL of the image to be displayed on the card.
 * @property {number} id - The unique ID of the course, used for identification and click handling.
 * @property {boolean} [active] - Indicates whether the card is active (optional, default is `false`).
 * @property {boolean} [disabled] - Indicates whether the card is disabled, preventing interactions (optional, default is `false`).
 * @property {(id: number) => void} onClick - Function to be called when the card is clicked, receiving the course ID as an argument.
 */
type Props = {
    title: string;
    imageSrc: string;
    id: number;
    active?: boolean;
    disabled?: boolean;
    onClick: (id: number) => void;
};

/**
 * `Card` component renders a card displaying a course's title, image, and status (active or disabled).
 * The card is clickable, triggering the `onClick` function with the course ID as an argument.
 * 
 * @param {Props} props - The props for the component.
 * @param {string} props.title - The title of the course.
 * @param {string} props.imageSrc - The source URL of the course image.
 * @param {number} props.id - The unique ID of the course.
 * @param {boolean} [props.active=false] - Whether the card is active (default is `false`).
 * @param {boolean} [props.disabled=false] - Whether the card is disabled, preventing interaction (default is `false`).
 * @param {(id: number) => void} props.onClick - Function to handle click events, receiving the course ID.
 * 
 * @returns {JSX.Element} A styled card component.
 */
export const Card = ({ title, imageSrc, id, active = false, disabled = false, onClick }: Props): JSX.Element => {
    return (
        <div
            onClick={() => onClick(id)}  // Calls the onClick function with the card's ID when clicked
            className={cn(
                "flex flex-col items-center justify-between h-full border-2 rounded-xl border-b-4 hover:bg-black/5 cursor-pointer active:border-b-2 pb-6 p-3 min-h-[217px] min-w-[200px]",
                disabled && "pointer-events-none opacity-50"  // Adds disabled styles if the card is disabled
            )}
        >
            {/* Renders the checkmark icon if the card is active */}
            <div className="min-[24px] w-full flex items-center justify-end">
                {active && (
                    <div className="rounded-md bg-green-600 flex items-center justify-center p-1.5">
                        <Check className="text-white stroke-[4] h-4 w-4" />
                    </div>
                )}
            </div>

            {/* Displays the course image */}
            <Image 
                src={imageSrc} 
                alt={title} 
                height={70} 
                width={93.33} 
                className="rounded-lg drop-shadow-md object-cover" 
            />

            {/* Displays the course title */}
            <p className="text-neutral-700 text-center">
                {title}
            </p>
        </div>
    );
};
