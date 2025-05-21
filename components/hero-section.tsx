import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonHref?: string;
}

export function HeroSection({
  title,
  description,
  imageSrc,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonHref = "#",
  secondaryButtonHref = "#",
}: HeroSectionProps) {
  return (
    <section className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
      </div>
      <div className="container relative flex h-full flex-col items-center -mt-20 justify-center gap-4 text-white">
        <h1 className="max-w-2xl text-5xl font-bold leading-tight text-center">{title}</h1>
        <p className="max-w-xl text-lg">{description}</p>
        <div className="mt-6 flex gap-4">
          <Button size="lg" className="bg-amber-800 hover:bg-amber-900" asChild>
            <a href={primaryButtonHref}>{primaryButtonText}</a>
          </Button>
          {secondaryButtonText && (
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <a href={secondaryButtonHref}>{secondaryButtonText}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
