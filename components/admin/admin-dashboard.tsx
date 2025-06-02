"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Package,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Plus,
  LayoutDashboard,
  Star,
  Quote,
} from "lucide-react";

import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
import { api } from "@/convex/_generated/api";
import { OrdersManagement } from "./orders-management";
import { ProductsManagement } from "./products-management";
import { ContactsManagement } from "./contacts-management";
import { ReviewsManagement } from "./reviews-management";
import { TestimonialsManagement } from "./testimonials-management";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const orders = useQuery(api.orders.getAllOrders, {});
  const products = useQuery(api.products.getAllProducts, {});
  const contacts = useQuery(api.contacts.getAllContacts, {});

  const pendingOrders =
    orders?.filter((order) => order.status === "pending").length || 0;
  const totalProducts = products?.length || 0;
  const newContacts =
    contacts?.filter((contact) => contact.status === "new").length || 0;
  const totalRevenue =
    orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      <Header />

      <div className="container py-8 px-3 md:px-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your furniture store</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <Quote className="h-4 w-4" />
              <span className="hidden sm:inline">Testimonials</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Orders
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Orders awaiting processing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    Products in catalog
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    New Messages
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{newContacts}</div>
                  <p className="text-xs text-muted-foreground">
                    Unread contact messages
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    From all orders
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders?.slice(0, 5).map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">
                            {order.customerInfo.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.items.length} items • ${order.totalAmount}
                          </p>
                        </div>
                        <Badge
                          variant={
                            order.status === "pending"
                              ? "secondary"
                              : order.status === "processing"
                                ? "default"
                                : order.status === "completed"
                                  ? "default"
                                  : "destructive"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full justify-start gap-2 cursor-pointer"
                    variant="outline"
                    onClick={() => setActiveTab("products")}
                  >
                    <Plus className="h-4 w-4" />
                    Add New Product
                  </Button>
                  <Button
                    className="w-full justify-start gap-2 cursor-pointer"
                    variant="outline"
                    onClick={() => setActiveTab("orders")}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Process Orders
                  </Button>
                  <Button
                    className="w-full justify-start gap-2 cursor-pointer"
                    variant="outline"
                    onClick={() => setActiveTab("contacts")}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Review Messages
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManagement />
          </TabsContent>

          <TabsContent value="products">
            <ProductsManagement />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsManagement />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsManagement />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsManagement />
          </TabsContent>
        </Tabs>
      </div>

      {/* <Footer /> */}
    </div>
  );
}
