import { Button } from "./ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function Header() {
  return (
    <main className="bg-foreground/10">
      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
            Umroh with the
            <span className="mx-3 bg-primary text-background">elegant</span>
            way
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
            Discover tailored Umrah packages for a spiritually enriching journey
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
          <div className="mt-12">
            <ul className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {["Easy Integration", "24/7 Support", "Scalable Solution"].map(
                (feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-muted-foreground"
                  >
                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                    {feature}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
