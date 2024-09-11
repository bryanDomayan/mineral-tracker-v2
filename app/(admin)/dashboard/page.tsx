import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const page = () => {
  return (
    <div className="flex w-full  flex-col h-screen items-start justify-center p-36 ">
      <div className=" w-full items-start   flex  justify-between p-10  pt-0 pl-4 mb-20">
        <p className="  text-teal-700  font-bold shadow-sm drop-shadow-sm  underline-offset-1 underline text-3xl">
          Dashboard
        </p>
      </div>
      <div className="grid grid-cols-2 gap-20 w-full h-full">
        <Card className=" shadow-sm drop-shadow-sm cursor-pointer  border-[#f1986b] border-4  bg-teal-900 flex flex-col items-center justify-center gap-4 w-full h-full">
          <Label className=" cursor-pointer tracking-widest text-white font-extrabold text-2xl">
            Users
          </Label>
          <Label className=" cursor-pointer  tracking-widest text-orange-600 font-extrabold text-2xl">
            21
          </Label>
        </Card>
        <Card className=" shadow-sm drop-shadow-sm cursor-pointer  border-[#f1986b] border-4  bg-teal-600 flex flex-col items-center justify-center gap-4 w-full h-full">
          <Label className=" cursor-pointer tracking-widest text-white font-extrabold text-2xl">
            Department
          </Label>
          <Label className=" cursor-pointer tracking-widest text-orange-600 font-extrabold text-2xl">
            21
          </Label>
        </Card>
        <Card className=" shadow-sm drop-shadow-sm cursor-pointer  border-[#f1986b] border-4  bg-teal-700 flex flex-col items-center justify-center gap-4 w-full h-full">
          <Label className=" cursor-pointer  tracking-widest text-white font-extrabold text-2xl">
            Minerals
          </Label>
          <Label className=" cursor-pointer  tracking-widest text-orange-600 font-extrabold text-2xl">
            21
          </Label>
        </Card>{" "}
        <Card className=" shadow-sm drop-shadow-sm cursor-pointer  border-[#f1986b] border-4  bg-teal-800 flex flex-col items-center justify-center gap-4 w-full h-full">
          <Label className=" cursor-pointer tracking-widest text-white font-extrabold text-2xl">
            Temperature Today
          </Label>
          <Label className=" cursor-pointer tracking-widest  text-orange-600 font-extrabold text-2xl">
            59 °C
          </Label>
        </Card>
      </div>
    </div>
  );
};

export default page;
