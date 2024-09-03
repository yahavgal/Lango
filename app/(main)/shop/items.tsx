"use client"

import { refillHearts } from "@/app/actions/user-progress"; // Import the refillHearts function to handle heart refills
import { Button } from "@/components/ui/button"; // Import the Button component for user interactions
import Image from "next/image"; // Import the Image component for optimized image rendering
import { useTransition } from "react"; // Import useTransition for handling transitions
import { toast } from "sonner"; // Import toast for displaying notifications

/**
 * Props type for the Items component.
 * @property {number} hearts - The current number of hearts the user has (maximum is 10).
 * @property {number} points - The current number of points the user has.
 * @property {boolean} hasActiveSubscription - Whether the user has an active subscription.
 */
type Props = {
    hearts: number;
    points: number;
    hasActiveSubscription: boolean;
}

/**
 * Items component displays the user's hearts and allows them to refill hearts using points.
 * 
 * @param {Props} props - The props for the Items component.
 * @returns {JSX.Element} - The rendered Items component.
 */
export const Items = ({ hearts, points, hasActiveSubscription }: Props) => {
    const [pending, startTransition] = useTransition(); // Handles the pending state of the transition

    /**
     * Handles the heart refill action. Prevents refilling if the hearts are already full,
     * the user doesn't have enough points, or a refill is already in progress.
     */
    const onRefillHearts = () => {
        // Prevent action if already pending, hearts are full, or not enough points
        if (pending || hearts === 10 || points < 50) return;

        // Start the transition to refill hearts
        startTransition(() => {
            refillHearts()
                .catch(() => toast.error("Failed to refill hearts")); // Display an error toast if the refill fails
        });
    }

    return (
        <ul className="w-full">
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
                <Image 
                    src="/heart.svg"
                    alt="Heart"
                    width={60}
                    height={60}
                />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Refill Hearts
                    </p>
                </div>
                <Button onClick={onRefillHearts} disabled={pending || hearts === 10 || points < 50}>
                    {hearts === 10 ? "full" : (
                        <div className="flex items-center">
                            <Image 
                                src="/points.svg"
                                alt="Points"
                                width={20}
                                height={20}
                            />
                            <p>
                                50
                            </p>
                        </div>
                    )}
                </Button>
            </div>
        </ul>
    )
}
