import { Button } from "@/components/ui/button";
import { NotebookText } from "lucide-react";
import Link from "next/link";

type Props = {
    title: string;
    description: string;
};

export const UnitBanner = ({ title, description }: Props) => {
    return (
        <div className="flex items-center justify-between w-full rounded-xl bg-purple-500 p-5 text-white">
            <div className="space-y-2.5">
                <h3 className="text-2xl font-bold">
                    {title}
                </h3>
                <p className="text-lg">
                    {description}
                </p>
            </div>
            <Link href="/lessons">
                <Button size="lg" variant="secondary" className="hidden lg:flex border-2 border-b-4 active:border-b-2">
                    <NotebookText className="mr-2"/>
                    Continue
                </Button>
            </Link>
        </div>
    );
};