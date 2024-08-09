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
    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 px-2">
            <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src={hr} alt="Croatian" height={32} width={40} className="mr-4 rounded-md" />
                    Croatian
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src={es} alt="Croatian" height={32} width={40} className="mr-4 rounded-md" />
                    Spanish
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src={fr} alt="Croatian" height={32} width={40} className="mr-4 rounded-md" />
                    French
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src={it} alt="Croatian" height={32} width={40} className="mr-4 rounded-md" />
                    Italian
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src={jp} alt="Croatian" height={32} width={40} className="mr-4 rounded-md" />
                    Japanese
                </Button>
            </div>
        </footer>
    )
}