"use client";

import { Typography } from "@material-tailwind/react";

export default function Footer() {
  return (
    <footer className=" fixed mt-10 bg-white bottom-0 px-2 flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 py-6 text-center md:justify-between">
      <Typography
        color="blue-gray"
        className="ml-4 font-semibold text-sm"
        variant="small">
        &copy; 2023 ShopGuard
      </Typography>
      <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
        <li>
          <Typography
            as="a"
            href="#"
            color="blue-gray"
            variant="small"
            className="mr-4  font-semibold text-sm transition-colors hover:text-blue-500 focus:text-blue-500">
            License
          </Typography>
        </li>
      </ul>
    </footer>
  );
}
