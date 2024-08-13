/* Imports */
import { Button } from "@/components/ui/button"
import Image from "next/image"

/* Assets */
import hr from "../../public/hr.svg";
import es from "../../public/es.svg";
import fr from "../../public/fr.svg";
import it from "../../public/it.svg";
import jp from "../../public/jp.svg";

export const Footer = () => {

    /* Data to be mapped */
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
                        <Image src={lang.src} alt={lang.alt} height={32} width={40} className="mr-4 rounded-md" />
                        {lang.label}
                    </Button>
                ))}
            </div>
        </footer>
    );
}
