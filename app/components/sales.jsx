"use client";

import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProductItems from "./products";
import { useState, useEffect, useContext } from "react";
import { ProductsContext } from "../components/ProductsContext";
import { Input } from "@material-tailwind/react";

import { toast } from "react-hot-toast";
import axios from "axios";

import { useRouter } from "next/navigation";
import { Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { MdDoNotDisturbOnTotalSilence } from "react-icons/md";

//get prods
const getProducts = async () => {
  try {
    const res = await fetch(`/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading products");
    }

    const data = await res.json();
    return data.products; //
  } catch (error) {
    console.log("error Loading products", error);
  }
};

export default function SalesClient({ productss, currentUser }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userDetail, setUserDetail, selectedProducts, setSelectedProducts } =
    useContext(ProductsContext);

  useEffect(() => {
    setUserDetail(currentUser?.userData);
  }, [currentUser?.userData, setUserDetail]);

  const [cashRecieved, setCashRecieve] = useState(0);
  const [change, setChange] = useState(0);

  const [productInfo, setProductInfo] = useState([]);

  // ###################### checkout ######################

  const [order, setOrder] = useState({
    name: "Cash Customer",
    contact: "##",
    invoice_number: "",
    selectedIds: "",
    total_amount: "",
    mode: "cash",
    amount_recieved: "",
    change: "",
    status: "",
    created_by: userDetail?.username,
  });

  //setOrder({ ...order, selectedIds: selectedProducts.join(",") });

  const uniqueIds = [...new Set(selectedProducts)];
  const uniqueIdSet = uniqueIds.join(",");

  const getCart = async () => {
    try {
      const res = await fetch("/api/carts?ids=" + uniqueIdSet, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed loading Cart");
      }
      const data = await res.json();
      setProductInfo(data.products);
      return data.products;
    } catch (error) {
      console.log("error Loading Cart", error);
    }
  };

  useEffect(() => {
    // When selectedProducts change, trigger a page refresh
    getCart();
    router.prefetch("/sales"); // This will refresh the current page
  }, [selectedProducts]);

  const moreOfThisProduct = (e, id) => {
    e.preventDefault();
    setSelectedProducts((prev) => [...prev, id]);
  };

  const lessOfThisProduct = (e, id) => {
    e.preventDefault();
    const pos = selectedProducts.indexOf(id);
    if (pos !== -1) {
      const newSelectProducts = selectedProducts.filter(
        (value, index) => index !== pos
      );
      setSelectedProducts(newSelectProducts);
    }
  };

  const removeAllOfThisProduct = (e, id) => {
    e.preventDefault();
    const newSelectProducts = selectedProducts.filter((value) => value !== id);
    setSelectedProducts(newSelectProducts);
  };

  const { data: cartData, isError: cartIsError } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  //console.log(cartData);

  const deliveryPrice = 0;
  let subtotal = 0;

  if (selectedProducts?.length) {
    for (let id of selectedProducts) {
      const product = productInfo.find((p) => p._id === id);
      if (product) {
        const price = parseFloat(product.price, 10);
        subtotal = subtotal + price;
      } else {
        //console.log("No Selected Ids");
      }
    }
  }

  const total = subtotal + deliveryPrice;

  const addOrder = async () => {
    //e.preventDefault();
    try {
      const response = await axios.post(`/api/orders`, order);

      return response.data;
    } catch (error) {
      console.log("Creating Failed", error.message);
      toast.error(error.message);
    } finally {
    }
  };

  const { mutate } = useMutation(addOrder, {
    onMutate: async (data) => {
      await queryClient.cancelQueries(["products"]);
      await queryClient.cancelQueries(["orders"]);
    },
    onError: (error, newCategory, context) => {
      // Handle errors, if needed
      toast.success("Error creating order");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["orders"]);
      setSelectedProducts([]);
    },
    onSuccess: (data, variables, context) => {
      // Handle success, if needed
      setOrder({
        name: "Cash Customer",
        contact: "##",
        invoice_number: "",
        selectedIds: "",
        total_amount: "",
        mode: "cash",
        amount_recieved: "",
        change: "",
        status: "",
      });
      setCashRecieve(0);
      toast.success("Order Created successfully");
    },
  });

  const handleAddOrder = async (e) => {
    e.preventDefault();
    console.log(userDetail?.username);

    let orderStatus;

    if (order?.mode == "pending") {
      orderStatus = "pending";
      setChange(0);
    } else {
      orderStatus = "paid";
    }

    const invoiceNumber =
      Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
    //console.log(invoiceNumber);

    await setOrder({
      ...order,
      invoice_number: invoiceNumber,
      total_amount: total,
      amount_recieved: cashRecieved,
      change: change,
      status: orderStatus,
      selectedIds: selectedProducts.join(","),
    });
    //console.log(order);
    mutate(order);
  };

  /////////////////// checkout END ######################

  const [phrase, setPhrase] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then((res) => res.json()),
  });

  const categoryNames = [...new Set(data?.products.map((p) => p.category))];
  // console.log(categoryNames);

  if (isLoading) {
    // Render a loading indicator while data is loading
    return <p className="ml-20 mt-20 text-black font-normal">Loading...</p>;
  }

  if (!productss || !Array.isArray(productss)) {
    return <p>No products available.</p>;
  }

  let products;

  if (phrase) {
    products = productss?.filter((p) => p.name.toLowerCase().includes(phrase));
  } else {
    products = productss;
  }

  return (
    <div className="bg-white rounded-lg p-4 ml-20">
      <div className="p-2 mb-5 mt-10  grid  grid-cols-1 md:grid-cols-3 gap-2">
        <div className="col-span-2 p-2 md:p-1 min-h-screen overflow-scroll md:w-full">
          <Input
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            label="Search for product"
            icon={
              phrase ? (
                <XMarkIcon
                  onClick={(e) => {
                    setPhrase("");
                  }}
                  className="h-5 w-5"
                />
              ) : (
                <MagnifyingGlassIcon className="h-5 w-5" />
              )
            }
          />
          <div>
            {categoryNames?.map((categoryName) => (
              <div key={categoryName}>
                {products?.find((p) => p.category === categoryName) && (
                  <div>
                    {/* <h2 className="text-2xl py-5 capitalize">{categoryName}</h2> */}
                    <div className="pt-5">
                      <Typography
                        variant="h3"
                        color="blue-gray"
                        className="capitalize">
                        {categoryName}
                      </Typography>
                    </div>
                    <div className="flex -mx-5 overflow-x-scroll snap-x p-4 bg-gray-50">
                      {products
                        .filter((p) => p.category === categoryName)
                        .map((productInfo) => (
                          <div
                            className="px-5 snap-start"
                            key={productInfo._id}>
                            <ProductItems {...productInfo} />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="py-4"></div>
          </div>
        </div>

        <div className=" col-span-1 p-2  bg-gray-50 hidden md:grid h-fit">
          <div className=" flex-col justify-start border-b border-gray-700 py-5 mb-5">
            <h1 className=" font-extrabold text-teal-700 text-xl capitalize">
              Shop name
            </h1>
            <h4 className="    text-gray-800 text-sm">Adum, Kumasi - Ghana</h4>
            <h4 className="   text-gray-800 text-sm">233 542 521 836</h4>
            <h4 className="  text-gray-800 text-sm">2023-09-28 11:23:00</h4>
          </div>
          {!productInfo ||
            (productInfo.length < 1 && <div>No products in your cart</div>)}
          {productInfo &&
            productInfo.map((prodInfo) => {
              const amount = selectedProducts.filter(
                (id) => id === prodInfo._id
              ).length;
              if (amount === 0) return;
              return (
                <div
                  key={prodInfo._id}
                  className="flex mb-3 w-full justify-items-center border-b border-gray-200 p-2">
                  <div className="pl-4 w-full ">
                    <div className="flex justify-between">
                      <h5 className="font-semibold">{prodInfo.name}</h5>
                      <XMarkIcon
                        onClick={(e) => removeAllOfThisProduct(e, prodInfo._id)}
                        className="h-4 w-4  hover:bg-gray-400 text-red-200 rounded-md"
                      />
                    </div>

                    <p className="text-sm leading-3 text-gray-500 hidden lg:grid">
                      {prodInfo.description}
                    </p>
                    <div className="flex mt-2 flex-row justify-between">
                      <div className=" ">₵ {prodInfo.price}</div>
                      <div className="flex flex-row ">
                        <button
                          onClick={(e) => lessOfThisProduct(e, prodInfo._id)}
                          className="border border-green-500 px-1 text-emerald-500 text-sm">
                          -
                        </button>
                        <span className="px-1">
                          {
                            selectedProducts.filter((id) => id === prodInfo._id)
                              .length
                          }
                        </span>
                        <button
                          onClick={(e) => moreOfThisProduct(e, prodInfo._id)}
                          className="bg-green-500 px-1 text-white">
                          +
                        </button>
                      </div>
                      <div>
                        ---: ₵{" "}
                        {selectedProducts.filter((id) => id === prodInfo._id)
                          .length * prodInfo.price}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          <div className="mt-4 flex flex-col gap-2">
            {/* <Input
              className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
              type="text"
              value={selectedProducts.join(",")}
              hidden
            /> */}

            <Input
              className=" bg-white w-full rounded-lg px-4 py-2 mb-2"
              type="text"
              value={order.name}
              onChange={(e) =>
                setOrder({
                  ...order,
                  name: e.target.value,
                })
              }
              placeholder="Name"
            />
            <Input
              className="w-full rounded-lg px-4 py-2 mb-2  bg-white"
              type="text"
              value={order.contact}
              onChange={(e) => setOrder({ ...order, contact: e.target.value })}
              label="Contact No."
            />
          </div>
          <div className="mt-4">
            <div className="flex my-3">
              <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
              <h3 className="font-bold">GH₵ {subtotal}</h3>
            </div>
            <div className="flex my-3">
              <h3 className="grow font-bold text-gray-400">Other Charges:</h3>
              <h3 className="font-bold">GH₵ {deliveryPrice}</h3>
            </div>
            {selectedProducts.length && (
              <div className="w-full">
                <label
                  className="text-sm font-normal text-gray-500 ml-1"
                  htmlFor="status">
                  Payment Mode
                </label>
                <select
                  value={order.mode}
                  onChange={(e) => {
                    setOrder({
                      ...order,
                      mode: e.target.value,
                    });
                    setCashRecieve(0);
                  }}
                  className=" p-2 mb-1 block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  id="size">
                  <option value="cash">Cash Paid</option>
                  <option value="momo">Momo</option>
                  <option value="pending">Create Order</option>
                </select>
              </div>
            )}

            {selectedProducts.length && order.mode === "cash" ? (
              <div className="grid grid-cols-2 md:grid-col-1 sm:grid-col-1  gap-4  border border-b-2 p-1 bg-gray-100 rounded-md">
                <div className="px-2 flex flex-row sm:flex-col xs-flex-col justify-start items-center w-full">
                  <Input
                    type="text"
                    label="cash recieved"
                    onChange={async (e) => {
                      await setCashRecieve(e.target.value);
                      setChange(
                        (
                          parseFloat(e.target.value, 0) - parseFloat(total, 10)
                        ).toFixed(2)
                      );
                    }}
                    className="rounded w-full h-8 px-2 bg-white"
                  />
                </div>

                {change > 0 && (
                  <div className="flex flex-row  sm:flex-col xs-flex-col  justify-end items-center">
                    <h3 className="text-sm  text-gray-600 font-normal">
                      Change:
                    </h3>
                    <h3 className="text-sm font-semibold text-green-600">
                      GH₵ {change}
                    </h3>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
            <div className="flex my-3 pt-3 border-t border-dashed border-emerald-500">
              <h3 className="grow font-bold text-gray-400">Total:</h3>
              <h3 className="font-bold">GH₵ {total}</h3>
            </div>
          </div>

          {cashRecieved >= total &&
            selectedProducts.length > 0 &&
            order.mode == "cash" &&
            total > 0 && (
              <button
                onClick={handleAddOrder}
                className=" border p-5 text-white py-2 w-full bg-green-500 rounded-xl font-bold mt-4 shadow-emerald-300 shadow-lg">
                Pay GH₵ {total}
              </button>
            )}
          {selectedProducts.length > 0 && order.mode == "momo" && (
            <button
              onClick={handleAddOrder}
              className=" border p-5 text-white py-2 w-full bg-green-500 rounded-xl font-bold mt-4 shadow-emerald-300 shadow-lg">
              Pay GH₵ {total} with Momo
            </button>
          )}
          {selectedProducts.length > 0 && order.mode == "pending" && (
            <button
              onClick={handleAddOrder}
              className=" border p-5 text-white py-2 w-full bg-green-500 rounded-xl font-bold mt-4 shadow-emerald-300 shadow-lg">
              Save Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
