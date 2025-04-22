"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Example from "./shoppingcart";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "app/loading";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-hot-toast";
import { ProductsContext } from "./ProductsContext";

import {
  Dialog,
  Button,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";

export default function OrderDetailsClient({ params, currentUser }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const [newStatus, setNewStatus] = useState();
  const { userDetail, setUserDetail } = useContext(ProductsContext);
  const [OrderData, setOrderData] = useState({
    // Your initial data here
  });

  useEffect(() => {
    setUserDetail(currentUser?.userData);
  }, [currentUser?.userData, setUserDetail]);

  const [change, setChange] = useState(0);
  const [cashRecieved, setCashRecieve] = useState(0);

  const id = searchParams[1];

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
    setCashRecieve(0);
    setChange(0);
    setOrderData({ ...OrderData, payment_mode: "cash" });
  };

  const [openCancel, setOpenCancel] = useState(false);
  const handleOpenCancel = () => setOpenCancel(!openCancel);

  const [openReturn, setOpenReturn] = useState(false);
  const handleOpenReturn = () => setOpenReturn(!openReturn);

  const getOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        cache: "no-store",
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed loading Order");
      }

      const data = await res.json();
      return data.order; // Return the categories array
    } catch (error) {
      console.log("error Loading Order", error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["order"],
    queryFn: getOrder,
  });

  useEffect(() => {
    // Check if data is not null or undefined
    if (data) {
      // Create a new object with the properties of data
      const modifiedData = {
        ...data,
        payment_mode: "cash", // Set payment_mode to "cash"
      };

      // Set the modified data to the state
      setOrderData(modifiedData);
    }
  }, [data]);
  /*   if (singleOrder) {
    const order = singleOrder?.map((order) => ({
      name: order.name,
      id: order._id,
      products: order.products,
      total_amount: order.total_amount,
      date: new Date(order.date), // Convert date to a Date object
    }));
  } */
  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleString("en-US", options);
  }

  const updateOrder = async () => {
    try {
      const res = await fetch(`api/orders/${data?._id}`, {
        method: "PUT",
        body: JSON.stringify({ newStatus }),
      });

      if (!res.ok) {
        throw new Error("success upate Order");
      }
    } catch (error) {}
  };

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      /* const previousCategories = queryClient.getQueriesData(["orders"]);
      const newCats = previousCategories[0][1];

      // Assuming your updateCategory function returns the updated category
      queryClient.setQueriesData(
        ["orders"],
        newCats.map((category) =>
          category._id === updatedCat._id ? updatedCat : category
        )
      );
      return { newCats }; */
    },
    onError: (err, category, context) => {
      queryClient.setQueriesData(["orders"]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onSuccess(data, variables, context) {
      //setEditOpen(false);
      router.push("/orders");
      toast.success("Updated successfully");
    },
  });

  const payOrder = (e, data) => {
    e.preventDefault();
    setNewStatus("paid");
    updateMutation.mutate(data);
  };
  const returnOrder = (e, data) => {
    e.preventDefault();
    setNewStatus("returned");
    updateMutation.mutate(data);
  };
  const cancelOrder = (e, data) => {
    e.preventDefault();
    setNewStatus("cancelled");
    updateMutation.mutate(data);
  };

  return (
    <>
      <div className="flex flex-col pt-20 items-center justify-center gap-8 ml-20">
        <h1 className="font-bold text-lg mb-5 ">Order Details</h1>
        <div className="flex flex-row justify-between gap-8 border-b border-gray-300">
          <div className="flex flex-col p-2 ">
            <h1>Invoice number: #{OrderData?.invoice_number}</h1>
            <h1>Date: {formatDate(OrderData?.date)}</h1>
            <h1>
              Order Status:{" "}
              <span className="font-semibold">{OrderData?.status}</span>
            </h1>
          </div>
          <div className="flex flex-col p-2">
            <h1>Customer: {OrderData?.name}</h1>
            <h1 className="font-semibold sm:text-right ">
              Total: ₵{OrderData?.total_amount}
            </h1>
          </div>
        </div>
        <div>
          <ol className="mb-10 overflow-y-scroll p-4 bg-gray-100 h-72">
            <li className="">
              <div className="p-6 grid  my-3 grid-cols-4 justify-between bg-white mb-2 rounded-md">
                <h1 className="font-semibold px-2">Product name</h1>
                <h1 className="font-semibold text-center">Quantity</h1>
                <h1 className="font-semibold">Unit Price</h1>
                <h1 className="font-semibold">Sub Total</h1>
              </div>
            </li>

            {data?.products &&
              OrderData?.products?.map((product, index) => (
                <li key={product.name}>
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <div className="p-2 grid  my-3 grid-cols-4 justify-between bg-white mb-2 rounded-md">
                      <h1 className="font-normal pl-4">{product.name} </h1>
                      <h1 className="font-normal text-center">
                        {product.quantity}
                      </h1>
                      <h1 className="font-normal ">₵{product.unit_amount}</h1>
                      <h1 className="font-normal">
                        ₵{product.quantity * product.unit_amount}
                      </h1>
                    </div>
                  )}
                  {/*    <div className="text-center flex flex-row gap-4 justify-between">
                    <h1 className="font-normal px-2"> {product.name}</h1>
                    <h1 className="font-normal text-center">
                      {product.quantity}
                    </h1>
                    <h1 className="font-normal text-center">
                      ₵{product.unit_amount}
                    </h1>
                    <h1 className="font-normal ">
                      ₵{product.quantity * product.unit_amount}
                    </h1>
                  </div> */}
                </li>
              ))}
          </ol>
        </div>
      </div>
      <div className="flex gap-2 justify-center items-center">
        {data?.status == "pending" && (
          <button
            onClick={handleOpen}
            className="p-2 rounded-md bg-teal-400 text-white hover:bg-teal-500 hover:shadow-md hover:shadow-gray-900">
            Pay Order
          </button>
        )}
        {OrderData?.status == "pending" && (
          <button
            onClick={handleOpenCancel}
            className="p-2 rounded-md bg-teal-400 text-white hover:bg-teal-500 hover:shadow-md hover:shadow-gray-900">
            Cancel Order
          </button>
        )}
        {OrderData?.status == "paid" && userDetail?.isAdmin && (
          <button
            onClick={handleOpenReturn}
            className="p-2 rounded-md bg-teal-400 text-white hover:bg-teal-500 hover:shadow-md hover:shadow-gray-900">
            Return Order
          </button>
        )}

        <button
          onClick={(e) => {
            router.push("/checkout");
          }}
          className="p-2 rounded-md bg-teal-400 text-white hover:bg-teal-500 hover:shadow-md hover:shadow-gray-900">
          Recreate Order
        </button>
      </div>

      <Dialog
        className="items-center align-middle justify-center"
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}>
        <DialogHeader>Payment Confirmation</DialogHeader>
        <DialogBody>
          <div className="w-full bg-blue-gray-900 flex justify-center items-center align-middle px-10 py-2 rounded-md">
            <div>
              <h3 className="font-semibold text-white">
                Confirm Payment of ₵{OrderData?.total_amount} for Order #
                {OrderData?.invoice_number}
              </h3>
            </div>
          </div>
          <div className="flex flex-col pt-10 items-center justify-center gap-2">
            <label
              className="text-sm font-normal text-gray-500"
              htmlFor="status">
              Payment Mode
            </label>
            <select
              value={OrderData?.payment_mode}
              onChange={(e) => {
                const updatedData = {
                  ...OrderData,
                  payment_mode: e.target.value,
                };

                // Set the updated data to replace the original data
                setOrderData(updatedData);
                setCashRecieve(0);
                setChange(0);
                // Further logic if needed
              }}
              className=" p-2 mb-1 block rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              id="size">
              <option value="momo">Momo</option>
              <option value="cash">Cash Paid</option>
              {/* <option value="pending">Create Order</option> */}
            </select>

            {OrderData?.payment_mode === "cash" ? (
              <div className="">
                <div className="p-2">
                  <Input
                    type="text"
                    label="cash recieved"
                    onChange={async (e) => {
                      setCashRecieve(e.target.value);
                      setChange(
                        (
                          parseFloat(e.target.value, 0) -
                          parseFloat(OrderData?.total_amount, 10)
                        ).toFixed(2)
                      );
                    }}
                    className="rounded w-full  bg-white"
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
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1">
            <span>Cancel</span>
          </Button>
          {parseFloat(cashRecieved, 10) >=
            parseFloat(OrderData?.total_amount, 10) && (
            <Button
              variant="gradient"
              color="green"
              onClick={(e) => {
                payOrder(e, OrderData);
                handleOpen;
              }}>
              <span>Pay ₵{OrderData?.total_amount}</span>
            </Button>
          )}
          {OrderData.payment_mode === "momo" && (
            <Button
              variant="gradient"
              color="green"
              onClick={(e) => {
                payOrder(e, OrderData);
                handleOpen;
              }}>
              <span>Pay with Momo</span>
            </Button>
          )}
        </DialogFooter>
      </Dialog>

      <Dialog
        className="items-center align-middle justify-center"
        open={openCancel}
        handler={handleOpenCancel}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}>
        <DialogHeader>Cancel Order</DialogHeader>
        <DialogBody>
          Confirm cancellation of Order #{OrderData?.invoice_number}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpenCancel}
            className="mr-1">
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={(e) => {
              cancelOrder(e, OrderData);
              handleOpenCancel;
            }}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        className="items-center align-middle justify-center"
        open={openReturn}
        handler={handleOpenReturn}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}>
        <DialogHeader>Return Order</DialogHeader>
        <DialogBody>
          Confirm Returning of Order #{OrderData?.invoice_number}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpenReturn}
            className="mr-1">
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={(e) => {
              returnOrder(e, OrderData);
              handleOpenReturn;
            }}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
