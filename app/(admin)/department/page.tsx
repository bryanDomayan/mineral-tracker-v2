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
import { create as createDept, deleteDepartment, get as getDept, update as updateDept } from "@/actions/department";
import { useToast } from "@/components/ui/use-toast";

export default function DepartmentPage() {

  const {toast} = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDeptId, setCurrentDeptId] = useState<string | null>(null); 
  const [formData, setFormData] = useState({
    name: "",
    information: "",
    logoPath: "",
  });

  const [dialogOpen, setDialogOpen] = useState(false); 
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); 
  const [deptToDelete, setDeptToDelete] = useState<string | null>(null); 

  const fetchData = async () => {
    const data = await getDept();
    console.log(data);
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    toast({
      title: "Successfully edited department",
    });
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
    <div className="flex w-full h-screen items-center justify-center px-10 flex-col">
      <div className="w-full items-center flex justify-between p-10 pl-4 mb-20">
        <p className="text-teal-700 font-bold shadow-sm drop-shadow-sm underline-offset-1 underline text-3xl">
          Department
        </p>
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button className="bg-green-700 hover:bg-green-600" onClick={() => {
              setEditMode(false); 
              setFormData({
                name: "",
                information: "",
                logoPath: "",
              });
              setDialogOpen(true); 
            }}>
              Add Department
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-96">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">{editMode ? "Edit Department" : "Add Department"}</h4>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    onChange={(e) => handleFieldChange(e.target.value, "name")}
                    value={formData.name}
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    onChange={(e) => handleFieldChange(e.target.value, "information")}
                    value={formData.information}
                    className="col-span-2 h-16 overflow-scroll"
                    placeholder="Description of department"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    onChange={(e) => handleFieldChange(e.target.value, "logoPath")}
                    value={formData.logoPath}
                    placeholder="https://image.url"
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="w-full flex justify-end p-3">
                  <Button
                    onClick={editMode ? handleUpdate : handleCreate}
                    disabled={loading}
                    className="h-8 bg-teal-700 hover:bg-teal-600"
                  >
                    {loading ? "Loading..." : editMode ? "Update Department" : "Save Changes"}
                  </Button>
                </div>
                <div className="w-full flex justify-end p-3">
                  <AlertDialogCancel asChild>
                    <Button className="h-8 bg-gray-400 hover:bg-gray-300">Cancel</Button>
                  </AlertDialogCancel>
                </div>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="w-full items-start flex justify-start gap-5 pt-0 pl-4 py-4">
        <Input
          placeholder="Search departments"
          className="w-48 border border-teal-700 text-teal-700"
        />
      </div>
      <Table>
        <TableCaption className="mt-20">A list of Departments.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-end pr-32">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium">{d?.name}</TableCell>
              <TableCell>{d?.information}</TableCell>
              <TableCell>
                <div className="flex gap-4 justify-end">
                  <Button className="bg-teal-700">Manage Users</Button>
                  <Button
                    className="bg-orange-300"
                    onClick={() => handleEdit(d)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-400"
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="w-96">
          <div className="grid gap-4">
            <h4 className="font-medium leading-none">Are you sure you want to delete this department?</h4>
            <div className="flex gap-4 justify-end">
              <AlertDialogAction
                asChild
                onClick={handleDelete}
              >
                <Button className="bg-red-600 hover:bg-red-500">
                  {loading ? "Deleting..." : "Confirm"}
                </Button>
              </AlertDialogAction>
              <AlertDialogCancel asChild>
                <Button className="bg-gray-400 hover:bg-gray-300">Cancel</Button>
              </AlertDialogCancel>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
