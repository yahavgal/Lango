"use client";

/* Imports */
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import { useHeartsModal } from "../../store/use-hearts-modal";
import { Button } from "../ui/button";

/**
 * HeartsModal Component
 *
 * This component renders a modal that informs the user they've run out of hearts (lives) and encourages them to get unlimited hearts by upgrading to Pro.
 * The modal provides options to either visit the store to upgrade or to close the modal and continue without upgrading.
 *
 * @returns {JSX.Element | null} - The rendered HeartsModal component or null if not rendered on the client.
 */
export const HeartsModal = () => {
    const router = useRouter(); // Next.js router for navigation.
    const [isClient, setIsClient] = useState(false); // State to determine if the component is running on the client.
    const { isOpen, close } = useHeartsModal(); // Hook to control the modal's visibility.

    /**
     * useEffect Hook
     *
     * Sets the `isClient` state to true when the component is mounted, ensuring that the modal only renders on the client-side.
     */
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Return null if not running on the client, preventing the modal from rendering on the server.
    if (!isClient) return null;

    /**
     * Handles the click event to close the modal and navigate to the store.
     */
    const onClick = () => {
        close();
        router.push("/store");
    };

    /**
     * JSX Rendering
     *
     * Renders the HeartsModal dialog. The modal includes a title, a description, and two buttons: one to navigate to the store and another to close the modal.
     */
    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image src="/mascot_bad.svg" height={80} width={80} alt="Sad mascot" />
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        You ran out of hearts!
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Get Pro to get unlimited hearts and keep learning!
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button variant="primary" className="w-full" size="lg" onClick={onClick}>
                            Get unlimited hearts
                        </Button>
                        <Button variant="primaryOutline" className="w-full" size="lg" onClick={close}>
                            No thanks
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
