/* Imports */
import { Button } from "@/components/ui/button"; // Import Button component for consistent UI
import Image from "next/image"; // Import Next.js optimized Image component

/* Assets */
import hr from "../../public/hr.svg"; // Import Croatian flag image asset
import es from "../../public/es.svg"; // Import Spanish flag image asset
import fr from "../../public/fr.svg"; // Import French flag image asset
import it from "../../public/it.svg"; // Import Italian flag image asset
import jp from "../../public/jp.svg"; // Import Japanese flag image asset

/**
 * Footer component that renders a language selection footer.
 * This component is only visible on large screens (lg breakpoint and above).
 * It displays a set of buttons, each representing a different language, with an associated flag.
 * 
 * @returns {JSX.Element} - The rendered footer component.
 */
export const Footer = () => {

    /* Data to be mapped: Array of language options with associated image and label */
    const languages = [
        { src: hr, alt: "Croatian", label: "Croatian" },
        { src: es, alt: "Spanish", label: "Spanish" },
        { src: fr, alt: "French", label: "French" },
        { src: it, alt: "Italian", label: "Italian" },
        { src: jp, alt: "Japanese", label: "Japanese" }
    ];

    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 px-2">
            <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
                {languages.map((lang, index) => (
                    <Button key={index} size="lg" variant="ghost" className="w-full">
                        {/* Language flag and label */}
                        <Image 
                            src={lang.src} 
                            alt={lang.alt} 
                            height={32} 
                            width={40} 
                            className="mr-4 rounded-md" 
                        />
                        {lang.label}
                    </Button>
                ))}
            </div>
        </footer>
    );
}
