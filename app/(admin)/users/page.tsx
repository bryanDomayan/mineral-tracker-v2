"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import {
  getUsers,
  create,
  update,
  deleteDepartment,
  getDepartmentOption,
} from "@/actions/users";
import { useToast } from "@/components/ui/use-toast";
import { Departments } from "@prisma/client";

enum UserType {
  ADMIN = "ADMIN",
  USER = "USER",
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
  departmentId?: number;
  Department?: {
    name: string;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<Departments[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [id, setId] = useState<boolean>(false);

  const { toast } = useToast();

  console.log("EDIT USER ID ", editUserId);
  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers as User[]);
      setFilteredUsers(fetchedUsers as User[]);
      const fetchedDepartments = await getDepartmentOption();
      setDepartments(fetchedDepartments as Departments[]);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = users.filter((user) =>
      Object.values(user).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(lowercasedFilter)
      )
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleAdd = async (formData: FormData) => {
    try {
      const newUser = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        userType: UserType.USER,
        password: "password",
        departmentId: Number(formData.get("departmentId")),
      };

      const addedUser = await create(newUser);
      setUsers((prev) => [...prev, addedUser]);
      setFilteredUsers((prev) => [...prev, addedUser]);
      setIsAddOpen(false);
      toast({
        title: "Success",
        description: "User added successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (formData: FormData) => {
    console.log("HEHEHE", editUserId);

    if (editUserId === null) return;

    try {
      const updatedUser = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        userType:
          users.find((u) => u.id === editUserId)?.userType || UserType.USER,
        password: "password",
        departmentId: Number(formData.get("departmentId")),
      };
      await update(editUserId, updatedUser, "/users");
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editUserId ? { ...user, ...updatedUser } : user
        )
      );
      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.id === editUserId ? { ...user, ...updatedUser } : user
        )
      );
      setEditUserId(null);
      setId(true);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (deleteUserId === null) return;
    try {
      await deleteDepartment({ id: deleteUserId }, "/users");
      setUsers((prev) => prev.filter((user) => user.id !== deleteUserId));
      setFilteredUsers((prev) =>
        prev.filter((user) => user.id !== deleteUserId)
      );
      setDeleteUserId(null);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-teal-700 underline underline-offset-2">
            User Management
          </h1>
          <AlertDialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <AlertDialogTrigger asChild>
              <Button className="bg-gray-700">Add User</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px]">
              <AlertDialogHeader>
                <AlertDialogTitle>Add User</AlertDialogTitle>
                <AlertDialogDescription>
                  Fill in the details to add a new user.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdd(new FormData(e.currentTarget));
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastName" className="text-right">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="departmentId" className="text-right">
                      Department
                    </Label>
                    <Select name="departmentId" defaultValue="">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Departments</SelectLabel>
                          {departments.map((dept) => (
                            <SelectItem
                              key={dept.id}
                              value={dept.id.toString()}
                            >
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction type="submit">Add User</AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="w-full">
          <Input
            placeholder="Search users"
            className="w-full sm:w-64 border border-teal-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableCaption>A list of users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>User Type</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.userType}</TableCell>
                <TableCell>{user.Department?.name || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <AlertDialog
                      open={editUserId === user.id}
                      onOpenChange={(open) => !open && id}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          className="bg-blue-700"
                          onClick={() => setEditUserId(user.id)}
                        >
                          Edit
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="sm:max-w-[425px]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Edit User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Update user information.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleEdit(new FormData(e.currentTarget));
                          }}
                        >
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="firstName" className="text-right">
                                First Name
                              </Label>
                              <Input
                                id="firstName"
                                name="firstName"
                                defaultValue={user.firstName}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="lastName" className="text-right">
                                Last Name
                              </Label>
                              <Input
                                id="lastName"
                                name="lastName"
                                defaultValue={user.lastName}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="email" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={user.email}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="departmentId"
                                className="text-right"
                              >
                                Department
                              </Label>
                              <Select
                                name="departmentId"
                                defaultValue={
                                  user.departmentId?.toString() || ""
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Departments</SelectLabel>
                                    {departments.map((dept) => (
                                      <SelectItem
                                        key={dept.id}
                                        value={dept.id.toString()}
                                      >
                                        {dept.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction type="submit">
                              Update User
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </form>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog
                      open={deleteUserId === user.id}
                      onOpenChange={(open) => !open && setDeleteUserId(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          className="bg-red-700"
                          onClick={() => setDeleteUserId(user.id)}
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the user and remove their data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
