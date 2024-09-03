import { FeedWrapper } from "@/components/feed-wrapper"; // Wrapper component for the main content feed
import { StickyWrapper } from "@/components/sticky-wrapper"; // Wrapper component that makes its children sticky
import { UserProgress } from "@/components/user-progress"; // Component to display the user's progress (hearts, points, etc.)
import { getUserProgress } from "@/database/queries"; // Function to fetch user progress from the database
import Image from "next/image"; // Optimized image component from Next.js
import { redirect } from "next/navigation"; // Function to handle redirection in Next.js
import { Items } from "./items"; // Component to display available items in the shop

/**
 * ShopPage is an asynchronous server-side component that renders the shop page.
 * It fetches the user's progress and displays it alongside the shop items.
 * If the user is not enrolled in an active course, they are redirected to the courses page.
 * 
 * @returns {JSX.Element} - The rendered shop page.
 */
const ShopPage = async () => {
    // Fetch the user's progress, including active course, hearts, and points
    const userProgress = await getUserProgress();

    // Redirect the user to the courses page if they have no active course
    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            {/* StickyWrapper makes the UserProgress component sticky on scroll */}
            <StickyWrapper>
                <UserProgress
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={false}
                />
            </StickyWrapper>
            {/* FeedWrapper wraps the main content of the shop page */}
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <Image
                        src="/shop.svg"
                        alt="Shop"
                        width={90}
                        height={90}
                    />
                    <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
                        Shop
                    </h1>
                    <p className="text-muted-foreground text-center text-lg mb-6">
                        Spend your hard-earned points on exclusive items in the shop!
                    </p>
                    <Items 
                        hearts={userProgress.hearts}
                        points={userProgress.points}
                        hasActiveSubscription={false}
                    />
                </div>
            </FeedWrapper>
        </div>
    );
}

export default ShopPage;
