"use client";

/* Imports */
import { courses, userProgress } from "@/database/schema";
import { Card } from "./card";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { upsertUserProgress } from "@/app/actions/user-progress";
import { toast } from "sonner";

/**
 * Props type definition for the `List` component.
 * 
 * @typedef {Object} Props
 * @property {typeof courses.$inferSelect[]} courses - An array of course objects, each containing details such as `id`, `title`, and `imageSrc`.
 * @property {number} [activeCourseId] - The ID of the currently active course, used to highlight the active card (optional).
 */
type Props = {
    courses: typeof courses.$inferSelect[];
    activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
};

/**
 * `List` component renders a grid of course cards. Each card displays the title and image of a course.
 * The card corresponding to the `activeCourseId` is highlighted, and clicking on a course triggers a navigation or action based on its state.
 * 
 * @param {Props} props - The props for the component.
 * @param {typeof courses.$inferSelect[]} props.courses - An array of course objects, each containing the course details.
 * @param {number} [props.activeCourseId] - The ID of the currently active course, used to highlight the active card (optional).
 * 
 * @returns {JSX.Element} A grid of course cards.
 */
export const List = ({ courses, activeCourseId }: Props): JSX.Element => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    /**
     * Handles the click event on a course card.
     * 
     * @param {number} id - The ID of the clicked course.
     */
    const onClick = (id: number): void => {
        if (pending) {
            return; // Prevent click actions while a transition is pending
        }
        if (id === activeCourseId) {
            return router.push("/learn"); // If the clicked course is active, navigate to the learning page
        }

        startTransition(() => {
            upsertUserProgress(id) // Update the user's progress with the selected course ID
                .catch(() => toast.error("Something went wrong. Please try again.")); // Show error message if the update fails
        });
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] pt-6">
            {courses.map((course) => (
                <Card
                    key={course.id}                       // Unique key for each card
                    title={course.title}                  // Course title passed to the card
                    imageSrc={course.imageSrc}            // Course image source passed to the card
                    id={course.id}                        // Course ID passed to the card
                    active={course.id === activeCourseId} // Highlights the active card
                    disabled={pending}                    // Disables the card if a transition is pending
                    onClick={onClick}                     // Handles the card click event
                />
            ))}
        </div>
    );
};
