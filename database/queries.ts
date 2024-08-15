import { cache } from "react";
import database from "./drizzle";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { userProgress, courses } from "@/database/schema";

export const getCourses = cache(async () => {
    const response = await database.query.courses.findMany();
    return response;
});

export const getUserProgress = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const response = await database.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with: {
            activeCourse: true,
        },
    });

    return response;
});

export const getCourseById = cache(async (courseId: number) => {
    const response = await database.query.courses.findFirst({
        where: eq(courses.id, courseId),
        // TODO populate with lessons
    })
    return response;
});