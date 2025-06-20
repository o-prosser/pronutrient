import MobileTabBar from "./components/mobile-tab-bar";
import MobileFooter from "./components/mobile-footer";
import DesktopSidebar from "./components/desktop-sidebar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MobileTabBar />

      <DesktopSidebar />

      <main className="min-h-dvh pt-16 pb-26 md:pl-84 md:pr-8 md:py-6">
        {children}
      </main>

      <MobileFooter />
    </>
  );
};

export default AppLayout;
