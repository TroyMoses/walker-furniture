"use client";

import type React from "react";

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
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Star,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";

// Define the Testimonial type based on usage in this file
interface Testimonial {
  _id: Id<"testimonials">;
  customerName: string;
  customerEmail: string;
  content: string;
  rating: number;
  category: string;
  featured?: boolean;
  status: string;
  _creationTime: string | number | Date;
}

interface TestimonialForm {
  customerName: string;
  customerEmail: string;
  content: string;
  rating: number;
  category: string;
  featured: boolean;
}

interface TestimonialFormProps {
  testimonialForm: TestimonialForm;
  setTestimonialForm: React.Dispatch<React.SetStateAction<TestimonialForm>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  editingTestimonial: Testimonial | null;
  categories: string[];
}

// Move TestimonialForm component outside to prevent re-creation on every render
const TestimonialFormComponent: React.FC<TestimonialFormProps> = ({
  testimonialForm,
  setTestimonialForm,
  onSubmit,
  onCancel,
  editingTestimonial,
  categories,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            value={testimonialForm.customerName}
            onChange={(e) =>
              setTestimonialForm({
                ...testimonialForm,
                customerName: e.target.value,
              })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="customerEmail">Customer Email</Label>
          <Input
            id="customerEmail"
            type="email"
            value={testimonialForm.customerEmail}
            onChange={(e) =>
              setTestimonialForm({
                ...testimonialForm,
                customerEmail: e.target.value,
              })
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Select
            value={testimonialForm.rating.toString()}
            onValueChange={(value) =>
              setTestimonialForm({
                ...testimonialForm,
                rating: Number.parseInt(value),
              })
            }
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5" className="cursor-pointer">5 Stars</SelectItem>
              <SelectItem value="4" className="cursor-pointer">4 Stars</SelectItem>
              <SelectItem value="3" className="cursor-pointer">3 Stars</SelectItem>
              <SelectItem value="2" className="cursor-pointer">2 Stars</SelectItem>
              <SelectItem value="1" className="cursor-pointer">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={testimonialForm.category}
            onValueChange={(value) =>
              setTestimonialForm({ ...testimonialForm, category: value })
            }
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="cursor-pointer">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="content">Testimonial Content</Label>
        <Textarea
          id="content"
          value={testimonialForm.content}
          onChange={(e) =>
            setTestimonialForm({ ...testimonialForm, content: e.target.value })
          }
          rows={4}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={testimonialForm.featured}
          onChange={(e) =>
            setTestimonialForm({
              ...testimonialForm,
              featured: e.target.checked,
            })
          }
          className="cursor-pointer"
          title="Mark as featured testimonial"
        />
        <Label htmlFor="featured">Featured Testimonial</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="cursor-pointer">
          Cancel
        </Button>
        <Button type="submit" className="cursor-pointer">
          {editingTestimonial ? "Update Testimonial" : "Add Testimonial"}
        </Button>
      </div>
    </form>
  );
};

export function TestimonialsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>({
    customerName: "",
    customerEmail: "",
    content: "",
    rating: 5,
    category: "",
    featured: false,
  });

  const testimonials = useQuery(api.testimonials.getAllTestimonials, {});
  const createTestimonial = useMutation(api.testimonials.createTestimonial);
  const updateTestimonial = useMutation(api.testimonials.updateTestimonial);
  const updateTestimonialStatus = useMutation(
    api.testimonials.updateTestimonialStatus
  );
  const deleteTestimonial = useMutation(api.testimonials.deleteTestimonial);

  const categories = [
    "General",
    "Product Quality",
    "Customer Service",
    "Delivery",
    "Design",
  ];

  const filteredTestimonials = testimonials?.filter((testimonial) => {
    const matchesSearch =
      testimonial.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || testimonial.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || testimonial.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const resetForm = () => {
    setTestimonialForm({
      customerName: "",
      customerEmail: "",
      content: "",
      rating: 5,
      category: "",
      featured: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await updateTestimonial({
          testimonialId: editingTestimonial._id,
          ...testimonialForm,
        });
        setIsEditDialogOpen(false);
        setEditingTestimonial(null);
      } else {
        await createTestimonial({
          ...testimonialForm,
          status: "approved", // Admin-created testimonials are auto-approved
        });
        setIsAddDialogOpen(false);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save testimonial:", error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      customerName: testimonial.customerName,
      customerEmail: testimonial.customerEmail,
      content: testimonial.content,
      rating: testimonial.rating,
      category: testimonial.category,
      featured: testimonial.featured || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleStatusUpdate = async (
    testimonialId: Id<"testimonials">,
    newStatus: string
  ) => {
    try {
      await updateTestimonialStatus({ testimonialId, status: newStatus });
    } catch (error) {
      console.error("Failed to update testimonial status:", error);
    }
  };

  const handleDelete = async (testimonialId: Id<"testimonials">) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteTestimonial({ testimonialId });
      } catch (error) {
        console.error("Failed to delete testimonial:", error);
      }
    }
  };

  const handleCancel = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingTestimonial(null);
    resetForm();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  if (!testimonials) {
    return <div>Loading testimonials...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 cursor-pointer">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">All Testimonials</SelectItem>
            <SelectItem value="pending" className="cursor-pointer">Pending</SelectItem>
            <SelectItem value="approved" className="cursor-pointer">Approved</SelectItem>
            <SelectItem value="rejected" className="cursor-pointer">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48 cursor-pointer">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="cursor-pointer">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Testimonial</DialogTitle>
              <DialogDescription>
                Create a new customer testimonial
              </DialogDescription>
            </DialogHeader>
            <TestimonialFormComponent
              testimonialForm={testimonialForm}
              setTestimonialForm={setTestimonialForm}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              editingTestimonial={editingTestimonial}
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Testimonials ({filteredTestimonials?.length || 0})
          </CardTitle>
          <CardDescription>
            Manage customer testimonials and feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTestimonials?.map((testimonial) => (
                  <TableRow key={testimonial._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src={"/placeholder.png"}
                          alt={testimonial.customerName}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">
                            {testimonial.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {testimonial.customerEmail}
                          </div>
                          {testimonial.featured && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm truncate">
                          {testimonial.content}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(testimonial.rating)}
                        <span className="ml-1 text-sm">
                          ({testimonial.rating})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{testimonial.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(testimonial.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(testimonial.status)}
                          {testimonial.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(testimonial._creationTime),
                        "MMM dd, yyyy"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setSelectedTestimonial(testimonial)
                              }
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Testimonial Details</DialogTitle>
                              <DialogDescription>
                                Testimonial by{" "}
                                {selectedTestimonial?.customerName}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedTestimonial && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium">
                                      Customer Information
                                    </h4>
                                    <div className="flex items-center space-x-3 mt-2">
                                      <Image
                                        src={"/placeholder.png"}
                                        alt={selectedTestimonial.customerName}
                                        width={60}
                                        height={60}
                                        className="h-15 w-15 rounded-full object-cover"
                                      />
                                      <div>
                                        <p className="font-medium">
                                          {selectedTestimonial.customerName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {selectedTestimonial.customerEmail}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Details</h4>
                                    <p className="text-sm">
                                      <span className="font-medium">
                                        Category:
                                      </span>{" "}
                                      {selectedTestimonial.category}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                      {renderStars(selectedTestimonial.rating)}
                                      <span className="ml-1">
                                        ({selectedTestimonial.rating}/5)
                                      </span>
                                    </div>
                                    <p className="text-sm mt-1">
                                      <span className="font-medium">Date:</span>{" "}
                                      {format(
                                        new Date(
                                          selectedTestimonial._creationTime
                                        ),
                                        "MMM dd, yyyy"
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium">Testimonial</h4>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="whitespace-pre-wrap">
                                      {selectedTestimonial.content}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Actions</h4>
                                  <div className="flex gap-2">
                                    <Select
                                      value={selectedTestimonial.status}
                                      onValueChange={(value) =>
                                        handleStatusUpdate(
                                          selectedTestimonial._id,
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger className="w-40 cursor-pointer">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending" className="cursor-pointer">
                                          Pending
                                        </SelectItem>
                                        <SelectItem value="approved" className="cursor-pointer">
                                          Approved
                                        </SelectItem>
                                        <SelectItem value="rejected" className="cursor-pointer">
                                          Rejected
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        handleEdit(selectedTestimonial)
                                      }
                                      className="cursor-pointer"
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() =>
                                        handleDelete(selectedTestimonial._id)
                                      }
                                      className="cursor-pointer"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(testimonial)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Select
                          value={testimonial.status}
                          onValueChange={(value) =>
                            handleStatusUpdate(testimonial._id, value)
                          }
                        >
                          <SelectTrigger className="w-32 cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending" className="cursor-pointer">Pending</SelectItem>
                            <SelectItem value="approved" className="cursor-pointer">Approved</SelectItem>
                            <SelectItem value="rejected" className="cursor-pointer">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>
              Update testimonial information
            </DialogDescription>
          </DialogHeader>
          <TestimonialFormComponent
            testimonialForm={testimonialForm}
            setTestimonialForm={setTestimonialForm}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editingTestimonial={editingTestimonial}
            categories={categories}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
