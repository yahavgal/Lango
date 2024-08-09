/* Imports */
import { Footer } from "./footer";
import { Header } from "./header";

/* Props Definition */
type Props = {
    children: React.ReactNode; // Content to be rendered inside the layout
};

/* Component Definition */
/**
 * MarketingLayout component
 * This layout component wraps the page content with a header and footer,
 * and ensures that the content is vertically centered on the screen. 
 * TailwindCSS is used for layout styling.
 */
const MarketingLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center">
                {children}
            </main>
            <Footer />
        </div>
    );
};

/* Export */
export default MarketingLayout;
