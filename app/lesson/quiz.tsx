"use client";

/* Imports */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { challenges, challengeOptions } from "@/database/schema";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "../actions/challenge-progress";
import { toast } from "sonner";
import { useAudio, useWindowSize, useMount } from "react-use";
import { reduceHearts, ReduceHeartsResult } from "../actions/user-progress";
import Image from "next/image";
import { ResultCard } from "./result-card";
import Confetti from "react-confetti";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

/* Props Type Definition */
type Props = {
    initialPercentage: number; // The initial completion percentage of the lesson.
    initialHearts: number; // The initial number of hearts (lives) the user has.
    initialLessonId: number; // The ID of the lesson being taken.
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean; // Whether the challenge has been completed.
        challengeOptions: typeof challengeOptions.$inferSelect[]; // The options available for each challenge.
    })[];
    userSubscription: any; // The user's subscription status.
};

/**
 * Quiz Component
 *
 * This component renders a quiz interface where users can answer challenges. It manages the user's progress, updates their score, and handles the state of the quiz.
 * The component is responsive, plays audio feedback, and renders confetti on lesson completion.
 *
 * @param {number} initialPercentage - The initial completion percentage of the lesson.
 * @param {number} initialHearts - The initial number of hearts (lives) the user has.
 * @param {number} initialLessonId - The ID of the lesson being taken.
 * @param {Array<Object>} initialLessonChallenges - An array of challenge objects representing each quiz challenge.
 * @param {boolean} initialLessonChallenges.completed - Indicates whether the challenge is completed.
 * @param {Array<Object>} initialLessonChallenges.challengeOptions - The options available for each challenge.
 * @param {any} userSubscription - The user's subscription status (e.g., free, premium).
 */
export const Quiz = ({
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription,
}: Props) => {
    const { width, height } = useWindowSize(); // Get the current window size for rendering the confetti.
    const router = useRouter(); // Next.js router for navigation.
    const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true }); // Audio for lesson completion.

    const { open: openHeartsModal } = useHeartsModal(); // Modal for displaying when hearts are depleted.
    const { open: openPracticeModal } = usePracticeModal(); // Modal for displaying when practice mode is activated.

    useMount(() => {
        if(initialPercentage === 100) {
            openPracticeModal();
        }
    });

    const [
        correctAudio,
        _c,
        correctControls,
    ] = useAudio({ src: "/correct.wav" }); // Audio for correct answer feedback.
    const [
        incorrectAudio,
        _i,
        incorrectControls,
    ] = useAudio({ src: "/correct.wav" }); // Audio for incorrect answer feedback.
    const [pending, startTransition] = useTransition(); // Handles transitions for async state updates.
    const [lessonId] = useState(initialLessonId); // State for the current lesson ID.
    const [hearts, setHearts] = useState(initialHearts); // State for the user's hearts (lives).
    const [percentage, setPercentage] = useState(() => {
        return initialPercentage === 100 ? 0 : initialPercentage;
    }); // State for the lesson completion percentage.
    const [challenges] = useState(initialLessonChallenges); // State for the array of challenges.

    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex(
            (challenge) => !challenge.completed
        );
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    }); // State for tracking the index of the current challenge.

    const [selectedOption, setSelectedOption] = useState<number>(); // State for tracking the selected option.
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none"); // State for tracking the status of the answer.

    /**
     * Handles the selection of an option in the quiz.
     * @param {number} id - The ID of the selected option.
     */
    const onSelect = (id: number) => {
        if (status !== "none") return;
        setSelectedOption(id);
    };

    const challenge = challenges[activeIndex]; // Get the current challenge.
    const options = challenge?.challengeOptions ?? []; // Get the options for the current challenge.

    if(!challenge) {
        return (
            <>
                {finishAudio}
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    tweenDuration={10000}
                />
                <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                    <Image 
                        src="/finish.svg"
                        alt="Finish"
                        className="hidden lg:block"
                        height={100}
                        width={100}
                    />
                    <Image 
                        src="/finish.svg"
                        alt="Finish"
                        className="block lg:hidden"
                        height={50}
                        width={50}
                    />
                    <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                        Great Job! <br /> You&apos;ve completed the lesson.
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard
                            variant="points"
                            value={challenges.length * 10}
                        />
                        <ResultCard
                            variant="hearts"
                            value={hearts}
                        />
                    </div>
                </div>
                <Footer
                    lessonId={lessonId}
                    status="completed"
                    onCheck={() => router.push(`/learn`)}
                />
            </>
        )
    }

    const title =
        challenge.type === "ASSIST"
            ? "Select the correct meaning"
            : challenge.question;

    /**
     * Advances to the next challenge in the quiz.
     */
    const onNext = () => {
        setActiveIndex((current) => current + 1);
    };

    /**
     * Handles the continuation of the quiz after an option is selected.
     */
    const onContinue = () => {
        if (!selectedOption) return;

        if (status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        if (status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        const correctOption = options.find((option) => option.correct);

        if (!correctOption) {
            return;
        }

        if (correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            openHeartsModal();
                            return;
                        }

                        correctControls.play();
                        setStatus("correct");
                        setPercentage(
                            (prev) => prev + 100 / challenges.length
                        );

                        if (initialPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, 10));
                        }
                    })
                    .catch(() =>
                        toast.error("An error occurred. Please try again.")
                    );
            });
        } else {
            startTransition(() => {
                reduceHearts(challenge.id)
                    .then((response: ReduceHeartsResult) => {
                        if (response.error === "hearts") {
                            openHeartsModal();
                            return;
                        }

                        incorrectControls.play();
                        setStatus("wrong");

                        if (!response.error) {
                            setHearts((prev) => Math.max(prev - 1, 0));
                        }
                    })
                    .catch(() =>
                        toast.error("An error occurred. Please try again.")
                    );
            });
        }
    };

    return (
        <>
            {correctAudio}
            {incorrectAudio}
            <Header
                hearts={hearts}
                percentage={percentage}
                hasActiveSubscription={!!userSubscription?.isActive}
            />
            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                            {title}
                        </h1>
                        <div className="">
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble question={challenge.question} />
                            )}
                            <Challenge
                                options={options}
                                onSelect={onSelect}
                                status={status}
                                selectedOption={selectedOption}
                                disabled={pending}
                                type={challenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer
                disabled={pending || !selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    );
};
