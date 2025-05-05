import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from 'react-router';
import AppSidebar from "../components/dashboard/appsidebar";

const DashBoard = () => {
  return (
    <div className="flex h-screen w-full bg-royalBlack">
      <SidebarProvider>
        <AppSidebar />
        <Outlet/>
      </SidebarProvider>
    </div>
  );
};

export default DashBoard;
