/* Imports */
import Image from 'next/image'; // Import the Image component from Next.js for optimized images

// Define the properties (props) that the QuestionBubble component will accept
type Props = {
    question: string; // The question text to be displayed inside the bubble
};

// QuestionBubble component to display a mascot image and a speech bubble with the question text
export const QuestionBubble = ({ question }: Props) => {
    return (
        <div className='flex items-center gap-x-4 mb-6'>
            {/* Mascot image for large screens (hidden on smaller screens) */}
            <Image src="/mascot.svg" alt="Mascot" width={60} height={60} className="hidden lg:block" />
            
            {/* Mascot image for small screens (hidden on larger screens) */}
            <Image src="/mascot.svg" alt="Mascot" width={40} height={40} className="block lg:hidden" />
            
            {/* Speech bubble containing the question text */}
            <div className='relative py-2 px-4 border-2 rounded-xl text-sm lg:text-base'>
                {question} {/* Render the question text inside the bubble */}
                
                {/* Pointer (triangle) of the speech bubble pointing towards the mascot */}
                <div className='absolute -left-3 top-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-y-1/2 rotate-90' />
            </div>
        </div>
    );
}
