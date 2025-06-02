"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import type { Id } from "@/convex/_generated/dataModel";

type Order = {
  _id: string;
  _creationTime: number;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: Array<{
    name: string;
    color?: string;
    quantity: number;
    price: number;
    // Add more known properties here if needed, or remove the index signature to avoid 'any'
  }>;
  totalAmount: number;
  status: string;
  deliveryAddress?: string;
};

export function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders = useQuery(api.orders.getAllOrders, {});
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.customerInfo.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customerInfo.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order._id.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async (
    orderId: Id<"orders">,
    newStatus: string
  ) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus });
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  if (!orders) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders by customer name, email, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders?.length || 0})</CardTitle>
          <CardDescription>
            Manage customer orders and update their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders?.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-sm">
                      {order._id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {order.customerInfo.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customerInfo.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell className="font-medium">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order._creationTime), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                setSelectedOrder({
                                  _id: order._id,
                                  _creationTime: order._creationTime,
                                  customerInfo: order.customerInfo,
                                  items: order.items.map(
                                    (item: {
                                      product: { name?: string } | null;
                                      color?: string;
                                      quantity: number;
                                      price: number;
                                    }) => ({
                                      name: item.product?.name || "Unknown",
                                      color: item.color,
                                      quantity: item.quantity,
                                      price: item.price,
                                    })
                                  ),
                                  totalAmount: order.totalAmount,
                                  status: order.status,
                                  deliveryAddress: order.customerInfo.address,
                                })
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            {selectedOrder &&
                              selectedOrder._id === order._id && (
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium">
                                      Customer Information
                                    </h4>
                                    <p>{selectedOrder.customerInfo.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {selectedOrder.customerInfo.email}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {selectedOrder.customerInfo.phone}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">
                                      Delivery Address
                                    </h4>
                                    <p className="text-sm">
                                      {selectedOrder.customerInfo.address ||
                                        selectedOrder.deliveryAddress}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">
                                      Order Items
                                    </h4>
                                    <div className="space-y-2">
                                      {selectedOrder.items.map(
                                        (item: {
                                          name: string;
                                          color?: string;
                                          quantity: number;
                                          price: number;
                                        }, index: number) => (
                                          <div
                                            key={index}
                                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                          >
                                            <div>
                                              <span className="font-medium">
                                                {item.name}
                                              </span>
                                              {item.color && (
                                                <span className="text-sm text-gray-500">
                                                  {" "}
                                                  - {item.color}
                                                </span>
                                              )}
                                              <span className="text-sm text-gray-500">
                                                {" "}
                                                x{item.quantity}
                                              </span>
                                            </div>
                                            <span className="font-medium">
                                              $
                                              {(
                                                item.price * item.quantity
                                              ).toFixed(2)}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t">
                                      <span className="font-medium">Total</span>
                                      <span className="font-bold">
                                        ${selectedOrder.totalAmount.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">
                                      Update Status
                                    </h4>
                                    <Select
                                      value={selectedOrder.status}
                                      onValueChange={(value) =>
                                        handleStatusUpdate(
                                          selectedOrder._id as Id<"orders">,
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">
                                          Pending
                                        </SelectItem>
                                        <SelectItem value="processing">
                                          Processing
                                        </SelectItem>
                                        <SelectItem value="shipped">
                                          Shipped
                                        </SelectItem>
                                        <SelectItem value="delivered">
                                          Delivered
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                          Cancelled
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                          </DialogContent>
                        </Dialog>
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusUpdate(order._id as Id<"orders">, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
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
    </div>
  );
}
