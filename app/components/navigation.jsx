"use client";

import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, Badge, IconButton, Button } from "@material-tailwind/react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ProductsContext } from "./ProductsContext";

import { Fragment, useContext, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/", current: true },
  { name: "Categories", href: "/categories", current: false },
  { name: "Products", href: "/products", current: false },
  { name: "Sales", href: "/sales", current: false },
  { name: "Add User", href: "/users/signup", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavbarNew() {
  const router = useRouter();
  const pathname = usePathname();
  ///const { username } = useContext(ProductsContext);

  const { selectedProducts, userDetail, setUserDetail } =
    useContext(ProductsContext);

  //const [userData, setUserData] = useState();
  //const [profileName, setProfileName] = useState("");

  const SignOut = async () => {
    try {
      await axios.get("/api/users/signout");
      router.push("/users/signin");
    } catch (error) {
      console.log(error.message);
      toast.error("Logout failed");
    } finally {
      setUserDetail([]);
      toast("Signed out");
    }
  };

  /*    const { data, isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: () => fetch("/api/users/me").then((res) => res.json()),
  }); */

  //console.log(pathname);

  if (pathname === "/users/signin") {
    return (
      <>
        <div></div>
      </>
    );
  }

  return (
    <Disclosure
      as="nav"
      className=" bg-transparent fixed top-0 w-full  z-50 ml-20">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 z-50">
            <div className="relative flex h-16 items-center justify-center">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                {/* <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button> */}
              </div>

              <div className="flex flex-row gap-2">
                <div>
                  <Badge
                    content={
                      selectedProducts.length > 0 ? (
                        <span className="">{selectedProducts.length}</span>
                      ) : (
                        <></>
                      )
                    }>
                    <IconButton
                      className="rounded-full"
                      onClick={(e) => {
                        router.push("/checkout");
                      }}>
                      <ShoppingCartIcon className="h-6 w-6 rounded-lg" />
                    </IconButton>
                  </Badge>
                </div>

                <div>
                  <Menu as="div" className="relative ml-3 ">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <Avatar
                          variant="rounded"
                          className="h-10 w-10 rounded-full bg-gray-800"
                          src="/images/placeholder.png"
                          alt="avatar"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}>
                              {userDetail?.username}
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}>
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={SignOut}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}>
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                {/* Profile dropdown */}
              </div>
            </div>
          </div>

          {/* <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}>
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel> */}
        </>
      )}
    </Disclosure>
  );
}
