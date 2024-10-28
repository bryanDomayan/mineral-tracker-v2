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
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import {
  create as createDept,
  deleteDepartment,
  get as getDept,
  update as updateDept,
} from "@/actions/department";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function DepartmentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDeptId, setCurrentDeptId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    information: "",
    logoPath: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<string | null>(null);

  const fetchData = async () => {
    const fetchedData = await getDept();
    setData(fetchedData);
    setFilteredData(fetchedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(lowercasedFilter)
      )
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleFieldChange = (val: string, field: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: val,
    }));
  };

  const handleCreate = async () => {
    setLoading(true);
    await createDept(formData);
    setLoading(false);
    setDialogOpen(false);
    fetchData();
    toast({
      title: "Successfully added new department",
    });
  };

  const handleDelete = async () => {
    if (deptToDelete) {
      setLoading(true);
      await deleteDepartment({ id: parseInt(deptToDelete) });
      setLoading(false);
      setDeleteDialogOpen(false);
      fetchData();
      toast({
        title: "Successfully deleted department",
      });
    }
  };

  const handleEdit = (department: any) => {
    setEditMode(true);
    setCurrentDeptId(department.id);
    setFormData({
      name: department.name,
      information: department.information,
      logoPath: department.logoPath,
    });
    setDialogOpen(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    if (currentDeptId) {
      await updateDept(parseInt(currentDeptId), formData);
    }
    setLoading(false);
    setEditMode(false);
    setCurrentDeptId(null);
    setDialogOpen(false);
    fetchData();
  };

  return (
    <div className="flex w-full min-h-screen items-start justify-start px-4 py-8 sm:px-6 lg:px-14 flex-col  ">
      <div className="w-full max-w-4x  flex justify-between mb-6  p-4 flex-col sm:flex-row">
        <h1 className="text-3xl font-bold text-teal-700 underline underline-offset-2 mb-4 sm:mb-0">
          Department
        </h1>
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              className="bg-green-700 hover:bg-green-600 w-full sm:w-auto"
              onClick={() => {
                setEditMode(false);
                setFormData({
                  name: "",
                  information: "",
                  logoPath: "",
                });
                setDialogOpen(true);
              }}
            >
              Add Department
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-[425px]">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">
                  {editMode ? "Edit Department" : "Add Department"}
                </h4>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    onChange={(e) => handleFieldChange(e.target.value, "name")}
                    value={formData.name}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    onChange={(e) =>
                      handleFieldChange(e.target.value, "information")
                    }
                    value={formData.information}
                    className="col-span-3"
                    placeholder="Description of department"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="logo" className="text-right">
                    Logo URL
                  </Label>
                  <Input
                    id="logo"
                    onChange={(e) =>
                      handleFieldChange(e.target.value, "logoPath")
                    }
                    value={formData.logoPath}
                    placeholder="https://image.url"
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <AlertDialogCancel asChild>
                  <Button variant="outline">Cancel</Button>
                </AlertDialogCancel>
                <Button
                  onClick={editMode ? handleUpdate : handleCreate}
                  disabled={loading}
                  className="bg-teal-700 hover:bg-teal-600"
                >
                  {loading
                    ? "Loading..."
                    : editMode
                    ? "Update Department"
                    : "Save Changes"}
                </Button>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="w-full max-w-4xl mb-4  px-4 sm:px-0">
        <Input
          placeholder="Search departments"
          className="w-full sm:w-64 border border-teal-700 text-teal-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto w-full">
        <Table className="w-full max-w-4xl">
          <TableCaption>A list of Departments.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d?.name}</TableCell>
                <TableCell>{d?.information}</TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end flex-wrap">
                    <Button
                      className="bg-teal-700 w-full sm:w-auto"
                      onClick={() => router.push(`/department/${d.id}`)}
                    >
                      Manage Minerals
                    </Button>
                    <Button
                      className="bg-orange-300 w-full sm:w-auto"
                      onClick={() => handleEdit(d)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="bg-red-400 w-full sm:w-auto"
                      onClick={() => {
                        setDeptToDelete(d.id.toString());
                        setDeleteDialogOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <h1>Delete Department?</h1>
          <p>Are you sure you want to delete this department?</p>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                className="bg-red-400 hover:bg-red-500"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
