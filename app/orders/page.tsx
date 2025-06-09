"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";

export default function OrdersPage() {
  const { isSignedIn } = useAuth();
  const orders = useQuery(api.orders.getUserOrders, isSignedIn ? {} : "skip");

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

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to view your orders
          </h1>
          <p className="text-gray-600 mb-8">
            Please sign in to access your order history.
          </p>
          <Link href="/sign-in">
            <Button className="bg-amber-800 hover:bg-amber-900">Sign In</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!orders) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
        <Header />
        <div className="container py-20 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
        <Header />
        <div className="container py-20 text-center">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No orders yet
          </h1>
          <p className="text-gray-600 mb-8">
            You haven{"'"}t placed any orders yet. Start shopping to see your
            orders here.
          </p>
          <Link href="/products">
            <Button className="bg-amber-800 hover:bg-amber-900">
              Start Shopping
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      <Header />

      <div className="container py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Placed on{" "}
                      {format(new Date(order.createdAt), "MMMM dd, yyyy")}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2">
                      Items ({order.items.length})
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 bg-gray-50 rounded"
                        >
                          <div className="relative h-12 w-12 flex-shrink-0">
                            <Image
                              src={
                                item.product?.images[0] || "/placeholder.svg"
                              }
                              alt={item.product?.name || "Product"}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {item.product?.name}
                            </p>
                            {item.color && (
                              <p className="text-xs text-gray-500">
                                Color: {item.color}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">
                              UGX{" "}
                              {(item.price * item.quantity).toLocaleString(
                                "en-UG"
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Customer Information</h4>
                      <p className="text-sm text-gray-600">
                        {order.customerInfo.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.customerInfo.email}
                      </p>
                      {order.customerInfo.phone && (
                        <p className="text-sm text-gray-600">
                          {order.customerInfo.phone}
                        </p>
                      )}
                    </div>
                    {order.customerInfo.address && (
                      <div>
                        <h4 className="font-medium mb-1">Delivery Address</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {order.customerInfo.address}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Order Notes */}
                  {order.notes && (
                    <div>
                      <h4 className="font-medium mb-1">Order Notes</h4>
                      <p className="text-sm text-gray-600">{order.notes}</p>
                    </div>
                  )}

                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg text-amber-800">
                      UGX {order.totalAmount.toLocaleString("en-UG")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
