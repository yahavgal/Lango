/* Imports */
// No additional imports required for this component

// Define the properties (props) that the LessonLayout component will accept
type Props = {
    children: React.ReactNode; // ReactNode type allows any valid React child elements (e.g., JSX, strings, arrays of elements, etc.)
};

// LessonLayout component to wrap content in a full-height, flexbox layout
const LessonLayout = ({ children }: Props) => {
    return (
        <div className="flex flex-col h-full">
            {/* Main container for the layout */}
            <div className="flex flex-col h-full w-full">
                {/* Render any child elements passed into the layout */}
                {children}
            </div>
        </div>
    )
};

export default LessonLayout;
