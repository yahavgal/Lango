import { FeedWrapper } from "@/components/feed-wrapper"; // Wrapper component for the main content feed
import { StickyWrapper } from "@/components/sticky-wrapper"; // Wrapper component that makes its children sticky
import { UserProgress } from "@/components/user-progress"; // Component to display the user's progress (hearts, points, etc.)
import { getTopTenUsers, getUserProgress } from "@/database/queries"; // Function to fetch user progress from the database
import Image from "next/image"; // Optimized image component from Next.js
import { redirect } from "next/navigation"; // Function to handle redirection in Next.js
import { Separator } from "@/components/ui/separator"; // Component to render a horizontal separator
import { Avatar, AvatarImage } from "@/components/ui/avatar";

/**
 * ShopPage is an asynchronous server-side component that renders the shop page.
 * It fetches the user's progress and displays it alongside the shop items.
 * If the user is not enrolled in an active course, they are redirected to the courses page.
 * 
 * @returns {JSX.Element} - The rendered shop page.
 */
const LeaderboardPage = async () => {
    // Fetch the user's progress, including active course, hearts, and points
    const userProgress = await getUserProgress();

    const leaderboard = await getTopTenUsers();


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
                        src="/leaderboard.svg"
                        alt="Leaderboatd"
                        width={90}
                        height={90}
                    />
                    <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
                        Shop
                    </h1>
                    <p className="text-muted-foreground text-center text-lg mb-6">
                        See where you stand among other learners!
                    </p>
                    <Separator className="mb-4 h-0.5 rounded-full" />
                    {
                        leaderboard.map((user, index) => (
                            <div key={userProgress.userId} className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50" >
                                <p className="font-bold text-purple-700 mr-4">{index + 1}</p>
                                <Avatar className="border bg-purple-500 h-12 w-12 ml-3 mr-6">
                                    <AvatarImage className="object-cover" src={userProgress.userImageSrc} />
                                </Avatar>
                                <p className="font-bold text-neutral-800 flex-1">
                                    {userProgress.userName}
                                </p>
                                <p className="text-muted-foreground">
                                    {userProgress.points} XP
                                </p>
                            </div>
                    ))}
                </div>
            </FeedWrapper>
        </div>
    );
}

export default LeaderboardPage;
