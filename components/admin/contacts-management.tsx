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
  Mail,
  Phone,
  MessageSquare,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import type { Id } from "@/convex/_generated/dataModel";

export function ContactsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  type Contact = {
    _id: Id<"contacts">;
    _creationTime: number;
    phone?: string;
    name: string;
    email: string;
    createdAt: number;
    status: string;
    subject: string;
    message: string;
  };
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const contacts = useQuery(api.contacts.getAllContacts, {});
  const updateContactStatus = useMutation(api.contacts.updateContactStatus);

  const filteredContacts = contacts?.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async (
    contactId: Id<"contacts">,
    newStatus: string
  ) => {
    try {
      await updateContactStatus({ contactId, status: newStatus });
    } catch (error) {
      console.error("Failed to update contact status:", error);
    }
  };

  if (!contacts) {
    return <div>Loading contacts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search contacts by name, email, or subject..."
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
            <SelectItem value="all">All Contacts</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Contact Messages ({filteredContacts?.length || 0})
          </CardTitle>
          <CardDescription>
            Manage customer inquiries and feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts?.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">
                          {contact.subject}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {contact.message}
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <Badge variant="outline">{contact.type}</Badge>
                    </TableCell> */}
                    <TableCell>
                      <Badge className={getStatusColor(contact.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(contact.status)}
                          {contact.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(contact._creationTime), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setSelectedContact({
                                  ...contact,
                                })
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Contact Details</DialogTitle>
                              <DialogDescription>
                                Message from {selectedContact?.name}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedContact && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium">
                                      Customer Information
                                    </h4>
                                    <p>{selectedContact.name}</p>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {selectedContact.email}
                                    </p>
                                    {selectedContact.phone && (
                                      <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {selectedContact.phone}
                                      </p>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">
                                      Message Details
                                    </h4>
                                    {/* <p className="text-sm">
                                      <span className="font-medium">Type:</span>{" "}
                                      {selectedContact.type}
                                    </p> */}
                                    <p className="text-sm">
                                      <span className="font-medium">Date:</span>{" "}
                                      {format(
                                        new Date(selectedContact._creationTime),
                                        "MMM dd, yyyy 'at' HH:mm"
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium">Subject</h4>
                                  <p>{selectedContact.subject}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Message</h4>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="whitespace-pre-wrap">
                                      {selectedContact.message}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Update Status
                                  </h4>
                                  <Select
                                    value={selectedContact.status}
                                    onValueChange={(value) =>
                                      handleStatusUpdate(
                                        selectedContact._id,
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">New</SelectItem>
                                      <SelectItem value="in-progress">
                                        In Progress
                                      </SelectItem>
                                      <SelectItem value="resolved">
                                        Resolved
                                      </SelectItem>
                                      <SelectItem value="closed">
                                        Closed
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Select
                          value={contact.status}
                          onValueChange={(value) =>
                            handleStatusUpdate(contact._id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in-progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
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
