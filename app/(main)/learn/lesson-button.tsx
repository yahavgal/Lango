"use client";

/* Imports */
import { CheckIcon, Crown, Star } from "lucide-react";  // Importing icons from the lucide-react library
import { CircularProgressbarWithChildren } from "react-circular-progressbar";  // Importing the circular progress bar component
import "react-circular-progressbar/dist/styles.css";  // Importing the styles for the circular progress bar
import { cn } from "@/lib/utils";  // Importing a utility function for conditional class names
import { Button } from "@/components/ui/button";  // Importing the Button component from the UI library
import Link from "next/link";  // Importing Link from Next.js for client-side navigation

/**
 * Props type definition for the `LessonButton` component.
 * 
 * @typedef {Object} Props
 * @property {number} id - The unique ID of the lesson.
 * @property {number} index - The index of the lesson in the list.
 * @property {number} totalCount - The total number of lessons.
 * @property {boolean} [locked] - Indicates whether the lesson is locked (optional).
 * @property {boolean} [current] - Indicates whether the lesson is the current active lesson (optional).
 * @property {number} percentage - The completion percentage of the lesson.
 */
type Props = {
    id: number;
    index: number;
    totalCount: number;
    locked?: boolean;
    current?: boolean;
    percentage: number;
};

/**
 * `LessonButton` component renders a button for each lesson in the course.
 * The button appearance changes based on the lesson's state (completed, current, locked).
 * The button is linked to the lesson page unless it is locked.
 * 
 * @param {Props} props - The props for the component.
 * @param {number} props.id - The unique ID of the lesson.
 * @param {number} props.index - The index of the lesson in the list.
 * @param {number} props.totalCount - The total number of lessons.
 * @param {boolean} [props.locked] - Whether the lesson is locked, disabling interaction.
 * @param {boolean} [props.current] - Whether the lesson is the current active lesson.
 * @param {number} props.percentage - The completion percentage of the lesson.
 * 
 * @returns {JSX.Element} A lesson button component.
 */
export const LessonButton = ({ id, index, totalCount, locked, current, percentage }: Props): JSX.Element => {
    const cycleLength = 8;
    const cycleIndex = index % cycleLength;

    // Determine the indentation level based on the cycle index
    let indentationLevel;

    if (cycleIndex <= 2) {
        indentationLevel = cycleIndex;
    } else if (cycleIndex <= 4) {
        indentationLevel = 4 - cycleIndex;
    } else if (cycleIndex <= 6) {
        indentationLevel = 4 - cycleIndex;
    } else {
        indentationLevel = cycleIndex - 8;
    }

    // Calculate the right position based on the indentation level
    const rightPosition = indentationLevel * 40;
    const isFirst = index === 0;
    const isLast = index === totalCount;
    const isCompleted = !current && !locked;
    const Icon = isCompleted ? CheckIcon : isLast ? Crown : Star;  // Select the icon based on the lesson state
    const href = isCompleted ? `/lesson/${id}` : "/lesson";  // Determine the link based on the lesson state

    return (
        <Link href={href} aria-disabled={locked} style={{ pointerEvents: locked ? "none" : "auto" }}>
            <div className="relative" style={{
                right: `${rightPosition}px`,
                marginTop: isFirst && !isCompleted ? 60 : 24,
            }}>
                {current ? (
                    // Render the current lesson with a progress bar
                    <div className="h-[102px] w-[102px] relative">
                        <div className="absolute -top-6 left-2.5 px-3 py-2.5 border-2 font-bold uppercase text-purple-500 bg-white rounded-xl animate-bounce tracking-wide z-10">
                            Start
                            <div
                                className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2" 
                            />
                        </div>
                        <CircularProgressbarWithChildren
                            value={Number.isNaN(percentage) ? 0 : percentage}
                            styles={{
                                path: {
                                    stroke: "#6C5DD3",
                                },
                                trail: {
                                    stroke: "#E5E5E5",
                                },
                            }}
                        >
                            <Button size="rounded" variant={locked ? "locked" : "secondary"} className="h-[70px] w-[70px] border-b-8">
                                <Icon
                                    className={cn(
                                        "h-10 w-10", 
                                        locked ? "fill-neutral-400 text-neutral-400 stroke-neutral-400" : "fill-primary-foreground text-primary-foreground", 
                                        isCompleted && "fill-none stroke-[4]"
                                    )}
                                />
                            </Button>
                        </CircularProgressbarWithChildren>
                    </div>
                ) : (
                    // Render the non-current lesson button
                    <Button size="rounded" variant={locked ? "locked" : "secondary"} className="h-[70px] w-[70px] border-b-8">
                        <Icon
                            className={cn(
                                "h-10 w-10", 
                                locked ? "fill-neutral-400 text-neutral-400 stroke-neutral-400" : "fill-primary-foreground text-primary-foreground", 
                                isCompleted && "fill-none stroke-[4]"
                            )}
                        />
                    </Button>   
                )}
            </div>
        </Link>
    );
};
