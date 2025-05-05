import {
  Package,
  User,
  MapPin,
  Phone,
  LifeBuoy,
  Search,
  UsersRound,
  BarChart3,
  ShoppingCart,
  Boxes,
  LayoutDashboard
} from "lucide-react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar";
import NavUser from "./navuser";

const adminItems = {
  main: [
    {
      title: "Profile",
      url: "/dashboard/admin/profile",
      icon: User,
    },
    {
      title: "Analytics",
      url: "/dashboard/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Category",
      url: "/dashboard/admin/category",
      icon: Search,
    },
    {
      title: "Products",
      url: "/dashboard/admin/products",
      icon: Boxes,
    },
    {
      title: "Orders",
      url: "/dashboard/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      url: "/dashboard/admin/customer",
      icon: UsersRound,
    },
    
    
  ],
};

const userItems = {
  main: [
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: Package,
    },
    {
      title: "Address",
      url: "/dashboard/address",
      icon: MapPin,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: LifeBuoy,
    },
  ],
};

export default function AppSidebar() {
  const path = useLocation();
  const { user } = useSelector((state) => state.profile);
  const type = user?.type?.trim();

  const itemsToRender = type === "Admin" ? adminItems.main : userItems.main;

  return (
    <Sidebar className="w-56 h-[93.5%] mt-[62px] bg-black text-white flex flex-col border-r border-specialGrey z-0">
      <SidebarHeader className="px-4 py-4">
        <div className="text-xl font-bold text-white flex gap-2 items-center">
          <LayoutDashboard />
          <span>DashBoard</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarMenu className="px-2 flex flex-col gap-1">
            {itemsToRender.map(({ title, url, icon: Icon }) => {
              const isActive = path.pathname === url;
              return (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton
                    asChild
                    className={`w-full flex items-center px-3 gap-2 py-2 rounded-md text-sm transition-all duration-100 ${
                      isActive
                        ? "bg-gray-100 text-black"
                        : "text-white hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Link to={url} className="flex items-center w-full">
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-specialGrey">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
