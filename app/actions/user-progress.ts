"use server";

import database from "@/database/drizzle";
import { and, eq } from "drizzle-orm";
import { getCourseById, getUserProgress } from "@/database/queries";
import { challengeProgress, challenges, userProgress } from "@/database/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (courseId: number) => {
    const { userId } = await auth();
    const user = await currentUser();

    if(!userId || !user) {
        throw new Error("User not found");
    }

    const course = await getCourseById(courseId);

    if(!course) {
        throw new Error("Course not found");
    }

    // TODO add user progress upsert logic
    // if(!course.units.length || !course.units[0].lessons.length) {
    //     throw new Error("Course has no lessons");
    // }

    const existingUserProgress = await getUserProgress();


    if(existingUserProgress) {
        await database.update(userProgress).set({
            activeCourseId: courseId,
            userName: user.firstName || "user",
            userImageSrc: user.imageUrl || "mascot.svg",
        });
        revalidatePath("/courses");
        revalidatePath("/learn");
        redirect("/learn");
    }

    await database.insert(userProgress).values({
        userId,
        activeCourseId: courseId,
        userName: user.firstName || "user",
        userImageSrc: user.imageUrl || "mascot.svg",
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");


};


export type ReduceHeartsResult = { error: string };

export const reduceHearts = async (challengeId: number): Promise<ReduceHeartsResult> => {
    const { userId } = await auth();

    if (!userId) {
        return { error: "Unauthorized" };
    }

    const currentUserProgress = await getUserProgress();

    const challenge = await database.query.challenges.findFirst({
        where: eq(challenges.id, challengeId),
    });

    if (!challenge) {
        return { error: "Challenge not found" };
    }

    const lessonId = challenge.lessonId;

    const existingChallengeProgress = await database.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId),
        )
    });

    const isPractice = !!existingChallengeProgress;

    if (isPractice) {
        return { error: "practice" };
    }

    if (!currentUserProgress) {
        return { error: "User progress not found" };
    }

    if (currentUserProgress.hearts === 0) {
        return { error: "hearts" };
    }

    await database.update(userProgress).set({
        hearts: Math.max(currentUserProgress.hearts - 1, 0),
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);

    return { error: "" }; // This indicates success with no error
};
