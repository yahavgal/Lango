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
import { useExitModal } from "../../store/use-exit-modal";
import { Button } from "../ui/button";

/**
 * ExitModal Component
 *
 * This component renders a modal that prompts the user when they attempt to exit a lesson.
 * The modal asks for confirmation before the user leaves the session, giving them options to continue learning or end the session.
 *
 * @returns {JSX.Element | null} - The rendered ExitModal component or null if not rendered on the client.
 */
export const ExitModal = () => {
    const router = useRouter(); // Next.js router for navigation.
    const [isClient, setIsClient] = useState(false); // State to check if the component is running on the client.
    const { isOpen, close } = useExitModal(); // State and action to control the modal's visibility.

    /**
     * useEffect Hook
     *
     * This hook sets the `isClient` state to true when the component is mounted, ensuring that the modal only renders on the client-side.
     */
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Return null if not running on the client, preventing the modal from rendering on the server.
    if (!isClient) return null;

    /**
     * JSX Rendering
     *
     * Renders the ExitModal dialog. The modal includes a title, a description, and two buttons: one to continue learning and one to end the session.
     */
    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image src="/mascot_sad.svg" height={80} width={80} alt="Sad mascot" />
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Wait, don&apos;t go!
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        You&apos;re about to leave the lesson. Are you sure you want to do that?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button variant="primary" className="w-full" size="lg" onClick={close}>
                            Keep learning
                        </Button>
                        <Button
                            variant="dangerOutline"
                            className="w-full"
                            size="lg"
                            onClick={() => {
                                close();
                                router.push("/learn");
                            }}
                        >
                            End session
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
