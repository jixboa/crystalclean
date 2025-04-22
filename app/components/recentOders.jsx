"use client";

import { data } from "../data/data.js";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getOrders = async () => {
  try {
    const res = await fetch(`/api/orders`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading Orders");
    }

    const data = await res.json();
    return data.orders; // Return the orders array
  } catch (error) {
    console.log("error Loading Orders", error);
  }
};

export default function RecentOrders({ orders }) {
  function formatDateAgo(fetchedDate) {
    const currentDate = new Date();
    const parsedDate = new Date(fetchedDate);

    const timeDifference = currentDate - parsedDate;
    const secondsAgo = Math.floor(timeDifference / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const monthsAgo = Math.floor(daysAgo / 30);

    if (monthsAgo > 0) {
      return `${monthsAgo} month${monthsAgo > 1 ? "s" : ""} ago`;
    } else if (daysAgo > 0) {
      return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
    } else if (hoursAgo > 0) {
      return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
    } else if (minutesAgo > 0) {
      return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
    } else {
      return `${secondsAgo} second${secondsAgo > 1 ? "s" : ""} ago`;
    }
  }

  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // Map all orders to a new constant
  const allOrders = orders?.map((order) => ({
    name: order.name,
    id: order._id,
    total_amount: order.total_amount,
    status: order.status,
    date: new Date(order.date), // Convert date to a Date object
  }));
  allOrders?.sort((a, b) => b.date - a.date);

  return (
    <>
      <div className="w-full col-span-1 relative z-10 lg:h-[70vh] h-[50vh] m-auto p-4 rounded-lg bg-white  overflow-scroll">
        <h1>Recent orders</h1>
        <ul>
          {allOrders?.map((order, id) => (
            <li
              key={id}
              className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer">
              <div className="bg-gray-100 rounded-lg p-3">
                <ShoppingBagIcon className="h-4 w-4 text-gray-800" />
              </div>
              <div className="pl-4">
                <p className="text-gray-800 font-bold">₵{order.total_amount}</p>
                {/* <p className=" text-gray-400 text-sm">{order.name}</p> */}
                <p
                  className={`font-normal px-1 rounded-md text-sm text-${
                    order.status === "paid"
                      ? "green-500"
                      : order.status === "pending"
                      ? "orange-500"
                      : "red-500"
                  } `}>
                  {order.status}
                </p>
              </div>
              <p className="lg:flex md:hidden absolute right-6 text-sm">
                {formatDateAgo(order.date)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
