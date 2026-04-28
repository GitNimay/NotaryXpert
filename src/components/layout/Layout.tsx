import { ReactNode, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { BrandLockup } from "../BrandLockup";

const DESKTOP_BREAKPOINT = 768;

export function Layout({ children }: { children: ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" && window.innerWidth >= DESKTOP_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      const nextIsDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
      setIsDesktop(nextIsDesktop);

      if (nextIsDesktop) {
        setIsMobileSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen antialiased print:block print:min-h-0 print:overflow-visible print:bg-white">
      {!isDesktop && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/35 backdrop-blur-[3px] transition-opacity md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className="print:hidden">
        <Sidebar
          isOpen={isDesktop ? true : isMobileSidebarOpen}
          setIsOpen={setIsMobileSidebarOpen}
          isDesktop={isDesktop}
        />
      </div>

      <div className="relative flex min-h-screen flex-col transition-[padding] duration-300 ease-out md:pl-[4.75rem] print:block print:min-h-0 print:overflow-visible print:pl-0">
        <header className="sticky top-0 z-20 flex shrink-0 items-center gap-4 border-b border-outline-variant/10 bg-surface/88 px-4 py-4 backdrop-blur-xl md:hidden no-print">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest/90 p-2.5 text-primary shadow-sm transition-colors hover:bg-surface-container-high"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          <BrandLockup
            markClassName="h-9 w-9"
            textClassName="text-lg"
            subtitle="Secure workspace"
            subtitleClassName="tracking-[0.24em]"
          />
        </header>

        <div className="app-scroll flex-1 print:overflow-visible">
          {children}
        </div>
      </div>
    </div>
  );
}
