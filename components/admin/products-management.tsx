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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, Edit, Trash2, Search, Star } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { ImageUpload } from "./image-upload";
import { toast } from "sonner";

interface ProductForm {
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: string;
  rating: number;
  reviewCount: number;
  colors: string[];
  images: string[];
  specifications: { name: string; value: string }[];
  features: string[];
  care: string[];
  inStock: boolean;
  isNew: boolean;
  isBestseller: boolean;
}

interface ProductFormProps {
  productForm: ProductForm;
  setProductForm: React.Dispatch<React.SetStateAction<ProductForm>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  editingProduct: Id<"products"> | null;
  categories: string[];
}

// Move ProductForm component outside to prevent re-creation on every render
const ProductFormComponent: React.FC<ProductFormProps> = ({
  productForm,
  setProductForm,
  onSubmit,
  onCancel,
  editingProduct,
  categories,
}) => {
  const addSpecification = () => {
    setProductForm({
      ...productForm,
      specifications: [...productForm.specifications, { name: "", value: "" }],
    });
  };

  const updateSpecification = (
    index: number,
    field: "name" | "value",
    value: string
  ) => {
    const newSpecs = [...productForm.specifications];
    newSpecs[index][field] = value;
    setProductForm({ ...productForm, specifications: newSpecs });
  };

  const removeSpecification = (index: number) => {
    const newSpecs = productForm.specifications.filter((_, i) => i !== index);
    setProductForm({ ...productForm, specifications: newSpecs });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 max-h-[80vh] overflow-y-auto"
    >
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={productForm.name}
              onChange={(e) =>
                setProductForm({ ...productForm, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price (UGX) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={productForm.price}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  price: Number.parseFloat(e.target.value) || 0,
                })
              }
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={productForm.category}
            onValueChange={(value) =>
              setProductForm({ ...productForm, category: value })
            }
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="cursor-pointer"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Short Description *</Label>
          <Textarea
            id="description"
            value={productForm.description}
            onChange={(e) =>
              setProductForm({ ...productForm, description: e.target.value })
            }
            rows={2}
            placeholder="Brief product description for listings"
            required
          />
        </div>

        <div>
          <Label htmlFor="longDescription">Detailed Description</Label>
          <Textarea
            id="longDescription"
            value={productForm.longDescription}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                longDescription: e.target.value,
              })
            }
            rows={4}
            placeholder="Detailed product description for product page"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Product Images</h3>
        <ImageUpload
          images={productForm.images}
          onImagesChange={(images) =>
            setProductForm({ ...productForm, images })
          }
          maxImages={5}
        />
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Product Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={productForm.rating}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  rating: Number.parseFloat(e.target.value) || 4.5,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="reviewCount">Review Count</Label>
            <Input
              id="reviewCount"
              type="number"
              min="0"
              value={productForm.reviewCount}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  reviewCount: Number.parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="colors">Available Colors (comma-separated)</Label>
          <Input
            id="colors"
            value={productForm.colors.join(", ")}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                colors: e.target.value.split(", ").filter(Boolean),
              })
            }
            placeholder="Natural, Walnut, Cherry, White"
          />
        </div>

        <div>
          <Label htmlFor="features">Key Features (comma-separated)</Label>
          <Textarea
            id="features"
            value={productForm.features.join(", ")}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                features: e.target.value.split(", ").filter(Boolean),
              })
            }
            placeholder="Solid wood construction, Handcrafted details, Eco-friendly finish"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="care">Care Instructions (comma-separated)</Label>
          <Textarea
            id="care"
            value={productForm.care.join(", ")}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                care: e.target.value.split(", ").filter(Boolean),
              })
            }
            placeholder="Dust regularly with soft cloth, Avoid direct sunlight, Use coasters"
            rows={2}
          />
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Specifications</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSpecification}
            className="cursor-pointer"
          >
            Add Specification
          </Button>
        </div>

        {productForm.specifications.map((spec, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              placeholder="Specification name (e.g., Dimensions)"
              value={spec.name}
              onChange={(e) =>
                updateSpecification(index, "name", e.target.value)
              }
            />
            <Input
              placeholder='Value (e.g., 72" W x 36" D x 30" H)'
              value={spec.value}
              onChange={(e) =>
                updateSpecification(index, "value", e.target.value)
              }
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeSpecification(index)}
              className="cursor-pointer"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* Status Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Status & Visibility</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={productForm.inStock}
              onChange={(e) =>
                setProductForm({ ...productForm, inStock: e.target.checked })
              }
              className="cursor-pointer"
            />
            <span>In Stock</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={productForm.isNew}
              onChange={(e) =>
                setProductForm({ ...productForm, isNew: e.target.checked })
              }
              className="cursor-pointer"
            />
            <span>New Product</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={productForm.isBestseller}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  isBestseller: e.target.checked,
                })
              }
              className="cursor-pointer"
            />
            <span>Bestseller</span>
          </label>
        </div>
      </div>

      {/* Form Actions */}
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
          {editingProduct ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export function ProductsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Id<"products"> | null>(
    null
  );
  const [productForm, setProductForm] = useState<ProductForm>({
    name: "",
    description: "",
    longDescription: "",
    price: 0,
    category: "",
    rating: 4.5,
    reviewCount: 0,
    colors: [],
    images: [],
    specifications: [],
    features: [],
    care: [],
    inStock: true,
    isNew: false,
    isBestseller: false,
  });

  const products = useQuery(api.products.getAllProducts, {});
  const productForEdit = useQuery(
    api.products.getProductForEdit,
    editingProduct ? { productId: editingProduct } : "skip"
  );
  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const deleteProduct = useMutation(api.products.deleteProduct);

  const categoriesData = useQuery(api.categories.getActiveCategories, {});
  const categories = categoriesData?.map((cat) => cat.name) || [];

  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      longDescription: "",
      price: 0,
      category: "",
      rating: 4.5,
      reviewCount: 0,
      colors: [],
      images: [],
      specifications: [],
      features: [],
      care: [],
      inStock: true,
      isNew: false,
      isBestseller: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (productForm.images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct({
          productId: editingProduct,
          ...productForm,
          images: productForm.images as Id<"_storage">[],
        });
        setIsEditDialogOpen(false);
        setEditingProduct(null);
        toast.success("Product updated successfully!");
      } else {
        await createProduct({
          ...productForm,
          images: productForm.images as Id<"_storage">[],
        });
        setIsAddDialogOpen(false);
        toast.success("Product created successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("Failed to save product. Please try again.");
    }
  };

  type ProductType = NonNullable<typeof products>[number];

  const handleEdit = (product: ProductType) => {
    setEditingProduct(product._id);
    setIsEditDialogOpen(true);
  };

  // Update form when productForEdit data is loaded
  React.useEffect(() => {
    if (productForEdit && editingProduct) {
      setProductForm({
        name: productForEdit.name,
        description: productForEdit.description,
        longDescription: productForEdit.longDescription || "",
        price: productForEdit.price,
        category: productForEdit.category,
        rating: productForEdit.rating || 4.5,
        reviewCount: productForEdit.reviewCount || 0,
        colors: productForEdit.colors || [],
        images: productForEdit.images || [], // These are storage IDs from the database
        specifications: productForEdit.specifications || [],
        features: productForEdit.features || [],
        care: productForEdit.care || [],
        inStock: productForEdit.inStock,
        isNew: productForEdit.isNew || false,
        isBestseller: productForEdit.isBestseller || false,
      });
    }
  }, [productForEdit, editingProduct]);

  const handleDelete = async (
    productId: Id<"products">,
    productName: string
  ) => {
    try {
      await deleteProduct({ productId });
      toast.success(`Product "${productName}" deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  if (!products) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48 cursor-pointer">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem
                key={category}
                value={category}
                className="cursor-pointer"
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Create a new product for your furniture store
              </DialogDescription>
            </DialogHeader>
            <ProductFormComponent
              productForm={productForm}
              setProductForm={setProductForm}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              editingProduct={editingProduct}
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts?.length || 0})</CardTitle>
          <CardDescription>Manage your furniture inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts?.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          width={40}
                          height={40}
                          src={
                            product.images?.[0] && product.images[0] !== ""
                              ? product.images[0]
                              : "/placeholder.png"
                          }
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.png";
                          }}
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="flex gap-1">
                            {product.isBestseller && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Bestseller
                              </Badge>
                            )}
                            {product.isNew && (
                              <Badge variant="default" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="font-medium">
                      UGX {product.price.toLocaleString('en-UG')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.inStock ? "default" : "destructive"}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1">
                          {product.rating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
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
                                Delete Product
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {product.name}&quot;? This action cannot be
                                undone and will remove the product from all
                                orders and reviews.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(product._id, product.name)
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          <ProductFormComponent
            productForm={productForm}
            setProductForm={setProductForm}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editingProduct={editingProduct}
            categories={categories}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
