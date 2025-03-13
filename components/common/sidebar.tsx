"use client";
import Image from "next/image";
import Link from "next/link";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import DashboardIcon from "@/icons/dashboard-icon";
import BudgetIcon from "@/icons/budget-icon";
import ArrowIcon from "@/icons/arrow-icon";
import TaskManagementIcon from "@/icons/task-management";
import { RiTeamFill, RiOrganizationChart } from "react-icons/ri";
import { MdAddChart, MdManageAccounts } from "react-icons/md";
import { VscProject } from "react-icons/vsc";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { TbAB2 } from "react-icons/tb";

const CustomSidebar = () => {
  const pathname = usePathname();
  const { role } = useRole();

  const MENU_ITEMS = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: DashboardIcon,
      roles: ["admin", "tenant"],
    },
    {
      label: "Task Management",
      href: "/task-management",
      icon: TaskManagementIcon,
      roles: ["tenant"],
    },
    {
      label: "Budget & Expense",
      href: "/budget-expenses",
      icon: BudgetIcon,
      roles: ["tenant"],
    },
    {
      label: "Project",
      href: "/project",
      icon: VscProject,
      roles: ["tenant"],
    },
    {
      label: "Tenants",
      href: "/tenant",
      icon: RiOrganizationChart,
      roles: ["admin"],
    },
    {
      label: "Team Members",
      href: "/team-members",
      icon: RiTeamFill,
      roles: ["admin", "tenant"],
    },
    {
      label: "Roles Management",
      href: "/roles",
      icon: MdManageAccounts,
      roles: ["admin", "tenant"],
    },

    {
      label: "Task Keyword",
      href: "/task-keyword",
      icon: TbAB2,
      roles: ["tenant"],
    },
    {
      label: "Gantt Chart",
      href: "/gantt-chart",
      icon: MdAddChart,
      roles: ["tenant"],
    },
  ];
  // Filter menu items based on user role
  const filteredMenuItems = MENU_ITEMS.filter(
    (item) => !role || item.roles.includes(role)
  );

  return (
    <Sidebar className="pt-4 !border-none">
      <div className="flex flex-col gap-5 items-center h-full py-10 overflow-auto hide-scrollbar max-h-dvh">
        <Image
          src="/media/images/Logo.png"
          alt="logo"
          width={130}
          height={30}
        />

        <Menu className="flex-grow pb-40 text-sm flex-grow-1">
          {filteredMenuItems.map((item, index) => (
            <MenuItem
              key={`${item.label}-${index}`}
              icon={<item.icon className="size-6" />}
              component={
                <Link
                  className={clsx(
                    "hover:!text-green-500 rounded-full",
                    pathname.includes(item.href) && "bg-white !text-green-500"
                  )}
                  href={item.href}
                />
              }
            >
              {item.label}
            </MenuItem>
          ))}
          <div className="w-full border bg-tertiary"></div>
        </Menu>

        <div className="flex">
          <div className="border border-tertiary rounded-2xl w-11/12 m-auto px-5 pb-6 pt-12 relative">
            <div className="absolute bottom-[3.35rem] -left-1 w-full">
              <Image
                className="w-full h-auto"
                alt="image"
                src="/media/images/sidebarImage.png"
                width={130}
                height={30}
              />
            </div>
            <div className="rounded-full bg-tertiary h-[3.7rem] w-[3.7rem] bottom-[6.75rem] left-[5.625rem] flex justify-center items-center absolute">
              <ArrowIcon className="text-primary" />
            </div>
            <p className="font-normal text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor
            </p>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default CustomSidebar;
