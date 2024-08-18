/* Imports */
import { relations } from "drizzle-orm"; 
import { integer, pgEnum, pgTable, serial, text, boolean } from "drizzle-orm/pg-core"; 
// Imports necessary functions and types from Drizzle ORM to define PostgreSQL tables and their relationships

/* Export */

/**
 * Defines the schema for the "courses" table using Drizzle ORM.
 * 
 * @constant
 * @type {object}
 * @property {serial} id - The primary key of the table, auto-incremented.
 * @property {text} title - The title of the course, required (not nullable).
 * @property {text} imageSrc - The image source for the course, required (not nullable).
 */
export const courses = pgTable("courses", {
    id: serial("id").primaryKey(), // Primary key column, auto-incremented
    title: text("title").notNull(), // Title column, cannot be null
    imageSrc: text("image_src").notNull(), // Image source column, cannot be null
});

/**
 * Defines the relationships for the "courses" table.
 * 
 * @constant
 * @type {object}
 * @property {many} userProgress - Establishes a one-to-many relationship with the "user_progress" table.
 */

export const coursesRelations = relations(courses, ({ many }) => ({
    userProgress: many(userProgress),
    units: many(units),
}));

export const units = pgTable("units", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
    course: one(courses, {
        fields: [units.courseId],
        references: [courses.id],
    }),
    lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    unit: one(units, {
        fields: [lessons.unitId],
        references: [units.id],
    }),
    challenges: many(challenges),
}));

export const challengesEnums = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
    type: challengesEnums("type").notNull(),
    question: text("question").notNull(),
    order: integer("order").notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
    lesson: one(lessons, {
        fields: [challenges.lessonId],
        references: [lessons.id],
    }),
    challengeOptions: many(challengeOptions),
    challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challengeOptions", {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    text: text("text").notNull(),
    correct: boolean("correct").notNull(),
    imageSrc: text("image_src"),
    audioSrc: text("audio_src"),
});

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeOptions.challengeId],
        references: [challenges.id],
    }),
}));

export const challengeProgress = pgTable("challengeProgress", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(), // TODO: Confirm this doesn't break anything
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeProgress.challengeId],
        references: [challenges.id],
    }),
}));

/**
 * Defines the schema for the "user_progress" table using Drizzle ORM.
 * 
 * @constant
 * @type {object}
 * @property {text} userId - The primary key of the table, representing the user's ID.
 * @property {text} userName - The name of the user, required (not nullable) with a default value of "User".
 * @property {text} userImageSrc - The image source for the user, required (not nullable) with a default value of "mascot.svg".
 * @property {integer} activeCourseId - A foreign key that references the "id" column in the "courses" table. 
 *                                      If the referenced course is deleted, this field cascades (deletes the related row).
 * @property {integer} hearts - The number of hearts (a point system) the user has, required (not nullable) with a default value of 10.
 * @property {integer} points - The number of points the user has, required (not nullable) with a default value of 0.
 */
export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(), // Primary key column for the user
    userName: text("user_name").notNull().default("User"), // User name column, cannot be null, with a default value
    userImageSrc: text("user_image_src").notNull().default("mascot.svg"), // User image source column, cannot be null, with a default value
    activeCourseId: integer("active_course_id").references(() => courses.id, { onDelete: "cascade" }), 
    // Foreign key column, references the "id" column in the "courses" table
    hearts: integer("hearts").notNull().default(10), // Hearts column, cannot be null, with a default value
    points: integer("points").notNull().default(0), // Points column, cannot be null, with a default value
});

/**
 * Defines the relationships for the "user_progress" table.
 * 
 * @constant
 * @type {object}
 * @property {one} activeCourse - Establishes a one-to-one relationship with the "courses" table.
 *                                 Maps the "active_course_id" in "user_progress" to the "id" in "courses".
 */
export const UserProgressRelations = relations(userProgress, ({ one }) => ({
    activeCourse: one(courses, {
        fields: [userProgress.activeCourseId],  // The field in the "user_progress" table that references the "courses" table
        references: [courses.id],  // The corresponding field in the "courses" table
    }),
}));
