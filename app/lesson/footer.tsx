/* Imports */
import { useKey, useMedia } from "react-use"; // Hooks for handling keyboard events and media queries
import { CheckCircle, XCircle } from "lucide-react"; // Icons for indicating correct and wrong statuses

import { cn } from "@/lib/utils"; // Utility function for conditional class names
import { Button } from "@/components/ui/button"; // Button component

// Define the properties (props) that the Footer component will accept
type Props = {
    onCheck: () => void; // Function to handle the check button click event
    status: "correct" | "wrong" | "none" | "completed"; // Status of the lesson or task
    disabled?: boolean; // Flag to disable the check button
    lessonId?: number; // ID of the lesson (optional)
};

// Footer component that renders different elements based on the status
export const Footer = ({ onCheck, status, disabled, lessonId }: Props) => {
    // useKey hook to trigger the onCheck function when the "Enter" key is pressed
    useKey("Enter", onCheck, {}, [onCheck]);

    // useMedia hook to determine if the screen size is mobile
    const isMobile = useMedia("(max-width: 1024px)");

    return (
        <footer className={cn(
            "lg:-h[140px] h-[100px] border-t-2", // Base styles for the footer
            status === "correct" && "border-transparent bg-purple-100", // Style for correct status
            status === "wrong" && "border-transparent bg-rose-100", // Style for wrong status
        )}>
            <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
                {/* Display message for correct status */}
                {status === "correct" && (
                    <div className="text-purple-500 font-bold text-base lg:text-2xl flex items-center"> 
                        <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" /> {/* Correct icon */}
                        Nicely done!
                    </div>    
                )}
                {/* Display message for wrong status */}
                {status === "wrong" && (
                    <div className="text-rose-500 font-bold text-base lg:text-2xl flex items-center"> 
                        <XCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" /> {/* Wrong icon */}
                        Try again.
                    </div>    
                )}
                {/* Display button for completed status */}
                {status === "completed" && (
                    <Button variant="default" size={isMobile ? "sm" : "lg"} onClick={() => window.location.href = `/lesson/${lessonId}`}>
                        Practice again.
                    </Button>
                )}
                {/* Main action button (Check, Next, Retry, Continue) */}
                <Button
                    className="ml-auto" // Align to the right
                    disabled={disabled} // Disable the button if the disabled prop is true
                    onClick={onCheck} // Trigger onCheck function on click
                    size={isMobile ? "sm" : "lg"} // Adjust button size for mobile screens
                    variant={status === "wrong" ? "danger" : "secondary"} // Style button based on status
                >
                    {/* Button label based on the current status */}
                    {status === "none" && "Check"}
                    {status === "correct" && "Next"}
                    {status === "wrong" && "Retry"}
                    {status === "completed" && "Continue"}
                </Button>
            </div>
        </footer>
    );
};
