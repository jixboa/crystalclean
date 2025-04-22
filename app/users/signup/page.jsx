/* import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"; */
import { toast } from "react-hot-toast";
//import UserList from "../../components/userList";
import { SortableTable } from "../../components/userList";

import getQueryClient from "../../utils/getQueryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { GetCurrentUser } from "app/actions/userActions";

// export const runtime = "edge";
/* 
import {
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

import { data } from "../../data/data";

import { Spinner } from "@material-tailwind/react"; */

const getUsers = async () => {
  try {
    const res = await fetch(`${process.env.DOMAIN}/api/users`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading Users");
    }

    return res.json();
  } catch (error) {
    console.log("error Loading Users", error);
  }
};

export default async function SignUp() {
  /*   const users = await getUsers();
  console.log(users); */

  const currentUser = await GetCurrentUser();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["users"], getUsers);
  const dehydratedState = dehydrate(queryClient);

  if (!currentUser?.userData?.isAdmin) {
    redirect("/users/signin");
  }

  return (
    <>
      <Hydrate state={dehydratedState}>
        <div className="mt-20">
          <SortableTable currentUser={currentUser} />
        </div>
      </Hydrate>
      {/*  <div className="grid md:grid-cols-2 grid-cols-1 gap-2 mt-10">
        <UserList />

        <div className="p-4 justify-end">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {loading ? "Creating user" : "Add User"}
            </h2>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Full name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="py-3">
                  <button
                    onClick={onSignup}
                    className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    {buttonDisabled ? "Complete  form" : "Signup"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div> */}
    </>
  );
}
