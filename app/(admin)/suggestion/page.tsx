"use client";

import { getSuggestion, updateSuggestionStatus } from "@/actions/minerals";
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
import { useEffect, useState } from "react";

export default function Page() {
  // Default export
  const [data, setData] = useState<any>();

  const fetchData = async () => {
    const suggestionData = await getSuggestion();
    setData(suggestionData);
  };

  const handleStatusUpdate = async (id: string, currentStatus: boolean) => {
    // Toggle the approval status
    const newStatus = !currentStatus;
    await updateSuggestionStatus(id, newStatus);
    // Refetch the data after updating the status
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("DATA", data);
  return (
    <>
      <h1 className="text-3xl font-bold text-teal-700 underline underline-offset-2 py-10 px-10">
        Mineral Suggestion
      </h1>{" "}
      <Table>
        <TableCaption>A list of suggestions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Department</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Size in ml</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((suggestion: any) => (
            <TableRow key={suggestion.id}>
              <TableCell>{suggestion.User.Department.name}</TableCell>
              <TableCell>{suggestion.name}</TableCell>
              <TableCell>{suggestion.description}</TableCell>
              <TableCell>{suggestion.brand}</TableCell>
              <TableCell>{suggestion.size}</TableCell>
              <TableCell>
                <Button
                  className={
                    suggestion.approve ? "bg-green-400" : "bg-blue-400"
                  }
                  onClick={() =>
                    handleStatusUpdate(suggestion.id, suggestion.approve)
                  }
                >
                  {suggestion.approve ? "Approved" : "Pending"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

// API function to update the approval status
