/* Imports */
import { Button } from "@/components/ui/button";  // Importing the Button component from the UI library
import { NotebookText } from "lucide-react";  // Importing the NotebookText icon from the lucide-react library
import Link from "next/link";  // Importing Link from Next.js for client-side navigation

/**
 * Props type definition for the `UnitBanner` component.
 * 
 * @typedef {Object} Props
 * @property {string} title - The title of the unit to be displayed in the banner.
 * @property {string} description - The description of the unit to be displayed in the banner.
 */
type Props = {
    title: string;
    description: string;
};

/**
 * `UnitBanner` component renders a banner with a title, description, and a button to continue to the next lesson.
 * The banner is styled with a purple background and white text, and the button navigates to the lesson page.
 * 
 * @param {Props} props - The props for the component.
 * @param {string} props.title - The title of the unit to be displayed.
 * @param {string} props.description - The description of the unit to be displayed.
 * 
 * @returns {JSX.Element} A banner component displaying unit information with a call-to-action button.
 */
export const UnitBanner = ({ title, description }: Props): JSX.Element => {
    return (
        <div className="flex items-center justify-between w-full rounded-xl bg-purple-500 p-5 text-white mt-10">
            {/* Title and description section */}
            <div className="space-y-2.5">
                <h3 className="text-2xl font-bold">
                    {title}
                </h3>
                <p className="text-lg">
                    {description}
                </p>
            </div>
            {/* Continue button linking to the lesson page */}
            <Link href="/lesson">
                <Button size="lg" variant="secondary" className="hidden lg:flex border-2 border-b-4 active:border-b-2">
                    <NotebookText className="mr-2"/>
                    Continue
                </Button>
            </Link>
        </div>
    );
};
