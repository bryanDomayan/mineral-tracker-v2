"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Hotel,
  CircleUserRound,
  ChartLine,
  Milk,
  ThermometerSun,
  Box,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const navList = [
    // {
    //     name: 'Statistic',
    //     path: '/statistic',
    //     icon: ChartLine
    // },

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Users,
    },
    {
      name: "Users",
      path: "/users",
      icon: Users,
    },
    {
      name: "Department",
      path: "/department",
      icon: Hotel,
    },
    {
      name: "Minerals",
      path: "/minerals",
      icon: Milk,
    },

    {
      name: "Suggestion",
      path: "/suggestion",
      icon: Box,
    },
    {
      name: "Reports and statistics",
      path: "/reports",
      icon: ThermometerSun,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white fixed top-0 p-4 left-0">
      <div className="bg-teal-800/10 p-2 rounded-lg">
        <h2 className="text-lg tracking-tight capitalize leading-tight font-bold text-gray-600 text-center">
          WATER CONSUMPTION TRACKER
        </h2>
      </div>
      <ul className="my-6">
        {navList.map((d, i) => (
          <li key={i}>
            <Link
              href={d.path}
              className={`flex gap-2 items-center rounded-lg hover:bg-teal-800/10 p-3 px-4 text-gray-600 ${
                pathname == d.path ? "text-teal-500 pointer-events-none" : ""
              }`}
            >
              <d.icon size={20} />
              {d.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="absolute w-full py-2 px-3 bg-teal-700 bottom-0 left-0">
        <div className="flex cursor-pointer hover:bg-teal-600 rounded-lg items-center gap-2 p-1 px-3">
          <CircleUserRound className="text-gray-300" size={30} />
          <div className="">
            <h5 className="-mb-1 text-gray-100">Test Admin</h5>
            <p className="-mt-1 text-gray-300 font-light">user@test.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
