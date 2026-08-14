import { ProductBar } from "./components/ProductBar";
import { Sidebar } from "./components/Sidebar";
import { ComposeProvider } from "./context/ComposeContext";
import { MailProvider } from "./context/MailContext";
import { TourProvider } from "./context/TourContext";
import { ProductTour } from "./components/ProductTour";
import { HelpButton } from "./components/HelpButton";
import { AuthGuard } from "./components/AuthGuard";

export default function MailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#000] text-white selection:bg-blue-500/30">
      <ComposeProvider>
        <MailProvider>
          <AuthGuard>
            <TourProvider>
              <ProductBar />
              <Sidebar />
              {children}
              <HelpButton />
              <ProductTour />
            </TourProvider>
          </AuthGuard>
        </MailProvider>
      </ComposeProvider>
    </div>
  );
}
