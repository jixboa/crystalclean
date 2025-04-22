"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import ReactPaginate from "react-paginate";
import { Chip } from "@material-tailwind/react";
import { ProductsContext } from "./ProductsContext";
import Image from "next/image";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Textarea,
  Select,
  Option,
  MenuItem,
} from "@material-tailwind/react";

import { MdDelete, MdEdit, MdEditNotifications } from "react-icons/md";
import { IconButton } from "@material-tailwind/react";

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5">
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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

export default function ProductClient({ products, currentUser }) {
  const queryClient = useQueryClient();
  const { userDetail, setUserDetail } = useContext(ProductsContext);

  useEffect(() => {
    setUserDetail(currentUser?.userData);
  }, [currentUser?.userData, setUserDetail]);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    size: "",
    status: "",
  });

  const [editProduct, setEditProduct] = useState({
    _id: "",
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    size: "",
    status: "",
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((cur) => !cur);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const [editOpen, setEditOpen] = useState(false);
  const handleEditOpen = (product) => {
    setEditProduct({
      ...editProduct,
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      size: product.size,
      status: product.status,
    });
    setEditOpen((cur) => !cur);
  };

  const updateProduct = async () => {
    const id = editProduct._id;
    const newName = editProduct.name;
    const newDescription = editProduct.description;
    const newCategory = editProduct.category;
    const newPrice = editProduct.price;
    const newSize = editProduct.size;
    const newQuantity = editProduct.quantity;
    const newStatus = editProduct.status;
    try {
      const res = await fetch(`api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          newName,
          newDescription,
          newCategory,
          newPrice,
          newSize,
          newQuantity,
          newStatus,
        }),
      });
      if (!res.ok) {
        throw new Error("success upate Product");
      }
    } catch (error) {}
  };

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onMutate: async (updatedProd) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });

      /* const previousCategories = queryClient.getQueriesData(["products"]);
      const newCats = previousCategories[0][1];

      // Assuming your updateCategory function returns the updated category
      queryClient.setQueriesData(
        ["products"],
        newCats.map((product) =>
          product._id === updatedProd._id ? updatedProd : product
        )
      );
      return { newCats }; */
    },
    onError: (err, product, context) => {
      queryClient.setQueriesData(["products"]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSuccess(data, variables, context) {
      setEditOpen(false);
      toast.success("Updated successfully");
    },
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    //console.log(editProduct);
    updateMutation.mutate(editProduct);
  };

  const [delProductID, setDelProductID] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteOpen = (id) => {
    setDelProductID(id);
    setDeleteOpen((cur) => !cur);
  };

  const deleteHandler = async () => {
    //console.log(deletedCat._id);
    const id = delProductID;

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      return responseData.message; // Product deleted successfully message
    } catch (error) {
      console.error("Error deleting Product:", error);
      throw error;
    }
  };

  const delMutation = useMutation({
    mutationFn: deleteHandler,
    onMutate: async (delProductID) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
    },
    onError: (err, product, context) => {
      queryClient.setQueriesData(["products"]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSuccess(data, variables, context) {
      setDeleteOpen(false);
      toast.success("Deleted successfuly");
    },
  });

  const addProduct = async () => {
    //e.preventDefault();
    try {
      //setLoading(true);
      const response = await axios.post(`/api/products`, product);

      return response.data;
    } catch (error) {
      console.log("Creating Failed", error.message);
      toast.error(error.message);
    } finally {
      //setLoading(false);
      setOpen(false);
    }
  };

  const addMutation = useMutation(addProduct, {
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries(["products"]);

      /*  const previousProducts = queryClient.getQueryData(["products"]);
      const updatedProducts = [...previousProducts, newProduct];

      queryClient.setQueryData(["products"], updatedProducts);

      return { updatedCategories }; */
    },
    onError: (error, newProduct, context) => {
      // Handle errors, if needed
      toast.err("Could not save");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["products"]);
    },
    onSuccess: (data, variables, context) => {
      // Handle success, if needed
      setProduct({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        size: "",
        status: "",
      });

      toast.success("Products added successfully");
    },
  });

  const handleAddProduct = () => {
    addMutation.mutate(product);
  };

  return (
    <div className=" ml-20">
      <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {/*  {loading ? "Creating Category" : "Add new Category"} */}
          Products
        </h2>
      </div>

      <div className="p-10 mb-16 py-10 px-40 ">
        <div className="flex flex-row  mb-5">
          <h1 className=" flex flex-grow"></h1>
          <button
            onClick={handleOpen}
            className=" bg-gray-800 text-white px-2 rounded hover:shadow-sm hover:bg-gray-700">
            Add +
          </button>
        </div>
        <ul
          role="list"
          className="divide-y divide-gray-100 lg:h-[100vh] h-[70vh] overflow-scroll p-4">
          {products?.map((prod) => (
            <li
              key={prod._id}
              className="py-5 hover:shadow-sm hover:shadow-gray-500">
              <div className="flex min-w-0 gap-x-4 justify-between">
                {
                  <img
                    className="h-12 w-12 flex-none rounded-full bg-gray-50"
                    src={prod.picture}
                    alt=""
                  />
                }
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {prod.name} {"("} {prod.size} {")"} {"-"} {"₵" + prod.price}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {prod.description}
                  </p>
                </div>
                <div className="px-10">
                  <Typography className=" bg-green-400 text-white rounded-lg px-2 text-sm shadow-gray-600 shadow-md hover:bg-green-600">
                    Active
                  </Typography>
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-end flex-row">
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-md font-semibold  text-gray-500">
                      {prod.quantity} Available
                    </p>
                  </div>
                </div>
                <div className="flex flex-row">
                  <IconButton
                    onClick={() => handleEditOpen(prod)}
                    variant="text"
                    color="blue-gray">
                    <MdEdit className="text-gray-800" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteOpen(prod._id)}
                    variant="text"
                    color="blue-gray">
                    <MdDelete className="text-red-800" />
                  </IconButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Dialog
        size="md"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-inherit transform">
        <Card className="mx-auto w-full max-w-[24rem] p-2">
          <CardHeader
            color="blue"
            className="mb-2 grid h-10 place-items-center bg-blue-600">
            <Typography
              variant="h2"
              color="white"
              className="font-bold text-lg">
              Add New Product
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="text"
                value={product.name}
                label="product name"
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                className="pb-2"
              />
              <Textarea
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
                value={product.description}
                id="example-textarea"
                label="Enter your text here..."
              />

              <div>
                <label
                  className="text-xs font-extralight text-gray-500"
                  htmlFor="category">
                  Select Category
                </label>

                <select
                  onChange={(e) => {
                    setProduct({ ...product, category: e.target.value });
                  }}
                  className="mb-1 block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  id="category">
                  <option value="Biscuit">Biscuit</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Noodles">Noodles</option>
                  <option value="Oil">Oil</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  value={product.quantity}
                  type="text"
                  label="quantity"
                  onChange={(e) =>
                    setProduct({ ...product, quantity: e.target.value })
                  }
                  className="w-full"
                />
                <Input
                  value={product.price}
                  type="text"
                  label="price"
                  onChange={(e) => {
                    setProduct({ ...product, price: e.target.value });
                  }}
                  className="w-full"
                />
              </div>

              <div className=" flex flex-row gap-2">
                <div className="w-1/2">
                  <label
                    className="text-xs font-extralight text-gray-500 ml-1 pl-2"
                    htmlFor="category">
                    Select Size
                  </label>
                  <select
                    onChange={(e) => {
                      setProduct({ ...product, size: e.target.value });
                    }}
                    className="mb-1 block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    id="size">
                    <option value="normal">normal</option>
                    <option value="sm">sm</option>
                    <option value="md">md</option>
                    <option value="lg">lg</option>
                  </select>
                </div>

                <div className="w-1/2">
                  <label
                    className="text-xs font-extralight text-gray-500 ml-1"
                    htmlFor="category">
                    Select Status
                  </label>
                  <select
                    onChange={(e) => {
                      setProduct({ ...product, status: e.target.value });
                    }}
                    className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    id="status">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </form>
          </CardBody>
          <CardFooter className="pt-0">
            <div className="flex flex-row gap-2">
              <div className="w-1/2">
                <Button
                  className=" bg-transparent text-red-700"
                  onClick={(e) => {
                    setProduct({
                      name: "",
                      description: "",
                      category: "",
                      price: "",
                      quantity: "",
                      status: "",
                      size: "",
                    });
                    setOpen(false);
                  }}
                  fullWidth>
                  Cancel
                </Button>
              </div>
              <div className="w-1/2">
                <Button
                  className="bg-green-400 text-white text-sm"
                  onClick={handleAddProduct}
                  fullWidth>
                  Add product
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Dialog>

      <Dialog
        size="sm"
        open={editOpen}
        handler={handleEditOpen}
        className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem] p-2">
          <CardHeader
            color="blue"
            className="mb-2 grid h-10 place-items-center bg-blue-600">
            <Typography
              variant="h2"
              color="white"
              className="font-bold text-lg">
              Product Update
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-2 p-4">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="text"
                value={editProduct.name}
                label="product name"
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />
              <Textarea
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    description: e.target.value,
                  })
                }
                value={editProduct.description}
                id="example-textarea"
                rows="4"
                label="Enter description"></Textarea>

              <div>
                <label
                  className="text-xs font-extralight text-gray-500"
                  htmlFor="category">
                  Select Category
                </label>

                <select
                  value={editProduct.category}
                  onChange={(e) => {
                    setEditProduct({
                      ...editProduct,
                      category: e.target.value,
                    });
                  }}
                  className="mb-1 block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  id="category">
                  <option value="Biscuit">Biscuit</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Noodles">Noodles</option>
                  <option value="Oil">Oil</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  value={editProduct.price}
                  type="text"
                  label="price"
                  onChange={(e) => {
                    setEditProduct({
                      ...editProduct,
                      price: e.target.value,
                    });
                  }}
                  className="w-full"
                />

                <Input
                  value={editProduct.quantity}
                  type="text"
                  label="quantity"
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      quantity: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div className=" flex flex-row gap-2">
                <div className="w-1/2">
                  <label
                    className="text-xs font-extralight text-gray-500 ml-1"
                    htmlFor="category">
                    Select Size
                  </label>
                  <select
                    value={editProduct.size}
                    onChange={(e) => {
                      setEditProduct({
                        ...editProduct,
                        size: e.target.value,
                      });
                    }}
                    className="mb-1 block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    id="size">
                    <option value="normal">normal</option>
                    <option value="sm">sm</option>
                    <option value="md">md</option>
                    <option value="lg">lg</option>
                  </select>
                </div>

                <div className="w-1/2">
                  <label
                    className="text-xs font-extralight text-gray-500 ml-1"
                    htmlFor="category">
                    Select Status
                  </label>
                  <select
                    value={editProduct.status}
                    onChange={(e) => {
                      setEditProduct({
                        ...editProduct,
                        status: e.target.value,
                      });
                    }}
                    className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    id="status">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </form>
          </CardBody>
          <CardFooter className="pt-0">
            <div className="flex flex-row gap-2">
              <div className="w-1/2">
                <Button
                  className=" bg-transparent text-red-700"
                  onClick={(e) => {
                    setEditProduct({
                      name: "",
                      description: "",
                      category: "",
                      price: "",
                      quantity: "",
                      status: "",
                      size: "",
                    });
                    setEditOpen(false);
                  }}
                  fullWidth>
                  Cancel
                </Button>
              </div>
              <div className="w-1/2">
                <Button
                  className="bg-green-400 text-white text-sm"
                  onClick={handleUpdate}
                  fullWidth>
                  Update
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Dialog>

      <Dialog
        open={deleteOpen}
        size="sm"
        className="w-100"
        handler={handleDeleteOpen}>
        <DialogHeader>Deleting Product</DialogHeader>
        <DialogBody divider>
          Are you sure you want to Delete this product permanently?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => handleDeleteOpen(null)}
            className="mr-1">
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            className="bg-green-400 text-white text-sm"
            onClick={() => delMutation.mutate(delProductID)}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
