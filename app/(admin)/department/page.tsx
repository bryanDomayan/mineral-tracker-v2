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
import { useEffect, useState } from "react";
import { create as createDept, get as getDept } from "@/actions/department";

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

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    name: "",
    information: "",
    logoPath: ""
  })

  const fetchData = async () => {
    const data = await getDept()
    console.log(data)
    setData(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFieldChange = (val: string, field: string) => {
    setFormData((prevState) => ({
        ...prevState,
        [field]: val
    }))
  }

  const handleCreate = async () => {
    setLoading(true)
    await createDept(formData)
    setLoading(false)
    fetchData()
  }

  return (
    <div className=" flex  w-full h-screen items-center justify-center px-10 flex-col">
      <div className=" w-full items-center   flex  justify-between p-10 pl-4 mb-20">
        <p className="  text-teal-700  font-bold shadow-sm drop-shadow-sm  underline-offset-1 underline text-3xl">
          Department
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button className=" bg-gray-700">Add Department</Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none"> Add Department</h4>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width"> Name</Label>
                  <Input id="width" onChange={(e) => handleFieldChange(e.target.value, 'name')} value={formData.name} className="col-span-2 h-8" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="maxWidth">Description</Label>
                  <Textarea
                    id="maxWidth"
                    onChange={(e) => handleFieldChange(e.target.value, 'information')} 
                    value={formData.information}
                    className="col-span-2    h-16  overflow-scroll"
                    placeholder=" description of deparment"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="height">Logo url</Label>
                  <Input
                    id="height"
                    onChange={(e) => handleFieldChange(e.target.value, 'logoPath')} 
                    value={formData.logoPath}
                    placeholder=" https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTR3tl0kaO56KpCEWQJeNfk6pgwGKBoEVvXA&s"
                    className="col-span-2 h-8"
                  />
                </div>
                <div className=" w-full flex  justify-end p-3  bg">
                  <Button
                    id="maxHeight"
                    onClick={handleCreate}
                    disabled={loading}
                    defaultValue="none"
                    className="col-span-2 h-8 bg-teal-700 hover:bg-teal-600 "
                  >
                    {loading ? 'loading' : 'save changes'}
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
          className="  w-48 border  border-teal-700 text-teal-700 "
        />
      </div>
      <Table>
        <TableCaption className=" mt-20">A list of Deparment.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className=""> name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead></TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium">{d?.name}</TableCell>
              <TableCell>{d?.information}</TableCell>
              <TableCell></TableCell>

              <TableCell>
                <div className=" flex  gap-4">
                  <Button className=" bg-teal-700">Manage users</Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className=" bg-orange-300">Edit</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            {" "}
                            Add Department
                          </h4>
                          <p className="text-sm text-muted-foreground"></p>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width"> Name</Label>
                            <Input id="width" className="col-span-2 h-8" />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="maxWidth">Description</Label>
                            <Textarea
                              id="maxWidth"
                              className="col-span-2    h-16  overflow-scroll"
                              placeholder=" description of deparment"
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="height">Logo url</Label>
                            <Input
                              id="height"
                              placeholder=" https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTR3tl0kaO56KpCEWQJeNfk6pgwGKBoEVvXA&s"
                              className="col-span-2 h-8"
                            />
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
