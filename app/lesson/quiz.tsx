"use client"

import { useState } from "react"; // Import React's useState hook
import { challenges, challengeOptions } from "@/database/schema"; // Import schemas for challenges and challenge options
import { Header } from "./header"; // Import the Header component
import { QuestionBubble } from "./question-bubble"; // Import the QuestionBubble component
import { Challenge } from "./challenge"; // Import the Challenge component
import { Footer } from "./footer"; // Import the Footer component

// Define the properties (props) that the Quiz component will accept
type Props = {
    initialPercentage: number; // Initial percentage progress in the lesson
    initialHearts: number; // Initial number of hearts (lives) the user has
    initialLessonId: number; // ID of the current lesson
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean; // Flag to indicate if the challenge is completed
        challengeOptions: typeof challengeOptions.$inferSelect[]; // Array of options for the challenge
    })[]; // Array of challenges for the lesson, each with completion status and options
    userSubscription: any; // TODO: Replace with the actual type for the user's subscription data
};

// Quiz component to handle the lesson challenges
export const Quiz = ({ initialPercentage, initialHearts, initialLessonId, initialLessonChallenges, userSubscription }: Props) => {
    // State variables to track the current hearts, percentage, and challenges
    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(initialPercentage);
    const [challenges] = useState(initialLessonChallenges);
    
    // Determine the first uncompleted challenge or default to the first challenge
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    // State variables to track the selected option and challenge status
    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

    // Function to handle the selection of an option
    const onSelect = (id: number) => {
        if (status !== "none") return; // Prevent selection if the challenge has already been answered

        setSelectedOption(id); // Set the selected option
    }

    // Get the current active challenge
    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? []; // Get options for the current challenge
    const title = challenge.type === "ASSIST" ? "Select the correct meaning" : challenge.question; // Set the title based on the challenge type

    return (
        <>
            {/* Render the Header component with hearts, percentage, and subscription status */}
            <Header
                hearts={hearts}
                percentage={percentage}
                hasActiveSubscription={!!userSubscription?.isActive}
            />
            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                            {title} {/* Display the title */}
                        </h1>
                        <div className="">
                            {/* Render the QuestionBubble if the challenge type is "ASSIST" */}
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble question={challenge.question} />
                            )}
                            {/* Render the Challenge component with options, selection handler, and status */}
                            <Challenge options={options} onSelect={onSelect} status={status} selectedOption={selectedOption} disabled={false} type={challenge.type} />
                        </div>
                    </div>
                </div>
            </div>
            {/* Render the Footer component with check button and status */}
            <Footer
                disabled={!selectedOption} // Disable the button if no option is selected
                status={status}
                onCheck={() => {}} // TODO: Add the check functionality
            />
        </>
    );
}
