/* Imports */
import { redirect } from "next/navigation";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Header } from "./header";
import { getUserProgress } from "@/database/queries";


/* Component */
const LearnPage = async () => {
    const userProgress = await getUserProgress();

    if(!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress activeCourse={userProgress.activeCourse} hearts={userProgress.hearts} points={userProgress.points} hasActiveSubscription={false} />
            </StickyWrapper>
            <FeedWrapper>
                <Header title={userProgress.activeCourse.title} />
            </FeedWrapper>
        </div>
    );
    }

export default LearnPage;