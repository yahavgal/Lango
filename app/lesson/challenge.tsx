/* Imports */
import { challengeOptions, challenges } from "@/database/schema"; // Import necessary database schema
import { cn } from "@/lib/utils"; // Import utility function for conditional class names
import { Card } from "./card"; // Import the Card component

// Define the properties (props) that the Challenge component will accept
type Props = {
    options: typeof challengeOptions.$inferSelect[]; // Array of challenge options
    onSelect: (id: number) => void; // Function to handle the selection of an option
    status: "correct" | "wrong" | "none"; // Status of the selected option
    selectedOption: number | undefined; // ID of the currently selected option, or undefined if none selected
    disabled?: boolean; // Flag to indicate if the options should be disabled
    type: typeof challenges.$inferSelect["type"]; // Type of challenge (e.g., "ASSIST", "SELECT")
};

// Challenge component that renders a list of options as cards
export const Challenge = ({ options, onSelect, status, selectedOption, disabled, type }: Props) => {
    return (
        <div className={cn(
            "grid gap-2", // Basic grid layout with gaps between items
            type == "ASSIST" && "grid-cols-1", // Single column layout for "ASSIST" type
            type == "SELECT" && "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]" // Multi-column layout for "SELECT" type, responsive for larger screens
        )}>
            {/* Map through the options and render a Card for each option */}
            {options.map((option, index) => (
                <Card
                    key={option.id} // Unique key for each card
                    id={option.id} // ID of the option
                    imageSrc={option.imageSrc} // Optional image source for the card
                    audioSrc={option.audioSrc} // Optional audio source for the card
                    text={option.text} // Text content of the card
                    shortcut={`${index + 1}`} // Shortcut key assigned based on the index (1, 2, 3, etc.)
                    selected={selectedOption === option.id} // Check if the current option is selected
                    disabled={disabled} // Disable the card if the disabled prop is true
                    status={status} // Status of the selected option (correct, wrong, or none)
                    onClick={() => onSelect(option.id)} // Handle click event to select the option
                    type={type} // Pass the type of challenge to the card
                />
            ))}
        </div>
    );
};
