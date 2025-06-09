import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      <Header />

      <HeroSection
        title="Get In Touch"
        description="We'd love to hear from you. Contact us with any questions, feedback, or to schedule a showroom visit."
        imageSrc="/images/bg/bgimg1.jpg"
        primaryButtonText="Visit Our Showroom"
        primaryButtonHref="#showroom"
      />

      <section className="pt-16 pb-2 px-3 md:px-10 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <SectionHeading title="Contact Information" centered={false} />

              <div className="space-y-6">
                <Card>
                  <CardContent className="flex items-start gap-4 p-6">
                    <MapPin className="h-6 w-6 text-amber-800" />
                    <div>
                      <h3 className="font-medium">Visit Our Showroom</h3>
                      <p className="text-gray-700">
                        Opposite Club Guvnors, 1st Street Industrial Area.
                      </p>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-sm text-amber-800 hover:underline"
                      >
                        View on Map
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start gap-4 p-6">
                    <Phone className="h-6 w-6 text-amber-800" />
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <p className="text-gray-700">
                        <a href="tel:+256757601694" className="mb-4">
                          +256 757 601694
                        </a>
                      </p>
                      <p className="text-sm text-gray-500">
                        Customer service available Mon-Fri, 9am-5pm
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start gap-4 p-6">
                    <Mail className="h-6 w-6 text-amber-800" />
                    <div>
                      <h3 className="font-medium">Email Us</h3>
                      <p className="text-gray-700">
                        <a href="mailto:kingabbey80@gmail.com">
                          kingabbey80@gmail.com
                        </a>
                      </p>
                      <p className="text-sm text-gray-500">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start gap-4 p-6">
                    <Clock className="h-6 w-6 text-amber-800" />
                    <div>
                      <h3 className="font-medium">Hours</h3>
                      <div className="space-y-1 text-gray-700">
                        <p>Monday - Friday: 9am - 6pm</p>
                        <p>Saturday: 10am - 5pm</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://wwww.instagram.com/exit_walker_furniture_concepts"
                    className="rounded-full bg-amber-800 p-2 text-white transition-colors hover:bg-amber-900"
                    aria-label="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="5"
                        ry="5"
                      ></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a
                    href="https://wwww.twitter.com/Abelexit"
                    className="rounded-full bg-amber-800 p-2 text-white transition-colors hover:bg-amber-900"
                    aria-label="Twitter"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div>
              <SectionHeading title="Send Us a Message" centered={false} />
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Quick answers to common questions"
          />

          <div className="mx-auto max-w-3xl space-y-4">
            {[
              {
                question: "Do you offer delivery services?",
                answer:
                  "Yes, we offer white-glove delivery services all over the country. Our delivery team will place the furniture in your desired location, assemble it if necessary, and remove all packaging materials.",
              },
              {
                question: "What is your return policy?",
                answer:
                  "We offer a 30-day return policy for stock items in original condition. Custom and made-to-order pieces are non-returnable. Please contact our customer service team for more details.",
              },
              {
                question: "Do you offer design consultations?",
                answer:
                  "Yes, we offer complimentary design consultations both in our showroom and virtually. Our design team can help you select pieces that complement your existing décor or assist with a complete room redesign.",
              },
              {
                question: "How long does custom furniture take?",
                answer:
                  "Custom furniture typically takes 8-12 weeks from order to delivery, depending on the complexity of the design and current production schedule. We'll provide you with a specific timeline when you place your order.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-lg bg-gradient-to-r from-white to-amber-50 p-6 shadow-md"
              >
                <h3 className="mb-2 text-lg font-medium">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
