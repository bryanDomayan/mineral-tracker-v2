"use client";

import React, { useEffect, useState } from "react";
import { getDashboardData } from "@/actions/dashboard";

const Dashboard = () => {
  const [dashBoardData, setDashboardData] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const dashboardData = await getDashboardData();
      setDashboardData(dashboardData);
    };

    fetchData();
  }, []);

  console.log("DASHBOARD ", dashBoardData);

  return (
    <div className="container mx-auto  py-10 cursor-pointer">
      <h1 className="text-3xl font-bold text-teal-700 underline underline-offset-2 py-10">
        DASHBOARD
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 m-1">
        {/* Mineral Count */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold">Mineral Count</h2>
          <p className="text-2xl">{dashBoardData?.mineralCount}</p>
        </div>

        {/* User Count */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold">User Count</h2>
          <p className="text-2xl">{dashBoardData?.userCount}</p>
        </div>

        {/* Department Count */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold">Department Count</h2>
          <p className="text-2xl">{dashBoardData?.departmentCount}</p>
        </div>

        {/* Sun Temperature Today */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold">Sun Temperature Today</h2>
          <p className="text-2xl">25.5</p>
        </div>

        {/* Mineral Consume Today */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold">Mineral Consume Today</h2>
          <p className="text-2xl">
            {((dashBoardData?.totalConsumedToday || 0) / 1000).toFixed(4)} m³
            <br />({" "}
            {((dashBoardData?.totalConsumedToday || 0) / 1000).toFixed(4)} L)
          </p>
        </div>

        {/* Total Mineral Consume */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold">Total Mineral Consume</h2>
          <p className="text-2xl">
            {((dashBoardData?.totalConsumedAllTime || 0) / 1000).toFixed(4)} m³
            <br />({" "}
            {((dashBoardData?.totalConsumedAllTime || 0) / 1000).toFixed(4)} L)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
