"use server";

import { getUserProgress } from "@/database/queries"; 
import { challengeProgress, challenges, userProgress } from "@/database/schema"; 
import { auth } from "@clerk/nextjs/server"; 
import { and, eq } from "drizzle-orm"; 
import db from "@/database/drizzle"; 
import { revalidatePath } from "next/cache";

export const upsertChallengeProgress = async (challengeId: number) => {
    // Get the authenticated user's ID
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    // Fetch the current user's progress
    const currentUserProgress = await getUserProgress();
    console.log("User Progress:", currentUserProgress);

    if (!currentUserProgress) {
        throw new Error("User progress not found");
    }

    // Fetch the challenge by its ID
    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId)
    });
    console.log("Challenge:", challenge);

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    const lessonId = challenge.lessonId;

    // Check if there's existing progress for this challenge
    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId)
        ),
    });
    console.log("Existing Challenge Progress:", existingChallengeProgress);

    const isPractice = !!existingChallengeProgress;

    if (currentUserProgress.hearts === 0 && !isPractice) {
        return { error: "hearts" };
    }

    if (isPractice) {
        // Update existing progress
        await db.update(challengeProgress).set({
            completed: true,
        }).where(
            eq(challengeProgress.id, existingChallengeProgress.id)
        );

        await db.update(userProgress).set({
            hearts: Math.min(currentUserProgress.hearts + 1, 10),
            points: currentUserProgress.points + 10,
        }).where(
            eq(userProgress.userId, userId)
        );

        // Revalidate paths after updates
        await revalidatePath("/learn");
        await revalidatePath("/lesson");
        await revalidatePath("/quests");
        await revalidatePath("/leaderboard");
        await revalidatePath(`/lesson/${lessonId}`);

        console.log("Practice challenge updated and paths revalidated.");
        return;
    }

    // Insert new challenge progress
    await db.insert(challengeProgress).values({
        challengeId,
        userId,
        completed: true,
    });

    await db.update(userProgress).set({
        points: currentUserProgress.points + 10,
    }).where(
        eq(userProgress.userId, userId)
    );

    // Revalidate paths after updates
    await revalidatePath("/learn");
    await revalidatePath("/lesson");
    await revalidatePath("/quests");
    await revalidatePath("/leaderboard");
    await revalidatePath(`/lesson/${lessonId}`);

    console.log("New challenge completed and paths revalidated.");
    return;
};
