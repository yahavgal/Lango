"use server";

import database from "@/database/drizzle";
import { getCourseById, getUserProgress } from "@/database/queries";
import { userProgress } from "@/database/schema";
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
