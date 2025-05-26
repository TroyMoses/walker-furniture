import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Award, Clock, Leaf, Recycle, ShieldCheck, Users } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      <Header />

      <HeroSection
        title="Our Story"
        description="Discover the passion and craftsmanship behind Exit Walker Furniture."
        imageSrc="/images/bg/bgimg1.jpg"
        primaryButtonText="Meet Our Team"
        primaryButtonHref="#team"
      />

      {/* Our History */}
      <section className="pt-16 pb-2 px-3 md:px-10 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h2 className="mb-6 text-3xl font-bold">Our History</h2>
              <p className="mb-4 text-gray-700">
                Exit Walker Furniture was founded in 2017 by Wanjala Abel, a
                third-generation woodworker with a passion for creating
                beautiful, functional furniture. What began as a small workshop
                in his garage has grown into a renowned furniture company with a
                commitment to quality craftsmanship and sustainable practices.
              </p>
              <p className="mb-4 text-gray-700">
                Throughout our history, we{"'"}ve maintained our dedication to
                traditional woodworking techniques while embracing modern design
                principles. Each piece of furniture tells a story of skill,
                patience, and attention to detail that has been passed down
                through generations.
              </p>
              <p className="text-gray-700">
                Today, Exit Walker Furniture continues to be family-owned and
                operated, with James{"'"}s children and a team of skilled
                artisans carrying forward his legacy of excellence and
                innovation in furniture making.
              </p>
            </div>
            <div className="hidden md:block relative h-[400px] overflow-hidden rounded-lg shadow-md">
              <Image
                width={800}
                height={800}
                src="/images/bg/bgimg1.jpg"
                alt="Historical workshop"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="pt-16 pb-2 px-3 md:px-10 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="container">
          <SectionHeading
            title="Our Values"
            subtitle="The principles that guide our craftsmanship and business"
          />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <ShieldCheck className="h-10 w-10 text-amber-800" />,
                title: "Quality",
                description:
                  "We never compromise on materials or craftsmanship, ensuring each piece will last for generations.",
              },
              {
                icon: <Leaf className="h-10 w-10 text-amber-800" />,
                title: "Sustainability",
                description:
                  "We source responsibly harvested woods and use eco-friendly finishes to minimize environmental impact.",
              },
              {
                icon: <Users className="h-10 w-10 text-amber-800" />,
                title: "Community",
                description:
                  "We support local suppliers and artisans, fostering a community of craftsmanship.",
              },
              {
                icon: <Award className="h-10 w-10 text-amber-800" />,
                title: "Excellence",
                description:
                  "We strive for excellence in every detail, from design to delivery and customer service.",
              },
              {
                icon: <Recycle className="h-10 w-10 text-amber-800" />,
                title: "Innovation",
                description:
                  "We blend traditional techniques with innovative approaches to create timeless yet modern designs.",
              },
              {
                icon: <Clock className="h-10 w-10 text-amber-800" />,
                title: "Timelessness",
                description:
                  "We create furniture that transcends trends, becoming more valuable and beautiful with age.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg bg-gradient-to-b from-white to-amber-50 p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="pt-16 pb-2 px-3 md:px-10 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container">
          <SectionHeading
            title="Our Crafting Process"
            subtitle="From raw materials to finished masterpieces"
          />

          <div className="relative">
            <div className="hidden md:absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-amber-800/20 md:block"></div>

            <div className="space-y-12">
              {[
                {
                  title: "Material Selection",
                  description:
                    "We carefully select the finest hardwoods from sustainable sources, examining each piece for grain pattern, color, and structural integrity.",
                  image: "/images/bg/bgimg2.jpg",
                },
                {
                  title: "Design & Planning",
                  description:
                    "Our designers create detailed plans that honor traditional woodworking while incorporating modern functionality and aesthetics.",
                  image: "/images/bg/bgimg1.jpg",
                },
                {
                  title: "Crafting",
                  description:
                    "Our master craftsmen use both traditional hand tools and precision machinery to shape, join, and assemble each piece with meticulous attention to detail.",
                  image: "/images/bg/bgimg2.jpg",
                },
                {
                  title: "Finishing",
                  description:
                    "Multiple layers of eco-friendly finishes are applied by hand, enhancing the natural beauty of the wood while providing lasting protection.",
                  image: "/images/bg/bgimg1.jpg",
                },
                {
                  title: "Quality Control",
                  description:
                    "Each piece undergoes rigorous inspection to ensure it meets our exacting standards for beauty, functionality, and durability.",
                  image: "/images/bg/bgimg2.jpg",
                },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="hidden md:block absolute left-1/2 top-0 -mt-2 -translate-x-1/2 rounded-full bg-amber-800 p-2">
                    <div className="h-4 w-4 rounded-full bg-amber-800"></div>
                  </div>

                  <div
                    className={`grid grid-cols-1 gap-8 md:grid-cols-2 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex flex-col justify-center ${index % 2 === 1 ? "md:items-end md:text-right" : ""}`}
                    >
                      <h3 className="mb-4 text-2xl font-bold">{step.title}</h3>
                      <p className="text-gray-700">{step.description}</p>
                    </div>

                    <div className="relative h-64 overflow-hidden rounded-lg shadow-md">
                      <Image
                        width={800}
                        height={800}
                        src={step.image || "/images/bg/bgimg1.jpg"}
                        alt={step.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section
        id="team"
        className="pt-16 pb-2 px-3 md:px-10 bg-gradient-to-b from-amber-50/30 to-white"
      >
        <div className="container">
          <SectionHeading
            title="Meet Our Team"
            subtitle="The skilled artisans behind our beautiful furniture"
          />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Robert Walker",
                role: "Master Craftsman & CEO",
                bio: "Son of founder James Walker, Robert has been crafting furniture since childhood and now leads our company with the same passion and dedication.",
                image: "/images/testimonials/shuga.jpg",
              },
              {
                name: "Elena Chen",
                role: "Lead Designer",
                bio: "With a background in architecture and furniture design, Elena brings a unique perspective that blends functionality with timeless aesthetics.",
                image: "/images/testimonials/shuga.jpg",
              },
              {
                name: "Marcus Johnson",
                role: "Master Woodworker",
                bio: "With over 25 years of experience, Marcus specializes in intricate joinery and detailed carving that sets our furniture apart.",
                image: "/images/testimonials/shuga.jpg",
              },
              {
                name: "Sophia Rodriguez",
                role: "Sustainability Director",
                bio: "Sophia ensures our materials and processes meet the highest standards of environmental responsibility and ethical sourcing.",
                image: "/images/testimonials/shuga.jpg",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-lg bg-gradient-to-b from-white to-amber-50 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    fill
                    src={member.image || "/images/testimonials/shuga.jpg"}
                    alt={member.name}
                    className="h-full w-[300px] object-contain md:object-fill transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-amber-800">{member.role}</p>
                  <p className="mt-2 text-sm text-gray-700">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="pt-16 pb-12 px-3 md:px-10 text-gray-700">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div className="max-w-lg">
              <h2 className="mb-4 text-3xl font-bold">Join Our Team</h2>
              <p>
                We{"'"}re always looking for talented craftspeople, designers,
                and furniture enthusiasts to join our team. If you share our
                passion for quality and craftsmanship, we{"'"}d love to hear
                from you.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-amber-800 text-gray-700 hover:bg-white/10"
              size="lg"
              asChild
            >
              <a href="/careers">View Open Positions</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
