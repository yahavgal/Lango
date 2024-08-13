import { MobileSidebar } from "./mobile-sidebar";

export const MobileHeader = () => {
    return (
        <nav className="flex items-center px-6 h-[50px] bg-purple-600 border-b fixed top-0 w-full z-50 lg:hidden">
            <MobileSidebar />
        </nav>
    )
};