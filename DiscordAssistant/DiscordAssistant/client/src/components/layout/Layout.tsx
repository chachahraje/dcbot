import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
        <footer className="border-t bg-card p-4 text-center text-sm text-muted-foreground">
          <p>Discord Bot Template • Powered by Discord.js</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
