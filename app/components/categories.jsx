"use client";

import {
  List,
  ListItem,
  ListItemSuffix,
  Card,
  IconButton,
  Radio,
} from "@material-tailwind/react";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from "@material-tailwind/react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import { ProductsContext } from "./ProductsContext";

import ReactPaginate from "react-paginate";

import { Spinner } from "@material-tailwind/react";

import { MdDelete, MdEdit, MdEditNotifications } from "react-icons/md";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { experimental_useOptimistic as useOptimistic } from "react";

import {
  AddCategory,
  GetCategories,
  DeleteCategory,
  UpdateCategory,
} from "../actions/categoryActions";

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

const schema = yup
  .object({
    name: yup.string().required().min(3),
    active: yup.boolean().required("Please select the category status"),
  })
  .required();

//get cats
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

//main function
export function CategoryClient({ data, currentUser }) {
  const queryClient = useQueryClient();
  const { userDetail, setUserDetail } = useContext(ProductsContext);

  useEffect(() => {
    setUserDetail(currentUser?.userData);
  }, [currentUser?.userData, setUserDetail]);

  const { pending } = useFormStatus();
  const [useOptimisticData, addOptimisticData] = useOptimistic(
    data,
    (state, newData) => {
      return [...state, newData];
    }
  );

  //const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      active: true,
    },
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const offset = currentPage * itemsPerPage;

  const [category, setCategory] = useState({
    name: "",
    active: true,
  });

  const [editCat, setEditCat] = useState({
    id: "",
    name: "",
    active: true,
  });

  const [delCategoryID, setDelCategoryID] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((cur) => !cur);
  };

  const [editOpen, setEditOpen] = useState(false);

  const handleEditOpen = (category) => {
    setEditCat({ ...editCat, name: category.name, id: category._id });
    setEditOpen((cur) => !cur);
  };

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteOpen = (id) => {
    setDelCategoryID(id);
    setDeleteOpen((cur) => !cur);
  };

  const deleteHandler = async (deletedCat) => {
    //console.log(deletedCat._id);
    const id = delCategoryID;

    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      return responseData.message; // Product deleted successfully message
    } catch (error) {
      console.error("Error deleting Cat:", error);
      throw error;
    }
  };

  const delMutation = useMutation({
    mutationFn: deleteHandler,
    onMutate: async (delCategoryID) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      const previousCategories = queryClient.getQueriesData(["categories"]);
      const newCats = previousCategories[0][1];

      queryClient.setQueriesData(
        ["categories"],
        newCats.filter((category) => category._id !== delCategoryID)
      );
      return { newCats };
    },
    onError: (err, category, context) => {
      queryClient.setQueriesData(["categories"]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onSuccess(data, variables, context) {
      setDeleteOpen(false);
      toast.success("Deleted successfuly");
    },
  });

  const [showEditCategory, setShowEditCategory] = useState(false);

  /*  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: GetCategories,
  });
 */
  /*  const data = GetCategories();
  console.log(data); */

  const sortedData = useOptimisticData?.slice().sort((a, b) => {
    // Parse the date strings into Date objects
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Compare the dates to sort in descending order (latest date first)
    return dateB - dateA;
  });

  const displayedItems = sortedData?.slice(offset, offset + itemsPerPage);

  const updateCategory = async () => {
    const newName = editCat.name;
    const id = editCat.id;
    try {
      const res = await fetch(`api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify({ newName }),
      });

      if (!res.ok) {
        throw new Error("success upate Category");
      }
    } catch (error) {}
  };

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onMutate: async (updatedCat) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      const previousCategories = queryClient.getQueriesData(["categories"]);
      const newCats = previousCategories[0][1];

      // Assuming your updateCategory function returns the updated category
      queryClient.setQueriesData(
        ["categories"],
        newCats.map((category) =>
          category._id === updatedCat._id ? updatedCat : category
        )
      );
      return { newCats };
    },
    onError: (err, category, context) => {
      queryClient.setQueriesData(["categories"]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onSuccess(data, variables, context) {
      setEditOpen(false);

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Updated successfully");
      }
    },
  });

  const handleUpdate = async (cat) => {
    //e.preventDefault();
    //updateMutation.mutate(editCat);

    const result = await UpdateCategory(cat);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(result?.message);
    }
  };

  const addCategory = async () => {
    //e.preventDefault();
    try {
      //setLoading(true);
      const response = await axios.post(`/api/categories`, category);
      //toast.success("Created successfully");
      return response.data;
    } catch (error) {
      console.log("Creating Failed", error.message);
      toast.error(error.message);
    } finally {
      //setLoading(false);
      setOpen(false);
    }
  };

  const addMutation = useMutation(AddCategory, {
    onMutate: async (data) => {
      await queryClient.cancelQueries(["categories"]);

      /*  const previousCategories = queryClient.getQueryData(["categories"]);
      const updatedCategories = [...previousCategories, newCategory];

      queryClient.setQueryData(["categories"], updatedCategories);

      return { updatedCategories }; */
    },
    onError: (error, newCategory, context) => {
      // Handle errors, if needed
    },
    onSettled: () => {
      queryClient.invalidateQueries(["categories"]);
    },
    onSuccess: (data, variables, context) => {
      // Handle success, if needed
      if (data.error) {
        setOpen(false);
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setOpen(false);
        reset();
      }
    },
  });

  const handleAddCategory = (e) => {
    e.preventDefault();
    // Call the mutation to add the new category
    addMutation.mutate(category);
  };

  const handleFormSubmit = async (data) => {
    console.log(data);

    addOptimisticData({
      _id: Math.random(),
      content: data,
    });

    const result = await AddCategory(data);
    if (result.error) {
      setOpen(false);
      reset();
      toast.error(result.error);
    } else {
      toast.success(result.message);
      setOpen(false);
      reset();
    }
  };

  return (
    <>
      {/*       <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        {showAddCategory && <AddCategory />}
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        {showEditCategory && <EditCategory />}
      </div> */}

      <div className="margin-auto py-10 px-60 mt-20 ml-20 bg-gray-100">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {/*  {loading ? "Creating Category" : "Add new Category"} */}
            Categories
          </h2>
        </div>
        <div className="flex flex-row justify-between mb-5">
          <h1 className=" flex flex-grow"></h1>
          <button
            onClick={handleOpen}
            className=" bg-gray-800 text-white px-2 rounded">
            Add +
          </button>
        </div>

        <Card className="justify-center mb-16">
          <List>
            {displayedItems.map((category) => (
              <ListItem
                key={category._id}
                ripple={false}
                className="py-1 pr-1 pl-4 border-b-2 hover:shadow-sm hover:shadow-gray-300">
                {category.name}{" "}
                <Typography className="border bg-green-400 text-white rounded-md px-1 text-sm ml-2">
                  Active
                </Typography>
                <ListItemSuffix className="flex flex-row gap-2">
                  <IconButton
                    onClick={() => handleEditOpen(category)}
                    variant="text"
                    color="blue-gray">
                    <MdEdit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteOpen(category._id)}
                    variant="text"
                    color="blue-gray">
                    <TrashIcon />
                  </IconButton>
                </ListItemSuffix>
              </ListItem>
            ))}
          </List>
          <ReactPaginate
            pageCount={Math.ceil(data.length / itemsPerPage)}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            onPageChange={handlePageChange}
            pageClassName={"bg-slate-200 text-gray-600 rounded px-4"}
            containerClassName="flex flex-row justify-center gap-4 mb-4"
            activeClassName="text-green-600 font-extrabold bg-green-800 text-white"
            nextLabel={<ArrowRightIcon style={{ fontSize: 18, width: 20 }} />}
            previousLabel={
              <ArrowLeftIcon style={{ fontSize: 18, width: 20 }} />
            }
          />
        </Card>

        <Dialog size="xs" open={open} handler={handleOpen} className="">
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardHeader
              color="blue"
              className="mb-4 grid h-28 place-items-center bg-blue-600">
              <Typography
                variant="h2"
                color="white"
                className="font-bold text-lg">
                Add New Category
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4 p-4">
              <form
                className="space-y-6"
                onSubmit={handleSubmit(handleFormSubmit)}>
                <div>
                  <div className="mt-2">
                    <Input
                      name="name"
                      type="text"
                      label="Category name"
                      defaultValue=""
                      onChange={(e) => {
                        setValue("name", e.target.value);

                        setCategory({ ...category, name: e.target.value });
                      }}
                      {...register("name")}
                      error={errors.name ? true : false}
                    />
                    {errors.name?.message && (
                      <p className="pt-1 text-red-600  rounded-md text-xs  font-semibold">
                        {errors.name?.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-10">
                    <Controller
                      control={control}
                      name="active"
                      render={({ field }) => (
                        <Radio
                          onChange={() => {
                            field.onChange(true);
                          }}
                          name="type"
                          label="Active"
                          defaultChecked
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="active"
                      render={({ field }) => (
                        <Radio
                          onChange={() => {
                            field.onChange(false);
                          }}
                          name="type"
                          label="InActive"
                        />
                      )}
                    />
                  </div>

                  {errors.active && (
                    <p className="text-red-600 rounded-md text-xs font-semibold">
                      {errors.active.message}
                    </p>
                  )}
                  {/*  <div className="flex gap-10">
                    <Radio
                      onClick={(e) => {
                        setCategory({ ...category, active: true });
                      }}
                      name="type"
                      label="Active"
                      defaultChecked
                    />
                    <Radio
                      onClick={(e) => {
                        setCategory({ ...category, active: false });
                      }}
                      name="type"
                      label="Inactive"
                    />
                  </div> */}

                  <div className="py-2">
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      /*   onClick={handleAddCategory} */
                      className="flex w-full justify-center rounded-md disabled:bg-gray-600 bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardBody>
            <CardFooter className="pt-0">
              <Button className="bg-red-800" onClick={handleOpen} fullWidth>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </Dialog>

        <Dialog
          size="xs"
          open={editOpen}
          handler={handleEditOpen}
          className="bg-transparent shadow-none">
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardHeader
              color="blue"
              className="mb-4 grid h-28 place-items-center bg-blue-600">
              <Typography
                variant="h2"
                color="white"
                className="font-bold text-lg">
                Edit Category
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4 p-4">
              <form
                className="space-y-6"
                action={(e) => {
                  setEditOpen(false);
                  const cat = editCat;
                  handleUpdate(cat);
                }}>
                <div>
                  <div className="mt-2">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={editCat.name}
                      label="Category name"
                      onChange={(e) =>
                        setEditCat({ ...editCat, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="py-2">
                    <Button
                      disabled={pending}
                      type="submit"
                      /* onClick={(e) => {
                        handleUpdate(e);
                      }} */
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      {pending ? "Updating" : "Update"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardBody>
            <CardFooter className="pt-0">
              <Button className="bg-red-800" onClick={handleEditOpen} fullWidth>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </Dialog>

        <Dialog
          open={deleteOpen}
          size="sm"
          className="w-100"
          handler={handleDeleteOpen}>
          <DialogHeader>Deleting category</DialogHeader>
          <DialogBody divider>
            Are you sure you want to Delete this category permanently?
          </DialogBody>
          <DialogFooter>
            <form
              action={() => {
                const id = delCategoryID;
                DeleteCategory(id);
                setDeleteOpen(false);
              }}>
              <Button
                variant="text"
                color="red"
                onClick={() => handleDeleteOpen(null)}
                className="mr-1">
                <span>Cancel</span>
              </Button>
              <Button
                disabled={pending}
                variant="gradient"
                color="green"
                type="submit"
                className="bg-green-400 text-white text-sm"
                /* onClick={() => delMutation.mutate(delCategoryID)} */
              >
                <span>{pending ? "Deleting" : "Confirm"}</span>
              </Button>
            </form>
          </DialogFooter>
        </Dialog>
      </div>
    </>
  );
}
