"use client";

/**
 * Import the `courses` schema from the database and the `Card` component.
 */
import { courses, userProgress } from "@/database/schema";
import { Card } from "./card";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { upsertUserProgress } from "@/app/actions/user-progress";
import { toast } from "sonner";

type Props = {
    courses: typeof courses.$inferSelect[];
    activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
};

/**
 * `List` component renders a grid of course cards. Each card displays the title and image of a course.
 * The card for the active course (determined by `activeCourseId`) is highlighted.
 * 
 * @param {Props} props - The props for the component.
 * @param {typeof courses.$inferSelect[]} props.courses - An array of course objects, each containing the course details such as `id`, `title`, and `imageSrc`.
 * @param {number} props.activeCourseId - The ID of the currently active course, used to highlight the active card.
 * 
 */
export const List = ({ courses, activeCourseId }: Props) => {
    const router = useRouter();
    const [ pending, startTransition ] = useTransition();

    const onClick = ( id: number ) => {
        if(pending) {
            return;
        }
        if(id == activeCourseId) {
            return router.push("/learn");
        }

        startTransition(() => {
            upsertUserProgress(id)
            .catch(() => toast.error("Something went wrong. Please try again."));
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
                    active={course.id === activeCourseId} // Determines if the card is active
                    disabled={pending}                      // Disabled state is false for all cards (can be customized)
                    onClick={onClick}                    // Empty onClick handler (can be customized)
                />
            ))}
        </div>
    );
};
