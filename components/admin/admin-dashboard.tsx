"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrdersManagement } from "./orders-management";
import { ProductsManagement } from "./products-management";
import { CategoriesManagement } from "./categories-management";
import { ContactsManagement } from "./contacts-management";
import { ReviewsManagement } from "./reviews-management";
import { TestimonialsManagement } from "./testimonials-management";
import { NewsletterManagement } from "./newsletter-management";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  MessageSquare,
  Star,
  Quote,
  Mail,
  Users,
  DollarSign,
  ChartBarStacked,
} from "lucide-react";
import { Footer } from "../footer";
import { Header } from "../header";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch overview data
  const orders = useQuery(api.orders.getAllOrders, { limit: 5 });
  const products = useQuery(api.products.getAllProducts, {});
  const contacts = useQuery(api.contacts.getAllContacts, { limit: 5 });
  const newsletterStats = useQuery(api.newsletter.getNewsletterStats, {});

  // Calculate some basic stats
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;
  // const totalContacts = contacts?.length || 0;
  const totalRevenue =
    orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

  return (
    <div>
      <Header />

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage your Exit Walker Furniture business
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Quote className="h-4 w-4" />
              <span className="hidden sm:inline">Testimonials</span>
            </TabsTrigger>
            <TabsTrigger
              value="newsletter"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Newsletter</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="cursor-pointer">
              <ChartBarStacked className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    From {totalOrders} orders
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Orders
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    All time orders
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    Active products
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Newsletter Subscribers
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {newsletterStats?.active || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active subscribers
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            {order.customerInfo.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.totalAmount}</p>
                          <Badge
                            variant={
                              order.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Contacts</CardTitle>
                  <CardDescription>Latest customer inquiries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contacts?.slice(0, 5).map((contact) => (
                      <div
                        key={contact._id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-48">
                            {contact.subject}
                          </p>
                        </div>
                        <Badge
                          variant={
                            contact.status === "new"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {contact.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
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

          <TabsContent value="newsletter">
            <NewsletterManagement />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesManagement />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
