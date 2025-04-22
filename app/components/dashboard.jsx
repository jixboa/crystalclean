"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

import BarChart from "./barchart";
import RecentOrders from "./recentOders";

import { ProductsContext } from "./ProductsContext";
import { Fragment, useContext, useEffect, useState } from "react";
import React, { PureComponent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetCategories } from "app/actions/categoryActions";

import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";

const getProducts = async () => {
  try {
    const res = await fetch(`/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading Products");
    }

    return res.json(); // Return the categories array
  } catch (error) {
    console.log("error Loading Products", error);
  }
};

const getCategories = async () => {
  try {
    const res = await fetch(`/api/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading Categories");
    }

    const data = await res.json();
    return data.categories; // Return the categories array
  } catch (error) {
    console.log("error Loading Categories", error);
  }
};

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

export default function Dashboard({
  categories,
  products,
  orders,
  currentUser,
}) {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(ProductsContext);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);
  const currentTime = Math.floor(Date.now() / 1000);

  useEffect(() => {
    setUserDetail(currentUser?.userData);
  }, [currentUser?.userData, setUserDetail]);

  const { data: productsData, isLoading: productsIsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  /* const { data: categoriesData, isLoading: categoriesIsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  }); */
  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const ordersTotal = orders
    ?.filter((order) => order.status === "paid")
    .reduce((total, order) => {
      const orderTotal = parseFloat(order.total_amount);
      if (orderTotal) {
        return total + orderTotal;
      }
      return total;
    }, 0);

  return (
    <div className="bg-white rounded-lg p-4 ml-20">
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="bg-gray-200 p-2 bg-gradient-to-r from-purple-400 to-purple-700 bg-opacity-50 shadow-md shadow-gray-800 hover:bg-purple-900 cursor-pointer rounded-xl">
          <div className="pl-4 pt-3 ">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 text-white">
              Products
            </Typography>
          </div>
          <div className="pr-4">
            <Typography
              className="text-right font-extrabold h-25 text-8xl text-white pl-15 duration-300"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
              {products?.length || ""}
            </Typography>
          </div>
          <div className="pl-4">
            <Button
              className="bg-purple-800 mb-5"
              onClick={(e) => router.push("/products")}>
              See Details
            </Button>
          </div>
        </div>
        <div className="bg-gray-200 p-2 bg-gradient-to-r from-cyan-400 to-cyan-700 bg-opacity-50 shadow-md shadow-gray-800 hover:bg-purple-900 cursor-pointer rounded-xl">
          <div className="pl-4 pt-3">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 text-white">
              Categories
            </Typography>
          </div>
          <div className="pr-4">
            <Typography
              className="text-right font-extrabold h-25 text-8xl text-white pl-15 "
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
              {categories?.length || ""}
            </Typography>
          </div>
          <div className="pl-4">
            <Button
              className="bg-cyan-800 mb-5"
              onClick={(e) => router.push("/categories")}>
              See Details
            </Button>
          </div>
        </div>
        <div className="bg-gray-200 p-2 bg-gradient-to-r from-orange-400 to-orange-700 bg-opacity-50 shadow-md shadow-gray-800 hover:bg-purple-900 cursor-pointer rounded-xl">
          <div className="pl-4 pt-3">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 text-white">
              Sales
            </Typography>
          </div>
          <div className="">
            <Typography
              className="p-1 mx-auto text-right font-extrabold h-25 text-5xl xs:text-5xl text-white flex flex-col"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
              ₵{ordersTotal}
            </Typography>
          </div>
          <div className="pl-4">
            <Button
              className="bg-orange-800 mt-10"
              onClick={(e) => router.push("/orders")}>
              See Details
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <RecentOrders orders={orders} />
          <BarChart orders={orders} />
        </div>
      </div>
      <div className="">
        {/*  <Button onClick={handleOpen} variant="gradient">
          Open Dialog
        </Button> */}

        <Dialog
          className="items-center align-middle justify-center"
          open={open}
          handler={handleOpen}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}>
          <DialogHeader>Its a simple dialog.</DialogHeader>
          <DialogBody>
            The key to more success is to have a lot of pillows. Put it this
            way, it took me twenty five years to get these plants, twenty five
            years of blood sweat and tears, and I&apos;m never giving up,
            I&apos;m just getting started. I&apos;m up to something. Fan luv.
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1">
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" onClick={handleOpen}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
}
