"use client";

import type React from "react";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createContact = useMutation(api.contacts.createContact);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await createContact({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      });

      setIsSubmitted(true);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      // You might want to show an error message here
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Thank you for your message!
        </h3>
        <p className="text-green-700">
          We{"'"}ll get back to you as soon as possible.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          className="mt-4"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            className="focus:border-amber-800 focus:ring-amber-800"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your email"
            className="focus:border-amber-800 focus:ring-amber-800"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Your phone number (optional)"
          className="focus:border-amber-800 focus:ring-amber-800"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          placeholder="Subject"
          className="focus:border-amber-800 focus:ring-amber-800"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Your message"
          className="focus:border-amber-800 focus:ring-amber-800"
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-amber-800 hover:bg-amber-900"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
