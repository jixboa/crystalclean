"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { useState, useEffect, useContext } from "react";
import { ProductsContext } from "./ProductsContext";

import { useRouter, usePathname } from "next/navigation";

import { PencilIcon } from "@heroicons/react/24/solid";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import Link from "next/link";

const TABLE_HEAD = [
  "Name",
  "Contact",
  "Invoice No.",
  "Amount",
  "Date",
  "Payment Mode",
  "Status",
  "Created By",
  "",
];

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

export default function OrdersClient({ orders, currentUser }) {
  const router = useRouter();

  /* const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  }); */

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Number of items to display per page
  const { userDetail, setUserDetail } = useContext(ProductsContext);

  useEffect(() => {
    setUserDetail(currentUser?.userData);
  }, [currentUser?.userData, setUserDetail]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;

  const sortedData = orders?.slice().sort((a, b) => {
    // Parse the date strings into Date objects
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Compare the dates to sort in descending order (latest date first)
    return dateB - dateA;
  });

  const [phrase, setPhrase] = useState("");

  let paginatedData;

  if (phrase) {
    /* paginatedData = sortedData?.filter((p) =>
      p.invoice_number.toLowerCase().includes(phrase)
      ); */
    paginatedData = sortedData
      .slice(offset, offset + itemsPerPage)
      .filter((p) => p.invoice_number.toLowerCase().includes(phrase));
  } else {
    paginatedData = sortedData.slice(offset, offset + itemsPerPage);
  }

  // Then, apply pagination to the sorted data

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

  //paginatedData?.sort((a, b) => b.date - a.date);

  return (
    <div className="mt-20 mb-20 p-5 ml-20">
      <Card className="h-full lg:w-full w-auto">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 lg:flex-row sm:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                All Transactions
              </Typography>
              {/* <Typography color="gray" className="mt-1 font-normal">
                These are details about the last transactions
              </Typography> */}
            </div>
            <div className="flex w-full shrink-0 gap-2 md:w-max sm:w-max sm:justify-start">
              <div className="w-72 md:w-72">
                <Input
                  onChange={(e) => setPhrase(e.target.value)}
                  placeholder="Search by invoice#"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
              <Button className="flex items-center gap-3" size="sm">
                <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4" />{" "}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="sm:w-full w-72 min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70">
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map(
                (
                  {
                    _id,
                    name,
                    contact,
                    invoice_number,
                    total_amount,
                    date,
                    payment_mode,
                    status,
                    created_by,
                    products,
                  },
                  index
                ) => {
                  const isLast = index === paginatedData?.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr
                      enter="ease-in-out duration-500"
                      leave="ease-in-out duration-500"
                      key={_id}
                      className="even:bg-blue-gray-50/50 ease-in-out duration-500">
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          {/* <Avatar
                            src={img}
                            alt={name}
                            size="md"
                            className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                          /> */}
                          <h1 className="font-bold text-sm">{name}</h1>
                        </div>
                      </td>
                      <td className={classes}>
                        <h3 className="font-normal text-sm">{contact}</h3>
                      </td>
                      <td className={classes}>
                        <h1 className="font-semibold text-sm">
                          {invoice_number}
                        </h1>
                      </td>
                      <td className={classes}>
                        <h1 className="font-normal text-sm">₵{total_amount}</h1>
                      </td>
                      <td className={classes}>
                        <h1 className="font-normal text-sm">
                          {formatDate(date)}
                        </h1>
                      </td>
                      <td className={classes}>
                        <h1 className="font-semibold text-sm">
                          {payment_mode}
                        </h1>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            size="sm"
                            variant="ghost"
                            className="border border-slate-200"
                            value={status}
                            color={
                              status === "paid"
                                ? "green"
                                : status === "pending"
                                ? "amber"
                                : "red"
                            }
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <h1 className="font-semibold text-sm">{created_by}</h1>
                      </td>
                      {/* <td className={classes}>
                      <ol className="mb-10">
                        {products &&
                          products.map((product, index) => (
                            <li
                              className=" bg-slate-400 border border-zinc-300"
                              key={product.name}>
                              Product Name: {product.name}, Quantity:{" "}
                              {product.quantity}, Unit Amount:{" "}
                              {product.unit_amount}
                            </li>
                          ))}
                      </ol>
                    </td> */}
                      <td className={classes}>
                        <Tooltip content="View Order">
                          <IconButton
                            variant="text"
                            onClick={(e) =>
                              router.push(`/orderDetails?id=${_id}`)
                            }>
                            <EyeIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 20,
              boxSizing: "border-box",
              width: "100%",
              height: "100%",
            }}>
            <ReactPaginate
              pageCount={Math.ceil(orders.length / itemsPerPage)}
              pageRangeDisplayed={5}
              marginPagesDisplayed={2}
              onPageChange={handlePageChange}
              pageClassName={"bg-slate-200 text-gray-600 rounded-lg px-2"}
              containerClassName="flex flex-row justify-center gap-4 mb-4"
              activeClassName="text-green-600 font-extrabold bg-green-800 text-white"
              nextLabel={<ArrowRightIcon style={{ fontSize: 18, width: 20 }} />}
              previousLabel={
                <ArrowLeftIcon style={{ fontSize: 18, width: 20 }} />
              }
            />
          </div>
        </CardFooter>
      </Card>

      {/* <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Date</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.name}</td>
              <td>{order.contact}</td>
              <td>{order.date}</td>
              <td>
                <ul className="mb-10">
                  {order.products &&
                    order.products.map((product, index) => (
                      <li
                        className=" bg-slate-400 border border-zinc-300"
                        key={product.name}>
                        Product Name: {product.name}, Quantity:{" "}
                        {product.quantity}, Unit Amount: {product.unit_amount}
                      </li>
                    ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}
