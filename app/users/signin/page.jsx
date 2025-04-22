"use client";

import axios from "axios";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Login } from "../../actions/userActions";

import { Spinner, Input } from "@material-tailwind/react";

// export const runtime = "edge";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(4).max(16).required(),
  })
  .required();

export default function SignIn() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    /* console.log(data); */
    const result = await Login(data);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Login Successful");
      reset();
      router.push("/");
    }
  };

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.email.length && user.password.length > 0) {
      setButtonDisabled(false);
    }
  }, [user]);

  const onSignIn = async (data) => {
    //e.preventDefault();
    try {
      setLoading(true);
      await axios.post("/api/users/signin", data);
      router.push("/");
      toast.success("Login successful");
    } catch (error) {
      //console.log("Login Failed", error.message);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen duration-300">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div
        className="flex min-h-screen items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/bg2.jpg")' }}>
        <div className="grid grid-cols-1 w-96 p-2 lg:w-1/3 pb-10 rounded-lg shadow-md shadow-gray-800 bg-gray-50">
          <div className="h-20 w-full bg-blue-gray-50 flex flex-1 justify-center items-center">
            <h2 className=" font-extrabold text-3xl text-purple-900">
              Shop Guard
            </h2>
          </div>
          <div className="">
            <h2 className=" text-center pt-5 text-xl font-bold leading-9 tracking-tight text-gray-900">
              {loading ? "Signing In" : "Sign In"}
            </h2>
          </div>

          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
              <div>
                <div className="mt-2">
                  <Input
                    id="email"
                    name="email"
                    autoComplete="email"
                    label="email address"
                    /*  onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    required */
                    {...register("email")}
                  />
                  {errors.email?.message && (
                    <p className="pt-1 text-red-600  rounded-md text-xs  font-semibold">
                      {errors.email?.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between"></div>
                <div className="mt-2">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    /* onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    } */
                    {...register("password")}
                  />
                  {errors.password?.message && (
                    <p className="pt-1 text-red-600 rounded-md text-xs  font-semibold">
                      {errors.password?.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  /*  onClick={onSignIn} */
                  className="flex w-full justify-center disabled:bg-blue-gray-100 rounded-md bg-blue-gray-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  {isSubmitting ? "Signing In" : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
