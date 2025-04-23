"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@material-tailwind/react";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(4).max(16).required(),
  })
  .required();

export default function SignIn() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await axios.post("/api/users/signin", data);
      toast.success("Login Successful");
      router.push("/");
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 min-h-screen">
      {/* Left Side: Cover Image */}
      <div
        className="col-span-2 bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/mennak_bg1.jpg")' }}
      ></div>

      {/* Right Side: Login Form */}
      <div className="col-span-1 flex items-center justify-center bg-gradient-to-b from-blue-gray-300 to-blue-gray-800">
        <div className="w-11/12 sm:w-96 p-6 rounded-lg shadow-md bg-white bg-opacity-80">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-purple-900">
              MenNak Sanitation
            </h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                label="Email Address"
                {...register("email")}
              />
              {errors.email?.message && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.email?.message}
                </p>
              )}
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                {...register("password")}
              />
              {errors.password?.message && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-gray-900 text-white py-2 px-4 rounded-md hover:bg-blue-gray-800 disabled:bg-blue-gray-100"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}