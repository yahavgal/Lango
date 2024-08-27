import { cache } from "react";
import database from "./drizzle";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { userProgress, courses, units, challengeProgress, lessons } from "@/database/schema";

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

export const getUnits = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();
    if(!userId || !userProgress?.activeCourseId) {
        return [];
    }

    // TODO confirm whether order is needed
    const response = await database.query.units.findMany({
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                with: {
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            }
                        },
                    },
                },
            },
        },
    });
    const normalizedResponse = response.map((unit) => {
        const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
            if(lesson.challenges.length === 0) {
                return { ...lesson, completed: false };
            }
            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed);
            });
            return { ...lesson, completed: allCompletedChallenges };
        });
        return { ...unit, lessons: lessonsWithCompletedStatus };
    });

    return normalizedResponse;
});

export const getCourseProgress = cache(async () => {
    const { userId } = await auth();

    const userProgress = await getUserProgress();

    if (!userId || !userProgress?.activeCourseId) {
        return [];
    }

    const unitsInActiveCourse = await database.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with: {
                    unit: true,
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            }
                        },
                    },
                },
            },
        },
    });

    // Find the first uncompleted lesson
    const firstUncompletedLesson = unitsInActiveCourse.flatMap((unit) => unit.lessons).find((lesson) => {
        // If the lesson has no challenges, consider it uncompleted
        if (!lesson.challenges || lesson.challenges.length === 0) {
            return true;
        }
        // Check if any challenge is uncompleted
        return lesson.challenges.some((challenge) => {
            return !challenge.challengeProgress
                || challenge.challengeProgress.length === 0
                || challenge.challengeProgress.some((progress) => !progress.completed);
        });
    });

    return {
        activeLesson: firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson?.id,
    };
});



export const getLesson = cache(async (id?: number) => {
    const { userId } = await auth();

    if(!userId) {
        return null;
    }

    const courseProgress = await getCourseProgress();

    const lessonId = id || (Array.isArray(courseProgress) ? undefined : courseProgress.activeLessonId);

    if(!lessonId) {
        return null;
    }

    const response = await database.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
            with: {
                challengeOptions: true,
                challengeProgress: {
                    where: eq(challengeProgress.userId, userId),
                },
            },
            },
        },
    });
    
    if(!response || !response.challenges) {
        return null;
    }

    const normalizedResponse = response.challenges.map((challenge) => {
        const completed = challenge.challengeProgress && 
            challenge.challengeProgress.length > 0 &&
            challenge.challengeProgress.every((progress) => progress.completed);
        return { ...challenge, completed };
    });

    return { ...response, challenges: normalizedResponse };
});

export const getLessonPercentage = cache(async () => {
    const courseProgress = await getCourseProgress();

    if(Array.isArray(courseProgress) || !courseProgress?.activeLessonId) {
        return 0;
    }

    const lesson = await getLesson(courseProgress.activeLessonId);

    if(!lesson) {
        return 0;
    }

    const completedChallenges = lesson.challenges.filter((challenge) => challenge.completed);
    const percentage = Math.round(
        (completedChallenges.length / lesson.challenges.length) * 100
    )

    return percentage;
});
