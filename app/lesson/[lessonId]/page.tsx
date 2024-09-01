/* Imports */
import { getLesson, getUserProgress } from "@/database/queries"; // Import functions to fetch lesson and user progress data
import { redirect } from "next/navigation"; // Import redirect function from Next.js for server-side redirection
import { Quiz } from "../quiz"; // Import the Quiz component

type Props = {
    params: {
        lessonId: number;
    }
}

// LessonPage component (async function component in Next.js)
const LessonIdPage = async ({ params, } : Props) => {
    // Fetch lesson data from the database
    const lesson = await getLesson(params.lessonId);
    // Fetch user progress data from the database
    const userProgress = await getUserProgress();

    // If lesson or user progress data is not available, redirect the user to the "/learn" page
    if (!lesson || !userProgress) {
        redirect("/learn");
    }

    // Calculate the initial completion percentage based on the number of completed challenges
    const initialPercentage = lesson.challenges.filter((challenge) => challenge.completed).length / lesson.challenges.length * 100;

    // Render the Quiz component with the necessary initial data
    return (
        <Quiz
            initialLessonId={lesson.id} // Pass the lesson ID to the Quiz component
            initialLessonChallenges={lesson.challenges} // Pass the lesson challenges to the Quiz component
            initialHearts={userProgress.hearts} // Pass the user's hearts (lives) to the Quiz component
            initialPercentage={initialPercentage} // Pass the calculated completion percentage to the Quiz component
            userSubscription={undefined} // Placeholder for user subscription data (replace with actual data if needed)
        />
    );
}

export default LessonIdPage;
