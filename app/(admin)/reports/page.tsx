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
import { PieGraph } from "@/components/Report/PieGraph";
import { PieGraph2 } from "@/components/Report/PieGraph2";
import { Rangepicker } from "@/components/Report/Rangepicker";
import { Bargraph } from "@/components/Report/BarChart";
import { Bargraph2 } from "@/components/Report/BarChart2";

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

export default function DepartmentPage() {
  const [position, setPosition] = useState("bottom");

  return (
    <div className=" w-full h-screen flex flex-col gap-10">
      <div className="w-full  flex px-10 ">
        <div className=" flex  w-3/5  items-start justify-start px-10 flex-col">
          <div className=" w-full items-center   flex  justify-between p-10 pl-4">
            <p className="  text-teal-700  font-bold shadow-sm drop-shadow-sm  underline-offset-1 underline text-3xl">
              Reports and Statistics
            </p>
          </div>

          <div className="  flex  items-center gap-4 mt-6 mb-10">
            <Rangepicker />
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
            <TableCaption className=" mt-20  ">
              <div className=" flex flex-col items-center justify-center gap-4 bg-teal-700 text-white p-6">
                <Label className=" text-sm">
                  Total Consume of all deparments
                </Label>
                <Label className=" text-3xl">2003 Litters</Label>
              </div>
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead className=""> Department</TableHead>
                <TableHead>Description</TableHead>
                <TableHead></TableHead>
                <TableHead>Total Water consume in litters</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className=" flex-1 items-start justify-start  mt-32 ">
          <PieGraph />
          <PieGraph2 />
        </div>
      </div>
      <div className="w-full  flex flex-col gap-10 px-10 ">
        <div className=" flex-1">
          <Bargraph />
        </div>
        <div className=" flex-1">
          <Bargraph2 />
        </div>
      </div>
    </div>
  );
}
