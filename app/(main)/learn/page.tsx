/* Imports */
import { redirect } from "next/navigation";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Header } from "./header";
import { Unit } from "./unit";
import { getUnits, getUserProgress, getCourseProgress, getLessonPercentage } from "@/database/queries";


/* Component */
const LearnPage = async () => {
    const userProgress = await getUserProgress();
    const unitsData = await getUnits();
    const courseProgress = await getCourseProgress();
    const lessonPercentage = await getLessonPercentage();

    if(!userProgress || !userProgress.activeCourse || !courseProgress) {
        redirect("/courses");
    }

    if(Array.isArray(courseProgress) || !courseProgress?.activeLessonId) {
        return 0;
    }


    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress activeCourse={userProgress.activeCourse} hearts={userProgress.hearts} points={userProgress.points} hasActiveSubscription={false} />
            </StickyWrapper>
            <FeedWrapper>
                <Header title={userProgress.activeCourse.title} />
                {unitsData.map((unit) => (
                    <div key={unit.id} className="mb-10">
                        <Unit 
                            id={unit.id} 
                            order={unit.order} 
                            description={unit.description} 
                            title={unit.title} 
                            lessons={unit.lessons} 
                            activeLesson={courseProgress.activeLesson}
                            activeLessonPercentage={lessonPercentage}
                        />
                    </div>    
                ))}
            </FeedWrapper>
        </div>
    );
    }

export default LearnPage;