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
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Departments[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers as User[]);
      const fetchedDepartments = await getDepartmentOption();
      setDepartments(fetchedDepartments as Departments[]);
    } catch (error) {
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
      await create(newUser);
      setIsAddOpen(false);
      fetchUsers();
      toast({
        title: "Success",
        description: "User added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (!currentUser) return;
    try {
      const updatedUser = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        userType: currentUser.userType,
        password: "password",
        departmentId: Number(formData.get("departmentId")),
      };
      await update(currentUser.id, updatedUser, "/users");
      setIsEditOpen(false);
      fetchUsers();
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!currentUser) return;
    try {
      await deleteDepartment({ id: currentUser.id }, "/users");
      setIsDeleteOpen(false);
      fetchUsers();
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center px-10 flex-col">
      <div className="w-full items-center flex justify-between p-10 pl-4 mb-20">
        <p className="text-teal-700 font-bold shadow-sm drop-shadow-sm underline-offset-1 underline text-3xl">
          User Management
        </p>
        <AlertDialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <AlertDialogTrigger asChild>
            <Button className="bg-gray-700">Add Users</Button>
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
                        <SelectLabel className=" w-72 text-xs">
                          {departments.length === 0
                            ? "all department assigned user please add another department"
                            : "Departments"}{" "}
                        </SelectLabel>
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
      <div className="w-full items-start flex justify-start gap-5 pt-0 pl-4 py-4">
        <Input
          placeholder="search users"
          className="w-48 border border-teal-700"
        />
        <Select>
          <SelectTrigger className="w-[180px] text-xs">
            <SelectValue placeholder="filter department" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableCaption className="mt-20">A list of Users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.Department?.name}</TableCell>
              <TableCell>
                <div className="flex gap-4">
                  <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-yellow-500"
                        onClick={() => setCurrentUser(user)}
                      >
                        Edit
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-[425px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Edit User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Update user details.
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
                              defaultValue={currentUser?.firstName}
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
                              defaultValue={currentUser?.lastName}
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
                              defaultValue={currentUser?.email}
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
                                currentUser?.departmentId?.toString() || ""
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>
                                    {departments.length === 0
                                      ? "all department assigned user please add another department"
                                      : "Departments"}{" "}
                                  </SelectLabel>
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
                    open={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-red-600"
                        onClick={() => {
                          setCurrentUser(user);
                          setIsDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
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
  );
}
