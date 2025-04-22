"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Spinner } from "@material-tailwind/react";

export default function AddCategory() {
  const queryClient = useQueryClient();
  const [category, setCategory] = React.useState({
    name: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category.name.length > 0) {
      setButtonDisabled(false);
    }
  }, [category]);

  const addCategory = async () => {
    //e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`/api/categories`, category);
      toast.success("Created successfully");
      return response.data;
    } catch (error) {
      console.log("Creating Failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const { mutate } = useMutation(addCategory, {
    onSuccess: async (data) => {
      // Update the cache with the newly added category
      await queryClient.setQueriesData("categories", (oldData) => [
        ...oldData,
        data,
      ]);
    },
  });

  const handleAddCategory = (e) => {
    e.preventDefault();
    // Call the mutation to add the new category
    mutate(category);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mt-20 px-4  ">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium leading-6 text-gray-900">
              Category name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                onChange={(e) =>
                  setCategory({ ...category, name: e.target.value })
                }
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="py-2">
              <button
                type="submit"
                onClick={handleAddCategory}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                {buttonDisabled ? "Enter new Category" : "Add Category"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
