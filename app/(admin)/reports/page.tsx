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
import { LoaderIcon, Settings } from "lucide-react";

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
import { PieGraph } from "@/components/Report/PieGraph";
import { PieGraph2 } from "@/components/Report/PieGraph2";
import { Rangepicker } from "@/components/Report/Rangepicker";
import { Bargraph } from "@/components/Report/BarChart";
import {
  getConsumedAndTemperature,
  getConsumedMinerals,
  getConsumedMineralsByDeparment,
  getPotable,
  getTemperature,
} from "@/actions/reports";
import { log } from "console";
import { Bargraph2 } from "@/components/Report/BarChart2";
import { format } from "date-fns";
import { get } from "@/actions/department";
import { DateRange } from "react-day-picker";
import { addMonths, startOfMonth, endOfMonth } from "date-fns";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { PotableWaterGraph } from "@/components/Report/PotableWaterGraph";

export default function DepartmentPage() {
  const now = new Date();

  const currentMonthStart = startOfMonth(now);
  const nextMonthEnd = endOfMonth(addMonths(now, 1));
  const [position, setPosition] = useState("bottom");
  const [data, setData] = useState<any>();
  const [potable, setPotable] = useState<any>();
  const [temperatureInWeek, setTemperatureInWeek] = useState<any>();
  const [consumedTemperature, setConsumedTemperature] = useState<any>();
  const [department, setDepartment] = useState<any>();
  const [selectDepartmentValue, setSelectDepartmentValue] = useState<any>();
  const [selectDepartmentLabel, setSelectDepartmentLabel] = useState<any>();

  console.log("SELECTED DEPARTMET", selectDepartmentValue);

  const [loading, setLoading] = useState<any>(true);
  const [date, setDate] = useState<DateRange | undefined>({
    from: currentMonthStart,
    to: nextMonthEnd,
  });

  // getConsumedAndTemperature;
  const [consumedMineralsByDepartment, setConsumedMineralsByDepartment] =
    useState<any>();

  const fetchData = async () => {
    const consumed = await getConsumedMinerals(selectDepartmentValue, date);
    const weeklyTemperature = await getTemperature();
    const getConsumedMineralByDepartment = await getConsumedMineralsByDeparment(
      selectDepartmentValue,
      date
    );

    const consumedTemperature = await getConsumedAndTemperature(
      selectDepartmentValue,
      date
    );

    const getPotables = await getPotable();

    const getDepartment = await get();

    setConsumedTemperature(consumedTemperature);
    setPotable(getPotables);
    setData(consumed);
    setTemperatureInWeek(weeklyTemperature);
    setConsumedMineralsByDepartment(getConsumedMineralByDepartment);
    setDepartment(getDepartment);
    setLoading(false);
  };

  const onSelectChange = (value: string | undefined) => {
    if (value === "100000") {
      setSelectDepartmentValue(undefined);
      setSelectDepartmentLabel(undefined);
    } else {
      const selectedDepartment = department.find(
        (data: any) => data.id === value
      );
      if (selectedDepartment) {
        setSelectDepartmentValue(value);
        setSelectDepartmentLabel(selectedDepartment.name);
      }
    }
  };

  console.log("SELETEDLABEL", selectDepartmentValue);
  useEffect(() => {
    fetchData();
  }, [selectDepartmentValue, date]);

  useEffect(() => {
    setDate(undefined);
  }, []);

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    if (data?.combinedConsumption) {
      const combinedConsumptionWS = XLSX.utils.json_to_sheet(
        data.combinedConsumption
      );
      XLSX.utils.book_append_sheet(
        workbook,
        combinedConsumptionWS,
        "Combined Consumption"
      );
    }

    if (consumedMineralsByDepartment) {
      const consumedMineralsWS = XLSX.utils.json_to_sheet(
        consumedMineralsByDepartment
      );
      XLSX.utils.book_append_sheet(
        workbook,
        consumedMineralsWS,
        "Consumed Minerals"
      );
    }

    if (potable) {
      const potableWS = XLSX.utils.json_to_sheet(potable);
      XLSX.utils.book_append_sheet(
        workbook,
        potableWS,
        "Potable Water Records"
      );
    }

    XLSX.writeFile(workbook, "department_data_export.xlsx");
  };

  return (
    <>
      {loading ? (
        <div className=" w-full py-72 flex items-center justify-center">
          <div className=" flex flex-col   items-center justify-center gap-1">
            <LoaderIcon className=" animate-spin   text-teal-700" />
            <p className=" text-teal-700 ml-3 text-xs animate-pulse">
              Loading..
            </p>
          </div>
        </div>
      ) : (
        <div className=" w-full h-screen flex flex-col gap-10">
          <div className="w-full  flex px-10 ">
            <div className=" flex  w-3/5  items-start justify-start px-10 flex-col">
              <div className=" w-full items-center   flex  justify-between p-10 pl-4">
                <p className="  text-teal-700  font-bold shadow-sm drop-shadow-sm  underline-offset-1 underline text-3xl">
                  Reports and Statistics
                </p>
                <Button onClick={exportToExcel} className="ml-4">
                  Export to Excel
                </Button>
              </div>

              <div className="  flex  items-center gap-4 mt-6 mb-10">
                <Rangepicker date={date} setDate={setDate} />
                <Select onValueChange={(e) => onSelectChange(e)}>
                  <SelectTrigger className="w-[180px] text-xs">
                    <SelectValue placeholder="filter department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>list of departments</SelectLabel>
                      <SelectItem value={"100000"}>ALL</SelectItem>
                      {department.map((data: any) => {
                        return (
                          <SelectItem key={data.id} value={data.id}>
                            {data.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <p className=" text-teal-700 font-bold   py-5 pl-3 text-xl  mt-10">
                Total Consume of{" "}
                {selectDepartmentValue ? selectDepartmentLabel : "ALL"}{" "}
                departments
              </p>

              <Table>
                <TableCaption className=" mt-20  ">
                  <div className="flex flex-col items-center justify-center gap-4 bg-teal-700 text-white p-6">
                    <Label className="text-sm">
                      Total Consume of{" "}
                      {selectDepartmentValue ? selectDepartmentLabel : "ALL"}{" "}
                      departments
                    </Label>
                    <Label className="text-3xl">
                      {`${Math.floor(data?.totalConsumedAllDepartments)} L / ${(
                        Math.floor(data?.totalConsumedAllDepartments) * 1000
                      ).toLocaleString()} m³`}
                    </Label>
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
                  {data?.combinedConsumption?.map((data: any) => (
                    <TableRow key={data?.id}>
                      <TableCell className="font-medium">
                        {data?.name}
                      </TableCell>
                      <TableCell>{data?.information}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{data?.totalConsumed}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className=" flex-1 items-start justify-start  mt-32 ">
              <PieGraph temperatureInWeek={temperatureInWeek} />
              <PieGraph2 data={data?.combinedConsumption} />
            </div>
          </div>
          <div className="w-full  flex flex-col gap-10 px-10 ">
            <div className=" flex-1">
              <Bargraph2
                data={{
                  consumedTemperature,
                  departmentLabel: selectDepartmentValue
                    ? selectDepartmentLabel
                    : "ALL",
                }}
              />
            </div>
            <div className=" flex-1">
              <p className=" text-teal-700 font-bold text-xl  mt-14  mb-5 ml-3">
                Total Consume of{" "}
                {selectDepartmentValue ? selectDepartmentLabel : "ALL"}{" "}
              </p>
              <div className="  max-h-[700px] overflow-scroll">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className=""> Department</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead></TableHead>
                      <TableHead>Total Water consume in litters</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consumedMineralsByDepartment?.map((data: any) => (
                      <TableRow key={consumedMineralsByDepartment?.id}>
                        <TableCell className="font-medium">
                          {data?.Department?.name}
                        </TableCell>
                        <TableCell>{data?.Department?.information}</TableCell>
                        <TableCell></TableCell>
                        <TableCell>{data?.totalConsumed}</TableCell>
                        <TableCell>
                          {format(new Date(data?.createdAt), "MMMM dd, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className=" text-teal-700 font-bold   py-5 pl-3 text-xl  mt-10">
                POTABLE WATER RECORDS
              </p>

              <Table className=" w-full">
                <TableCaption className=" mt-20  ">
                  <div className="flex flex-col items-center justify-center gap-4 bg-teal-700 text-white p-6">
                    <Label className="text-sm">
                      Total Consume of{" "}
                      {selectDepartmentValue ? selectDepartmentLabel : "ALL"}{" "}
                      departments
                    </Label>
                    <Label className="text-3xl">
                      {`${Math.floor(data?.totalConsumedAllDepartments)} L / ${(
                        Math.floor(data?.totalConsumedAllDepartments) * 1000
                      ).toLocaleString()} m³`}
                    </Label>
                  </div>
                </TableCaption>

                <TableHeader>
                  <TableRow>
                    <TableHead className=""> Date</TableHead>
                    <TableHead className=""> Department</TableHead>
                    <TableHead>Cubic Consume</TableHead>
                    <TableHead></TableHead>
                    <TableHead>Bill</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {potable?.map((data: any) => (
                    <TableRow key={data?.id}>
                      <TableCell>
                        {data?.date
                          ? dayjs(data.date).format("MM/DD/YYYY")
                          : ""}
                      </TableCell>
                      <TableCell className="font-medium">
                        {data?.Department?.name}
                      </TableCell>
                      <TableCell>{data?.cubicConsumed}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{data?.bill}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className=" w-full">
                <PotableWaterGraph data={potable} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
