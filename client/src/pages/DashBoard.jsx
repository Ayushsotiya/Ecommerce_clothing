import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from 'react-router';
import AppSidebar from "../components/dashboard/appsidebar";
import NavBar from "../components/common/NavBar"
const DashBoard = () => {
  return (
    <div className="flex h-full w-full bg-royalBlack">
      <SidebarProvider>
        <NavBar/>
        <AppSidebar />
        <Outlet/>
      </SidebarProvider>
    </div>
  );
};

export default DashBoard;
