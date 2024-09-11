"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export default function UsersPage() {
  const [position, setPosition] = useState("bottom");

  return (
    <div className=" flex  w-full h-screen items-center justify-center px-10 flex-col">
      <div className=" w-full items-center   flex  justify-between p-10 pl-4 mb-20">
        <p className="  text-teal-700  font-bold shadow-sm drop-shadow-sm  underline-offset-1 underline text-3xl">
          User Management
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button className=" bg-gray-700">Add Users</Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none"> Add users</h4>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width"> firstname:</Label>
                  <Input id="width" className="col-span-2 h-8" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width"> lastname:</Label>
                  <Input id="width" className="col-span-2 h-8" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width"> email:</Label>
                  <Input id="width" className="col-span-2 h-8" />
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width"> assign :</Label>

                  <Select>
                    <SelectTrigger className="w-[230px]">
                      <SelectValue placeholder="filter department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>list of departments</SelectLabel>
                        <SelectItem value="apple">CCIS</SelectItem>
                        <SelectItem value="banana">CET</SelectItem>
                        <SelectItem value="blueberry">CAT</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className=" w-full flex  justify-end p-3  bg">
                  <Button
                    id="maxHeight"
                    defaultValue="none"
                    className="col-span-2 h-8 bg-teal-700 hover:bg-teal-600 "
                  >
                    save changes
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className=" w-full items-start   flex  justify-start gap-5  pt-0 pl-4  py-4">
        <Input
          placeholder="search  users"
          className="  w-48 border  border-teal-700  border-tea-700 "
        />
        <Select>
          <SelectTrigger className="w-[180px]  text-xs">
            <SelectValue placeholder="filter department" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>list of departments</SelectLabel>
              <SelectItem value="ALL">ALL</SelectItem>
              <SelectItem value="CCIS">CCIS</SelectItem>
              <SelectItem value="CET">CET</SelectItem>
              <SelectItem value="CAT">CAT</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableCaption className=" mt-20">A list of Deparment.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className=""> Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Departments</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>

              <TableCell>
                <div className=" flex  gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className=" bg-orange-300">Edit</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            {" "}
                            Add users
                          </h4>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width"> firstname:</Label>
                            <Input id="width" className="col-span-2 h-8" />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width"> lastname:</Label>
                            <Input id="width" className="col-span-2 h-8" />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width"> email:</Label>
                            <Input id="width" className="col-span-2 h-8" />
                          </div>

                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width"> assign:</Label>

                            <Select>
                              <SelectTrigger className="w-[230px]">
                                <SelectValue placeholder="Select a department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>list of departments</SelectLabel>
                                  <SelectItem value="apple">CCIS</SelectItem>
                                  <SelectItem value="banana">CET</SelectItem>
                                  <SelectItem value="blueberry">CAT</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className=" w-full flex  justify-end p-3  bg">
                            <Button
                              id="maxHeight"
                              defaultValue="none"
                              className="col-span-2 h-8 bg-teal-700 hover:bg-teal-600 "
                            >
                              save changes
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className=" bg-red-400">Delete</Button>
                    </PopoverTrigger>
                    <PopoverContent className="  w-56">
                      <div className=" w-full">
                        <Label className=" text-xs">
                          Are you sure you want to delete this department?
                        </Label>
                        <div className=" flex items-center  mt-4   justify-around">
                          <Button size={"sm"}> Cancel</Button>
                          <Button
                            className=" bg-red-400 hover:bg-red-500"
                            size={"sm"}
                          >
                            Confirm
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
