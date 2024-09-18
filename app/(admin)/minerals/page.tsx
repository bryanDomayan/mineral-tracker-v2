"use client";
import { useEffect, useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { getMineral, create, update, deleteDepartment } from "@/actions/minerals";
import { displaySize } from "@/utils/string";

// Types
interface Mineral {
  id: number;
  name: string;
  brand?: string;
  description?: string;
  size?: string;
}

export default function MineralsPage() {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentMineralId, setCurrentMineralId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Mineral, "id">>({
    name: "",
    brand: "",
    description: "",
    size: "",
  });
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [mineralToDelete, setMineralToDelete] = useState<number | null>(null);

  const fetchData = async () => {
    const minerals = await getMineral();
    setData(minerals);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFieldChange = (val: string, field: keyof Omit<Mineral, "id">) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: val,
    }));
  };

  const handleCreate = async () => {
    setLoading(true);
    await create(formData);
    setLoading(false);
    setDialogOpen(false);
    fetchData();
    toast({
      title: "Successfully added new mineral",
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    if (currentMineralId !== null) {
      await update(currentMineralId, formData);
    }
    setLoading(false);
    setEditMode(false);
    setCurrentMineralId(null);
    setDialogOpen(false);
    fetchData();
    toast({
      title: "Successfully updated mineral",
    });
  };

  const handleDelete = async () => {
    if (mineralToDelete !== null) {
      setLoading(true);
      await deleteDepartment({ id: mineralToDelete });
      setLoading(false);
      setDeleteDialogOpen(false);
      fetchData();
      toast({
        title: "Successfully deleted mineral",
      });
    }
  };

  return (
    <div className="flex w-full h-screen items-start justify-start px-10 flex-col">
      <div className="w-full items-center flex justify-between p-10 pl-4 mb-20">
        <p className="text-teal-700 font-bold shadow-sm drop-shadow-sm underline-offset-1 underline text-3xl">
          Minerals
        </p>
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              className="bg-green-700 hover:bg-green-600"
              onClick={() => {
                setEditMode(false);
                setFormData({
                  name: "",
                  brand: "",
                  description: "",
                  size: "",
                });
                setDialogOpen(true);
              }}
            >
              Add Mineral
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-96">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">{editMode ? "Edit Mineral" : "Add Mineral"}</h4>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="name">Name:</Label>
                  <Input
                    id="name"
                    onChange={(e) => handleFieldChange(e.target.value, "name")}
                    value={formData.name}
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="brand">Brand:</Label>
                  <Input
                    id="brand"
                    onChange={(e) => handleFieldChange(e.target.value, "brand")}
                    value={formData.brand || ""}
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="description">Description:</Label>
                  <Textarea
                    id="description"
                    onChange={(e) => handleFieldChange(e.target.value, "description")}
                    value={formData.description || ""}
                    className="col-span-2 h-16 overflow-scroll"
                    placeholder="Description of mineral"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="size">Size:</Label>
                  <Input
                    id="size"
                    type="number"
                    onChange={(e) => handleFieldChange(e.target.value, "size")}
                    value={formData.size || ""}
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="w-full flex justify-end p-3">
                  <Button
                    onClick={editMode ? handleUpdate : handleCreate}
                    disabled={loading}
                    className="h-8 bg-teal-700 hover:bg-teal-600"
                  >
                    {loading ? "Loading..." : editMode ? "Update Mineral" : "Save Changes"}
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
          placeholder="Search minerals"
          className="w-48 border border-teal-700 text-teal-700"
        />
      </div>
      <Table>
        <TableCaption className="mt-20">A list of minerals.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-end pr-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((mineral) => (
            <TableRow key={mineral.id}>
              <TableCell className="font-medium">{mineral.name}</TableCell>
              <TableCell>{mineral.brand}</TableCell>
              <TableCell>{mineral.description}</TableCell>
              <TableCell>{displaySize(mineral.size)}</TableCell>
              <TableCell>
                <div className="flex gap-4">
                  <AlertDialog open={editMode && currentMineralId === mineral.id} onOpenChange={(open) => {
                    if (!open) {
                      setEditMode(false);
                      setCurrentMineralId(null);
                    }
                  }}>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-orange-300"
                        onClick={() => {
                          setEditMode(true);
                          setCurrentMineralId(mineral.id);
                          setFormData({
                            name: mineral.name,
                            brand: mineral.brand || "",
                            description: mineral.description || "",
                            size: mineral.size || "",
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-96">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Edit Mineral</h4>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="edit-name">Name:</Label>
                            <Input
                              id="edit-name"
                              onChange={(e) => handleFieldChange(e.target.value, "name")}
                              value={formData.name}
                              className="col-span-2 h-8"
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="edit-brand">Brand:</Label>
                            <Input
                              id="edit-brand"
                              onChange={(e) => handleFieldChange(e.target.value, "brand")}
                              value={formData.brand || ""}
                              className="col-span-2 h-8"
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="edit-description">Description:</Label>
                            <Textarea
                              id="edit-description"
                              onChange={(e) => handleFieldChange(e.target.value, "description")}
                              value={formData.description || ""}
                              className="col-span-2 h-16 overflow-scroll"
                              placeholder="Description of mineral"
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="edit-size">Size:</Label>
                            <Input
                              id="edit-size"
                              type="number"
                              onChange={(e) => handleFieldChange(e.target.value, "size")}
                              value={formData.size || ""}
                              className="col-span-2 h-8"
                            />
                          </div>
                          <div className="w-full flex justify-end p-3">
                            <Button
                              onClick={handleUpdate}
                              disabled={loading}
                              className="h-8 bg-teal-700 hover:bg-teal-600"
                            >
                              {loading ? "Loading..." : "Update Mineral"}
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
                  <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-red-700 hover:bg-red-600"
                        onClick={() => {
                          setDeleteDialogOpen(true);
                          setMineralToDelete(mineral.id);
                        }}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-96">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Confirm Deletion</h4>
                        </div>
                        <div className="grid gap-2">
                          <p>Are you sure you want to delete this mineral?</p>
                          <div className="w-full flex justify-end p-3">
                            <AlertDialogAction
                              onClick={handleDelete}
                              disabled={loading}
                              className="h-8 bg-red-700 hover:bg-red-600"
                            >
                              {loading ? "Loading..." : "Delete"}
                            </AlertDialogAction>
                            <AlertDialogCancel asChild>
                              <Button className="h-8 bg-gray-400 hover:bg-gray-300">Cancel</Button>
                            </AlertDialogCancel>
                          </div>
                        </div>
                      </div>
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
