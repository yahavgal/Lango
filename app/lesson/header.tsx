/* Imports */
import { Progress } from "@/components/ui/progress"; // Import the Progress component for the progress bar
import { useExitModal } from "@/store/use-exit-modal"; // Import hook for managing the exit modal state
import { InfinityIcon, X } from "lucide-react"; // Import icons for infinite hearts and the close (X) button
import Image from "next/image"; // Import the Image component from Next.js for optimized images

// Define the properties (props) that the Header component will accept
type Props = {
    hearts: number; // Number of hearts (lives) the user has
    percentage: number; // Percentage progress in the lesson
    hasActiveSubscription: boolean; // Flag to indicate if the user has an active subscription
};

// Header component that displays the progress bar, hearts (or infinite icon if subscribed), and exit button
export const Header = ({ hearts, percentage, hasActiveSubscription }: Props) => {
    // Destructure the `open` function from the `useExitModal` hook to handle opening the exit modal
    const { open } = useExitModal();

    return (
        <header className="flex items-center justify-between lg:pt-[50px] pt-[20px] px-10 gap-x-7 max-w-[1140px] mx-auto w-full">
            {/* Exit button (X icon) that opens the exit modal when clicked */}
            <X 
                onClick={open} // Trigger the exit modal
                className="text-slate-500 hover:opacity-75 transition cursor-pointer" // Styling for the button with hover effect
            />
            
            {/* Progress bar showing the user's progress in the lesson */}
            <Progress value={percentage} />

            {/* Display hearts or infinity icon if the user has an active subscription */}
            <div className="flex items-center text-rose-500 font-bold">
                {/* Heart icon for lives */}
                <Image src="/heart.svg" height={28} width={28} alt="heart" className="mr-2" /> 
                {hasActiveSubscription 
                    ? <InfinityIcon className="h-6 w-6 stroke-[3]" /> // Show infinity icon if the user has an active subscription
                    : hearts // Otherwise, show the number of hearts
                }
            </div>
        </header>
    )
}
