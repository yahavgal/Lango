/* Imports */
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SidebarItem } from "./sidebar-item";
import Link from "next/link";
import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";

/* Assets */
import logo from "../public/mascot.svg"
import learnIcon from "../public/learn.svg";
import leaderboardIcon from "../public/leaderboard.svg";
import questsIcon from "../public/quests.svg";
import shopIcon from "../public/shop.svg";

/* Types */
type Props = {
    className?: string;
};

/* Items to be mapped */
const sidebarIcons = [
    { label: "Learn", icon: learnIcon, href: "/learn" },
    { label: "Leaderboard", icon: leaderboardIcon, href: "/leaderboard" },
    { label: "Quests", icon: questsIcon, href: "/quests" },
    { label: "Shop", icon: shopIcon, href: "/shop" }
]

export const Sidebar = ( { className } : Props ) => {
    return (
        <div className={cn(
            "flex flex-col h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2", className
        )}>
            <Link href="/learn">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src={logo} alt="logo" height={40} width={40}/>
                    <h1 className="text-2xl font-extrabold text-purple-600 tracking-wide">
                        Lango
                    </h1>
                </div>
            </Link>
            <div className="flex flex-col gap-y-2 flex-1">
            {sidebarIcons.map((item, index) => (
                    <SidebarItem 
                        key={index} 
                        label={item.label} 
                        icon={item.icon} 
                        href={item.href} 
                    />
                ))}
            </div>
            <div className="p-4">
                <ClerkLoading>
                    <Loader  className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <UserButton />
                </ClerkLoaded>
            </div>
        </div>
    )
}