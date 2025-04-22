"use client";

import { useState, useContext } from "react";
import {
  AcademicCapIcon,
  CreditCardIcon,
  CubeIcon,
  CurrencyBangladeshiIcon,
  FolderIcon,
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ProductsContext } from "./ProductsContext";
import { GetCurrentUser } from "app/actions/userActions";

const navigation = [
  {
    name: "Dashboard",
    icon: <HomeIcon className="h-6 w-6" />,
    href: "/",
    current: true,
  },
  {
    name: "Sales",
    icon: <CreditCardIcon className="h-6 w-6" />,
    href: "/sales",
    current: false,
    gap: true,
  },
  {
    name: "Cart",
    icon: <ShoppingCartIcon className="h-6 w-6" />,
    href: "/checkout",
    current: false,
  },
  {
    name: "Orders",
    icon: <ShoppingBagIcon className="h-6 w-6" />,
    href: "/orders",
    current: false,
  },
  {
    name: "Categories",
    icon: <FolderIcon className="h-6 w-6" />,
    href: "/categories",
    current: false,
    gap: true,
  },
  {
    name: "Products",
    icon: <CubeIcon className="h-6 w-6" />,
    href: "/products",
    current: false,
  },

  {
    name: "Users",
    icon: <UserPlusIcon className="h-6 w-6" />,
    href: "/users/signup",
    current: false,
  },
];

export default function SidebarComponent() {
  const pathname = usePathname();

  const { userDetail } = useContext(ProductsContext);
  /* 
  const currentUser = GetCurrentUser(); */

  const [open, setOpen] = useState(false);

  // Add a function to handle hover events
  const handleHover = () => {
    setOpen(true);
  };

  // Add a function to handle when the mouse leaves the div
  const handleMouseLeave = () => {
    setOpen(false);
  };

  if (pathname === "/users/signin") {
    return (
      <>
        <div></div>
      </>
    );
  }
  const isAdmin = userDetail?.isAdmin;

  const filteredNavigation = isAdmin
    ? navigation
    : navigation.filter(
        (item) => item.name === "Orders" || item.name === "Sales"
      );

  return (
    <div
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
      className={`${
        open ? "w-72" : "w-20"
      } duration-300 h-full fixed bg-blue-gray-900 text-white z-50`}>
      <div className="p-5 items-center flex gap-x-4">
        <AcademicCapIcon
          className={`w-6 h-6 duration-500 ${!open && " rotate-[360deg]"}`}
        />
        <h3 className={`duration-300 ${!open && "scale-0 h-0 w-0"}`}>
          Shop Guard
        </h3>
      </div>
      <div className="p-5 items-center">
        {userDetail?.username?.length ? (
          <ul>
            {filteredNavigation.map((item, index) => (
              <li key={index} className="">
                <Link
                  href={item.href}
                  className={`flex gap-x-2 mb-4  px-2 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white
                ${
                  pathname === item.href
                    ? " bg-gray-900 shadow-md shadow-black"
                    : "bg-transparent"
                }
                ${item.gap && "mt-10"}
                 
                `}>
                  {item.icon}
                  {!open ? null : item.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
