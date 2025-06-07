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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Search,
  Mail,
  Trash2,
  Download,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export function NewsletterManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const subscriptions = useQuery(
    api.newsletter.getAllNewsletterSubscriptions,
    {}
  );
  const stats = useQuery(api.newsletter.getNewsletterStats, {});
  const updateSubscriptionStatus = useMutation(
    api.newsletter.updateSubscriptionStatus
  );
  const deleteSubscription = useMutation(api.newsletter.deleteSubscription);

  const filteredSubscriptions = subscriptions?.filter((subscription) => {
    const matchesSearch =
      subscription.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subscription.name &&
        subscription.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || subscription.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "unsubscribed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (
    subscriptionId: Id<"newsletter">,
    newStatus: string
  ) => {
    try {
      await updateSubscriptionStatus({ subscriptionId, status: newStatus });
      toast.success("Subscription status updated successfully!");
    } catch (error) {
      console.error("Failed to update subscription status:", error);
      toast.error("Failed to update subscription status. Please try again.");
    }
  };

  const handleDelete = async (
    subscriptionId: Id<"newsletter">,
    email: string
  ) => {
    try {
      await deleteSubscription({ subscriptionId });
      toast.success(`Subscription for ${email} deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete subscription:", error);
      toast.error("Failed to delete subscription. Please try again.");
    }
  };

  const exportSubscriptions = () => {
    if (!filteredSubscriptions) return;

    const csvContent = [
      ["Email", "Name", "Status", "Source", "Subscribed Date"],
      ...filteredSubscriptions.map((sub) => [
        sub.email,
        sub.name || "",
        sub.status,
        sub.source || "",
        format(new Date(sub.createdAt), "yyyy-MM-dd HH:mm:ss"),
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscriptions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Newsletter subscriptions exported successfully!");
  };

  if (!subscriptions || !stats) {
    return <div>Loading newsletter data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subscribers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscribers
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent (30 days)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.recent}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.unsubscribed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Source Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Sources</CardTitle>
          <CardDescription>Where subscribers are coming from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.sourceStats).map(([source, count]) => (
              <div
                key={source}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{source}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by email or name..."
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
            <SelectItem value="all" className="cursor-pointer">
              All Subscribers
            </SelectItem>
            <SelectItem value="active" className="cursor-pointer">
              Active
            </SelectItem>
            <SelectItem value="unsubscribed" className="cursor-pointer">
              Unsubscribed
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={exportSubscriptions}
          variant="outline"
          className="cursor-pointer"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Newsletter Subscriptions ({filteredSubscriptions?.length || 0})
          </CardTitle>
          <CardDescription>Manage newsletter subscribers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Subscribed Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions?.map((subscription) => (
                  <TableRow key={subscription._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {subscription.email}
                      </div>
                    </TableCell>
                    <TableCell>{subscription.name || "—"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {subscription.source || "unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(subscription.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Select
                          value={subscription.status}
                          onValueChange={(value) =>
                            handleStatusUpdate(subscription._id, value)
                          }
                        >
                          <SelectTrigger className="w-32 cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="active"
                              className="cursor-pointer"
                            >
                              Active
                            </SelectItem>
                            <SelectItem
                              value="unsubscribed"
                              className="cursor-pointer"
                            >
                              Unsubscribed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Subscription
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the subscription
                                for &quot;
                                {subscription.email}
                                &quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(
                                    subscription._id,
                                    subscription.email
                                  )
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
    </div>
  );
}
