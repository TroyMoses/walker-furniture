"use client";

import React from "react";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { ImageUpload } from "./image-upload";
import { toast } from "sonner";

interface CategoryForm {
  name: string;
  description: string;
  slug: string;
  image: string; // Storage ID
  displayOrder: number;
  isActive: boolean;
}

interface CategoryFormProps {
  categoryForm: CategoryForm;
  setCategoryForm: React.Dispatch<React.SetStateAction<CategoryForm>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  editingCategory: Id<"categories"> | null;
}

const CategoryFormComponent: React.FC<CategoryFormProps> = ({
  categoryForm,
  setCategoryForm,
  onSubmit,
  onCancel,
  editingCategory,
}) => {
  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setCategoryForm({
      ...categoryForm,
      name,
      slug: editingCategory ? categoryForm.slug : generateSlug(name),
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 max-h-[80vh] overflow-y-auto"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Category Information</h3>

        <div>
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            value={categoryForm.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            value={categoryForm.slug}
            onChange={(e) =>
              setCategoryForm({ ...categoryForm, slug: e.target.value })
            }
            placeholder="category-url-slug"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Used in URLs (e.g., /products?category={categoryForm.slug})
          </p>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={categoryForm.description}
            onChange={(e) =>
              setCategoryForm({ ...categoryForm, description: e.target.value })
            }
            rows={3}
            placeholder="Brief description of this category"
            required
          />
        </div>

        <div>
          <Label htmlFor="displayOrder">Display Order</Label>
          <Input
            id="displayOrder"
            type="number"
            min="0"
            value={categoryForm.displayOrder}
            onChange={(e) =>
              setCategoryForm({
                ...categoryForm,
                displayOrder: Number.parseInt(e.target.value) || 0,
              })
            }
          />
          <p className="text-sm text-gray-500 mt-1">
            Lower numbers appear first
          </p>
        </div>

        <div>
          <ImageUpload
            images={categoryForm.image ? [categoryForm.image] : []}
            onImagesChange={(images) =>
              setCategoryForm({ ...categoryForm, image: images[0] || "" })
            }
            maxImages={1}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={categoryForm.isActive}
            onChange={(e) =>
              setCategoryForm({ ...categoryForm, isActive: e.target.checked })
            }
            className="cursor-pointer"
            title="Active (visible on website)"
          />
          <Label htmlFor="isActive">Active (visible on website)</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button type="submit" className="cursor-pointer">
          {editingCategory ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
};

export function CategoriesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Id<"categories"> | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    name: "",
    description: "",
    slug: "",
    image: "",
    displayOrder: 0,
    isActive: true,
  });

  const categories = useQuery(api.categories.getAllCategories, {});
  const categoryForEdit = useQuery(
    api.categories.getCategoryForEdit,
    editingCategory ? { categoryId: editingCategory } : "skip"
  );
  const createCategory = useMutation(api.categories.createCategory);
  const updateCategory = useMutation(api.categories.updateCategory);
  const deleteCategory = useMutation(api.categories.deleteCategory);

  const filteredCategories = categories?.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const resetForm = () => {
    setCategoryForm({
      name: "",
      description: "",
      slug: "",
      image: "",
      displayOrder: 0,
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryForm.image) {
      toast.error("Please upload a category image");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({
          categoryId: editingCategory,
          ...categoryForm,
          image: categoryForm.image as Id<"_storage">,
        });
        setIsEditDialogOpen(false);
        setEditingCategory(null);
        toast.success("Category updated successfully!");
      } else {
        await createCategory({
          ...categoryForm,
          image: categoryForm.image as Id<"_storage">,
        });
        setIsAddDialogOpen(false);
        toast.success("Category created successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save category:", error);
      toast.error("Failed to save category. Please try again.");
    }
  };

  type CategoryType = NonNullable<typeof categories>[number];

  const handleEdit = (category: CategoryType) => {
    setEditingCategory(category._id);
    setIsEditDialogOpen(true);
  };

  // Update form when categoryForEdit data is loaded
  React.useEffect(() => {
    if (categoryForEdit && editingCategory) {
      setCategoryForm({
        name: categoryForEdit.name,
        description: categoryForEdit.description,
        slug: categoryForEdit.slug,
        image: categoryForEdit.image, // This is the storage ID
        displayOrder: categoryForEdit.displayOrder,
        isActive: categoryForEdit.isActive,
      });
    }
  }, [categoryForEdit, editingCategory]);

  const handleDelete = async (
    categoryId: Id<"categories">,
    categoryName: string
  ) => {
    try {
      await deleteCategory({ categoryId });
      toast.success(`Category "${categoryName}" deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error(
        "Failed to delete category. It may have products assigned to it."
      );
    }
  };

  const handleCancel = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingCategory(null);
    resetForm();
  };

  if (!categories) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new product category for your store
              </DialogDescription>
            </DialogHeader>
            <CategoryFormComponent
              categoryForm={categoryForm}
              setCategoryForm={setCategoryForm}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              editingCategory={editingCategory}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories ({filteredCategories?.length || 0})</CardTitle>
          <CardDescription>Manage your product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories?.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          width={40}
                          height={40}
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="h-10 w-10 rounded object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg?height=40&width=40";
                          }}
                        />
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-500">
                            {category.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {category.slug}
                    </TableCell>
                    <TableCell>{category.displayOrder}</TableCell>
                    <TableCell>
                      <Badge
                        variant={category.isActive ? "default" : "secondary"}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Category
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the category
                                &quot;
                                {category.name}&quot;? This action cannot be
                                undone and may affect products assigned to this
                                category.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(category._id, category.name)
                                }
                                className="bg-red-600 hover:bg-red-700 cursor-pointer"
                              >
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
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          <CategoryFormComponent
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editingCategory={editingCategory}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
