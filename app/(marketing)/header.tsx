/* Imports */
import Image from "next/image"; // Import for optimized image handling in Next.js
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"; // Clerk components for user authentication states
import { Loader } from "lucide-react"; // Icon used as a loading spinner

/* Assets */
import logo from "../../public/mascot.svg"; // Import the logo asset
import { Button } from "@/components/ui/button"; // Import the Button component for UI consistency

/**
 * Header component that renders the top navigation bar.
 * The header includes a logo, the site title, and user authentication controls.
 * The authentication controls dynamically change based on the user's sign-in state.
 * 
 * @returns {JSX.Element} - The rendered header component.
 */
export const Header = () => {
    return (
        <header className="h-20 w-full border-b-2 border-slate-200 px-4">
            <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
                {/* Logo and site title */}
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src={logo} alt="logo" height={40} width={40}/>
                    <h1 className="text-2xl font-extrabold text-purple-600 tracking-wide">
                        Lango
                    </h1>
                </div>
                
                {/* Loading state for Clerk (user authentication service) */}
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                
                {/* Loaded state for Clerk, showing user-specific content */}
                <ClerkLoaded>
                    <SignedIn>
                        <UserButton /> {/* Displays user profile button when signed in */}
                    </SignedIn>
                    <SignedOut>
                        <SignInButton 
                            mode="modal" 
                            forceRedirectUrl="/learn" 
                            signUpForceRedirectUrl="/learn"
                        >
                            <Button size="lg" variant="ghost">
                                Login
                            </Button>
                        </SignInButton> {/* Shows login button when signed out */}
                    </SignedOut>
                </ClerkLoaded>
            </div>
        </header>
    )
}
