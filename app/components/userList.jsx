"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
} from "@material-tailwind/react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { ProductsContext } from "../components/ProductsContext";

import { toast } from "react-hot-toast";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

const TABLE_HEAD = ["User", "Role", "Status", "Employed", ""];

const TABLE_ROWS = [
  {
    img: "",
    name: "John Michael",
    email: "john@creative-tim.com",
    job: "Manager",
    org: "Organization",
    online: true,
    date: "23/04/18",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
    name: "Alexa Liras",
    email: "alexa@creative-tim.com",
    job: "Programator",
    org: "Developer",
    online: false,
    date: "23/04/18",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
    name: "Laurent Perrier",
    email: "laurent@creative-tim.com",
    job: "Executive",
    org: "Projects",
    online: false,
    date: "19/09/17",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
    name: "Michael Levi",
    email: "michael@creative-tim.com",
    job: "Programator",
    org: "Developer",
    online: true,
    date: "24/12/08",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
    name: "Richard Gran",
    email: "richard@creative-tim.com",
    job: "Manager",
    org: "Executive",
    online: false,
    date: "04/10/21",
  },
];

const getUsers = async () => {
  try {
    const res = await fetch(`/api/users/`, {
      cache: "no-store",
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Failed loading Users");
    }

    return res.json();
    //console.log(data);
    return data.users; // Return the categories array
  } catch (error) {
    console.log("error Loading Users", error);
  }
};
export function SortableTable({ currentUser }) {
  const { setUserDetail } = useContext(ProductsContext);

  useEffect(() => {
    setUserDetail(currentUser?.userData);
  }, [currentUser?.userData, setUserDetail]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((cur) => !cur);
  };

  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (
      user.username.length > 0 &&
      user.email.length &&
      user.password.length > 0
    ) {
      setButtonDisabled(false);
    }
  }, [user]);

  const onSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(user);
      const response = await axios.post("/api/users/signup", user);
      toast.success("User Added");
      // console.log("Signup successfull", response.data);
      //router.push("/users/signin");
      setOpen(false);
    } catch (error) {
      console.log("Signup failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <>
      <div className="ml-20 mt-15 px-10 relative z-10 h-[75vh]  overflow-y-scroll">
        <Card className=" w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Users
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all User
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button variant="outlined" size="sm">
                  view all
                </Button>
                <Button
                  onClick={handleOpen}
                  className="flex items-center gap-3"
                  size="sm">
                  <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add User
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <Tabs value="all" className="w-full md:w-max">
                <TabsHeader>
                  {TABS.map(({ label, value }) => (
                    <Tab key={value} value={value}>
                      &nbsp;&nbsp;{label}&nbsp;&nbsp;
                    </Tab>
                  ))}
                </TabsHeader>
              </Tabs>
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-scroll px-0">
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head, index) => (
                    <th
                      key={head}
                      className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                        {head}{" "}
                        {index !== TABLE_HEAD.length - 1 && (
                          <ChevronUpDownIcon
                            strokeWidth={2}
                            className="h-4 w-4"
                          />
                        )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.users?.map(
                  ({ _id, username, email, isAdmin, date }, index) => {
                    const isLast = index === data?.users?.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={_id}>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={"/images/placeholder.png"}
                              alt={username}
                              size="sm"
                            />
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal">
                                {username}
                              </Typography>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-70">
                                {email}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              variant="outlined"
                              size="sm"
                              value={isAdmin ? "Admin" : "User"}
                              color={isAdmin ? "cyan" : "blue-gray"}
                            />
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              variant="ghost"
                              size="sm"
                              value={isAdmin ? "Active" : "Inactive"}
                              color={isAdmin ? "green" : "blue-gray"}
                              icon={
                                isAdmin && (
                                  <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-green-900 content-['']" />
                                )
                              }
                            />
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal">
                            {date}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Edit User">
                            <IconButton variant="text">
                              <PencilIcon className="h-4 w-4" />
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
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal">
              Page 1 of 10
            </Typography>
            <div className="flex gap-2">
              <Button variant="outlined" size="sm">
                Previous
              </Button>
              <Button variant="outlined" size="sm">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Dialog size="xs" open={open} handler={handleOpen} className="">
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardHeader
            color="blue"
            className="mb-4 grid h-16 place-items-center bg-blue-600">
            <Typography
              variant="h2"
              color="white"
              className="font-bold text-lg">
              Add New User
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 p-4">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6">
                <div>
                  <div className="">
                    <Input
                      label="username"
                      id="name"
                      name="name"
                      type="text"
                      onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
                      }
                      required
                      className=""
                    />
                  </div>
                </div>
                <div>
                  <div className="">
                    <Input
                      label="email"
                      id="email"
                      name="email"
                      type="email"
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      required
                      className=""
                    />
                  </div>
                </div>

                <div>
                  <div className="">
                    <Input
                      label="password"
                      id="password"
                      name="password"
                      type="password"
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                      required
                      className=""
                    />
                  </div>
                </div>
              </form>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <div className="flex flex-row gap-2">
              <Button className="bg-red-800" onClick={handleOpen} fullWidth>
                Cancel
              </Button>
              <Button
                onClick={onSignup}
                className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                {buttonDisabled ? "Complete  form" : "Signup"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}
