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
import {
  getMineral,
  create,
  update,
  deleteDepartment,
} from "@/actions/minerals";
import { displaySize } from "@/utils/string";
import { Image, ImageOff } from "lucide-react";

// Updated Types
interface Mineral {
  id: number;
  name: string;
  brand: string | null;
  description: string | null;
  size: string | null;
  image: string | null;
  createdAt: Date;
  userId: number | null;
}

export default function MineralsPage() {
  const { toast } = useToast();
  const [data, setData] = useState<Mineral[]>([]);
  const [filteredData, setFilteredData] = useState<Mineral[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentMineralId, setCurrentMineralId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({
    name: "",
    brand: null,
    description: null,
    size: null,
    image: null,
  });
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [mineralToDelete, setMineralToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchData = async () => {
    const minerals = await getMineral();
    setData(minerals);
    setFilteredData(minerals);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((mineral) =>
      Object.values(mineral).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(lowercasedFilter)
      )
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleFieldChange = (
    val: string | File | null,
    field: keyof Omit<Mineral, "id" | "createdAt" | "userId">
  ) => {
    if (field === "image" && val instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevState: any) => ({
          ...prevState,
          [field]: reader.result as string,
        }));
      };
      reader.readAsDataURL(val);
    } else {
      setFormData((prevState: any) => ({
        ...prevState,
        [field]: val,
      }));
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      await create(formData);
      setDialogOpen(false);
      fetchData();
      toast({
        title: "Successfully added new mineral",
      });
    } catch (error) {
      console.error("Error creating mineral:", error);
      toast({
        title: "Error adding mineral",
        description: "An error occurred while adding the mineral.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    if (currentMineralId !== null) {
      try {
        await update(currentMineralId, formData);
        setEditMode(false);
        setCurrentMineralId(null);
        setDialogOpen(false);
        fetchData();
        toast({
          title: "Successfully updated mineral",
        });
      } catch (error) {
        console.error("Error updating mineral:", error);
        toast({
          title: "Error updating mineral",
          description: "An error occurred while updating the mineral.",
          variant: "destructive",
        });
      }
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (mineralToDelete !== null) {
      setLoading(true);
      try {
        await deleteDepartment({ id: mineralToDelete });
        setDeleteDialogOpen(false);
        fetchData();
        toast({
          title: "Successfully deleted mineral",
        });
      } catch (error) {
        console.error("Error deleting mineral:", error);
        toast({
          title: "Error deleting mineral",
          description: "An error occurred while deleting the mineral.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen items-start justify-start px-4 py-8 sm:px-6 lg:px-8 flex-col">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-teal-700 underline underline-offset-2">
            Minerals
          </h1>
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                className="bg-green-700 hover:bg-green-600"
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    name: "",
                    brand: null,
                    description: null,
                    size: null,
                    image: null,
                  });
                  setDialogOpen(true);
                }}
              >
                Add Mineral
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[625px]">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">
                    {editMode ? "Edit Mineral" : "Add Mineral"}
                  </h4>
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">
                      Image:
                    </Label>
                    <Input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={(e) =>
                        handleFieldChange(e.target.files?.[0] || null, "image")
                      }
                      className="col-span-3"
                    />
                  </div>
                  {formData.image && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="col-start-2 col-span-3">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="max-w-full h-auto max-h-40 object-contain"
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name:
                    </Label>
                    <Input
                      id="name"
                      onChange={(e) =>
                        handleFieldChange(e.target.value, "name")
                      }
                      value={formData.name}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="brand" className="text-right">
                      Brand:
                    </Label>
                    <Input
                      id="brand"
                      onChange={(e) =>
                        handleFieldChange(e.target.value, "brand")
                      }
                      value={formData.brand || ""}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description:
                    </Label>
                    <Textarea
                      id="description"
                      onChange={(e) =>
                        handleFieldChange(e.target.value, "description")
                      }
                      value={formData.description || ""}
                      className="col-span-3"
                      placeholder="Description of mineral"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="size" className="text-right">
                      Size:
                    </Label>
                    <Input
                      id="size"
                      onChange={(e) =>
                        handleFieldChange(e.target.value, "size")
                      }
                      value={formData.size || ""}
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
                      ? "Update Mineral"
                      : "Save Changes"}
                  </Button>
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search minerals"
            className="w-full sm:w-64 border border-teal-700 text-teal-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableCaption>A list of minerals.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((mineral) => (
              <TableRow key={mineral.id}>
                <TableCell>
                  {mineral.image ? (
                    <img
                      src={mineral.image}
                      alt={mineral.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <ImageOff className="w-10 h-10 text-gray-300" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{mineral.name}</TableCell>
                <TableCell>{mineral.brand}</TableCell>
                <TableCell>{mineral.description}</TableCell>
                <TableCell>{displaySize(mineral.size as any)}</TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <AlertDialog
                      open={editMode && currentMineralId === mineral.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setEditMode(false);
                          setCurrentMineralId(null);
                        }
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          className="bg-orange-300"
                          onClick={() => {
                            setEditMode(true);
                            setCurrentMineralId(mineral.id);
                            setFormData({
                              name: mineral.name,
                              brand: mineral.brand,
                              description: mineral.description,
                              size: mineral.size,
                              image: mineral.image,
                            });
                          }}
                        >
                          Edit
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="sm:max-w-[425px]">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Edit Mineral
                            </h4>
                          </div>
                          <div className="grid gap-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit-image"
                                className="text-right"
                              >
                                Image:
                              </Label>
                              <Input
                                type="file"
                                id="edit-image"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFieldChange(
                                    e.target.files?.[0] || null,
                                    "image"
                                  )
                                }
                                className="col-span-3"
                              />
                            </div>
                            {formData.image && (
                              <div className="grid grid-cols-4 items-center gap-4">
                                <div className="col-start-2 col-span-3">
                                  <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="max-w-full h-auto max-h-40 object-contain"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Name:
                              </Label>
                              <Input
                                id="edit-name"
                                onChange={(e) =>
                                  handleFieldChange(e.target.value, "name")
                                }
                                value={formData.name}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit-brand"
                                className="text-right"
                              >
                                Brand:
                              </Label>
                              <Input
                                id="edit-brand"
                                onChange={(e) =>
                                  handleFieldChange(e.target.value, "brand")
                                }
                                value={formData.brand || ""}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit-description"
                                className="text-right"
                              >
                                Description:
                              </Label>
                              <Textarea
                                id="edit-description"
                                onChange={(e) =>
                                  handleFieldChange(
                                    e.target.value,
                                    "description"
                                  )
                                }
                                value={formData.description || ""}
                                className="col-span-3"
                                placeholder="Description of mineral"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-size" className="text-right">
                                Size:
                              </Label>
                              <Input
                                id="edit-size"
                                onChange={(e) =>
                                  handleFieldChange(e.target.value, "size")
                                }
                                value={formData.size || ""}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <AlertDialogCancel asChild>
                              <Button variant="outline">Cancel</Button>
                            </AlertDialogCancel>
                            <Button
                              onClick={handleUpdate}
                              disabled={loading}
                              className="bg-teal-700 hover:bg-teal-600"
                            >
                              {loading ? "Loading..." : "Update Mineral"}
                            </Button>
                          </div>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog
                      open={deleteDialogOpen}
                      onOpenChange={setDeleteDialogOpen}
                    >
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
                      <AlertDialogContent className="sm:max-w-[425px]">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Confirm Deletion
                            </h4>
                          </div>
                          <p>Are you sure you want to delete this mineral?</p>
                          <div className="flex justify-end space-x-2">
                            <AlertDialogCancel asChild>
                              <Button variant="outline">Cancel</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              disabled={loading}
                              className="bg-red-700 hover:bg-red-600"
                            >
                              {loading ? "Loading..." : "Delete"}
                            </AlertDialogAction>
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
    </div>
  );
}
