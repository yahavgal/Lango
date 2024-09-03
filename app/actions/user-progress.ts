"use server";

import database from "@/database/drizzle"; // Import the database instance
import { and, eq } from "drizzle-orm"; // Import ORM utilities for constructing queries
import { getCourseById, getUserProgress } from "@/database/queries"; // Import functions to fetch course and user progress
import { challengeProgress, challenges, userProgress } from "@/database/schema"; // Import database schemas
import { auth, currentUser } from "@clerk/nextjs/server"; // Import authentication utilities from Clerk
import { revalidatePath } from "next/cache"; // Import function to revalidate Next.js paths
import { redirect } from "next/navigation"; // Import function to handle redirects in Next.js

/**
 * upsertUserProgress is an asynchronous function that updates or inserts the user's progress 
 * for a specific course. If the user's progress already exists, it updates the record, 
 * otherwise it inserts a new one. The function also revalidates necessary paths and redirects 
 * the user to the learning page.
 * 
 * @param {number} courseId - The ID of the course to associate with the user's progress.
 * @throws {Error} - Throws an error if the user or course is not found.
 */
export const upsertUserProgress = async (courseId: number) => {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("User not found");
    }

    const course = await getCourseById(courseId);

    if (!course) {
        throw new Error("Course not found");
    }

    // TODO: Add logic to handle user progress upsertion
    // if (!course.units.length || !course.units[0].lessons.length) {
    //     throw new Error("Course has no lessons");
    // }

    const existingUserProgress = await getUserProgress();

    if (existingUserProgress) {
        await database.update(userProgress).set({
            activeCourseId: courseId,
            userName: user.firstName || "user",
            userImageSrc: user.imageUrl || "mascot.svg",
        });
        revalidatePath("/courses");
        revalidatePath("/learn");
        redirect("/learn");
    } else {
        await database.insert(userProgress).values({
            userId,
            activeCourseId: courseId,
            userName: user.firstName || "user",
            userImageSrc: user.imageUrl || "mascot.svg",
        });

        revalidatePath("/courses");
        revalidatePath("/learn");
        redirect("/learn");
    }
};

/**
 * ReduceHeartsResult type defines the structure of the result returned by the reduceHearts function.
 * @typedef {Object} ReduceHeartsResult
 * @property {string} error - Describes any error that occurred, or is empty if the operation was successful.
 */

export type ReduceHeartsResult = { error: string };

/**
 * reduceHearts is an asynchronous function that reduces the user's hearts by 1 when they attempt 
 * a new challenge. If the user has already completed the challenge, or if they have no hearts 
 * remaining, the function returns an appropriate error.
 * 
 * @param {number} challengeId - The ID of the challenge to attempt.
 * @returns {Promise<ReduceHeartsResult>} - Returns an object indicating success or the type of error encountered.
 */
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

    return { error: "" }; // Indicates success with no error
};

/**
 * refillHearts is an asynchronous function that refills the user's hearts to the maximum of 10 
 * if they have enough points. If the user already has full hearts or lacks the required points, 
 * the function throws an appropriate error.
 * 
 * @throws {Error} - Throws an error if the user progress is not found, if the hearts are already full, 
 *                   or if the user lacks enough points.
 */
export const refillHearts = async () => {
    const currentUserProgress = await getUserProgress();

    if (!currentUserProgress) {
        throw new Error("User progress not found");
    }

    if (currentUserProgress.hearts === 10) {
        throw new Error("Hearts are full");
    }

    if (currentUserProgress.points < 50) {
        throw new Error("Not enough points");
    }

    await database.update(userProgress).set({
        hearts: 10,
        points: currentUserProgress.points - 50,
    }).where(eq(userProgress.userId, currentUserProgress.userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
};
