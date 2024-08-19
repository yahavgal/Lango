/* Imports */
import { Button } from "@/components/ui/button";  // Importing the Button component from the UI library
import { ArrowLeft } from "lucide-react";         // Importing the ArrowLeft icon from the lucide-react library
import Link from "next/link";                     // Importing the Link component from Next.js for client-side navigation

/**
 * Props type definition for the `Header` component.
 * 
 * @typedef {Object} Props
 * @property {string} title - The title to be displayed in the header.
 */
type Props = {
    title: string;
};

/**
 * `Header` component renders a sticky header with a title and a back button.
 * The back button navigates the user to the "/courses" page.
 * 
 * @param {Props} props - The props for the component.
 * @param {string} props.title - The title to display in the header.
 * 
 * @returns {JSX.Element} A header component with a title and a back button.
 */
export const Header = ({ title }: Props): JSX.Element => {
    return (
        <div className="flex items-center justify-between sticky top-0 bg-white pb-3 mb-5 text-neutral-400 lg:mt-[-28px] lg:pt-[28px] border-b-2 lg:z-50">
            {/* Back button that links to the courses page */}
            <Link href="/courses">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
                </Button>
            </Link>
            
            {/* Header title */}
            <h1 className="font-bold text-lg">
                {title}
            </h1>
            
            {/* Empty div to balance the layout */}
            <div />
        </div>
    );
};
