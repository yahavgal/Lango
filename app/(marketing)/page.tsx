/* Imports */
import { Button } from "@/components/ui/button"; // Import Button component for consistent UI
import Image from "next/image"; // Import Next.js optimized Image component
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignUpButton, SignInButton } from "@clerk/nextjs"; // Import Clerk components for user authentication handling
import { Loader } from "lucide-react"; // Import Loader icon for loading state indication

/* Assets */
import hero from "../../public/hero.svg"; // Import the hero image asset
import Link from "next/link"; // Import Link component for client-side navigation

/**
 * Home component that renders the landing page for the application.
 * It includes a hero image, a headline, and buttons for user authentication or navigation.
 * The displayed buttons depend on the user's sign-in state.
 * 
 * @returns {JSX.Element} - The rendered home page component.
 */
export default function Home() {
  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
      {/* Hero image container */}
      <div className="relative w-[240px] h-[240px] lg:w-[424px] lg:h-[424px] mb-8 lg:mb-0">
        <Image src={hero} alt="hero"/>
      </div>

      {/* Content container with headline and authentication buttons */}
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center">
          Learn, practice and master new languages with Lango.
        </h1>
        
        {/* Authentication buttons, dependent on the user's sign-in state */}
        <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
          {/* Loading state for Clerk */}
          <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </ClerkLoading>
          
          {/* Loaded state for Clerk, showing user-specific content */}
          <ClerkLoaded>
            <SignedOut>
              {/* Sign Up button for new users */}
              <SignUpButton 
                mode="modal" 
                forceRedirectUrl="/learn" 
                signInForceRedirectUrl="/learn"
              >
                <Button size="lg" variant="secondary" className="w-full">
                  Get Started
                </Button>
              </SignUpButton>
              {/* Sign In button for returning users */}
              <SignInButton 
                mode="modal" 
                forceRedirectUrl="/learn" 
                signUpForceRedirectUrl="/learn"
              >
                <Button size="lg" variant="primaryOutline" className="w-full">
                  I already have an account
                </Button>
              </SignInButton>
            </SignedOut>
            
            {/* Button for signed-in users to continue learning */}
            <SignedIn>
              <Button size="lg" variant="secondary" className="w-full" asChild>
                <Link href="/learn">
                  Continue Learning
                </Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
}
