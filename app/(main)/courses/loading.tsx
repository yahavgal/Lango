/* Imports */
import { Loader } from "lucide-react";

/**
 * `Loading` component displays a centered loading spinner.
 * 
 * This component is typically used to indicate that content is being loaded,
 * and the user needs to wait. The spinner is centered both vertically and 
 * horizontally within its container, making it suitable for full-page or 
 * section-level loading states.
 * 
 * @returns {JSX.Element} A loading spinner component.
 */
const Loading = (): JSX.Element => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            {/* 
            The Loader icon is animated to spin, indicating loading activity.
            The size of the loader is set to 24x24 pixels (h-6, w-6) and its color 
            is defined by the 'text-muted-foreground' class. 
            */}
            <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
        </div>
    );
};

export default Loading;
