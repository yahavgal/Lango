/* Imports */
import { getCourses, getUserProgress } from "@/database/queries";
import { List } from "./list";

/**
 * `CoursesPage` component fetches the list of courses and user progress,
 * and then renders a page displaying the available courses.
 * 
 * The user's progress is used to highlight the currently active course.
 * The `List` component is responsible for rendering the individual course cards.
 * 
 * @async
 * @returns {JSX.Element} A page component displaying the list of courses.
 */
const CoursesPage = (async (): Promise<JSX.Element> => {
    // Fetch the list of courses from the database
    const courses = await getCourses();

    // Fetch the user's progress to determine the active course
    const userProgress = await getUserProgress();

    return (
        <div className="h-full max-w-[912px] px-3 mx-auto">
            {/* Page title */}
            <h1 className="text-2xl font-bold text-neutral-700">
                Courses
            </h1>
            
            {/* Render the list of courses, passing the active course ID */}
            <List courses={courses} activeCourseId={userProgress?.activeCourseId} />
        </div>
    );
});

export default CoursesPage;
