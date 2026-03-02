import { Metadata } from "next";
import Link from "next/link";
import JsonLdSchema from "@/components/JsonLdSchema";
import { ArrowRight } from "lucide-react";
import ServicesGrid from "@/components/ServicesGrid";
import { siteConfig, getAbsolutePath } from "@/lib/config";
import { PremiumButton } from "@/components/ui/PremiumButton";

export const metadata: Metadata = {
  title: "Services | Nasir Siddiqui - AI Automations, Chatbots & Digital Services",
  description:
    "Explore services offered by Nasir Siddiqui: AI Automations, Chatbot Development, Web Development, E-commerce Solutions, API Development, and Technical Consulting.",
  keywords: [
    "AI Automations",
    "Chatbot Development",
    "AI Chatbots",
    "Business Automation",
    "n8n Automation",
    "Web Development",
    "Next.js Development",
    "WordPress Development",
    "Shopify Development",
    "E-commerce Solutions",
    "API Development",
    "GraphQL API",
    "REST API",
    "Webhooks",
    "Technical Consulting",
    "MVP Development",
    "Digital Services",
    "Startup CTO",
  ],
  openGraph: {
    title: "Services | Nasir Siddiqui - AI Automations, Chatbots & Digital Services",
    description:
      "Explore services offered by Nasir Siddiqui: AI Automations, Chatbot Development, Web Development, E-commerce Solutions, API Development, and Technical Consulting.",
    url: getAbsolutePath('/services'),
    siteName: `${siteConfig.name} Portfolio`,
    type: "website",
  },
  alternates: {
    canonical: getAbsolutePath('/services'),
  },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLdSchema type="services" pageUrl={getAbsolutePath('/services')} />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Services
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Transform your business with AI-powered solutions and modern web
              development. From intelligent chatbots that engage customers 24/7 to
              scalable web applications and automation systems that streamline operations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#contact">
                <PremiumButton icon={<ArrowRight className="w-4 h-4" />}>
                  Get Started
                </PremiumButton>
              </Link>
              <Link href="/contact">
                <PremiumButton variant="secondary">
                  Contact Me
                </PremiumButton>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-5 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              What I Offer
            </h2>
            <ServicesGrid />
          </div>
        </section>

        {/* Why Choose Me Section */}
        <section className="py-20 px-5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              Why Work With Me
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Results-Driven Approach
                </h3>
                <p className="text-muted-foreground">
                  Focused on delivering tangible business outcomes through automation,
                  improved efficiency, and enhanced customer engagement.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  AI-Powered Solutions
                </h3>
                <p className="text-muted-foreground">
                  Leverage cutting-edge AI technologies including chatbots, automation
                  tools, and intelligent systems to transform your operations.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Modern Tech Stack
                </h3>
                <p className="text-muted-foreground">
                  Next.js, TypeScript, Tailwind CSS, and proven tools for building
                  performant, scalable applications.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Full-Stack Expertise
                </h3>
                <p className="text-muted-foreground">
                  From frontend design to backend architecture, APIs, and
                  deployment—I handle it all.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-5 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              How We Work Together
            </h2>
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Discovery",
                  description:
                    "We discuss your project, goals, and requirements. I provide technical recommendations and options.",
                },
                {
                  step: "02",
                  title: "Planning",
                  description:
                    "I create a clear roadmap for your project with defined milestones, timeline, and deliverables.",
                },
                {
                  step: "03",
                  title: "Development",
                  description:
                    "I build your product using modern best practices, with regular updates and opportunities for feedback.",
                },
                {
                  step: "04",
                  title: "Delivery & Support",
                  description:
                    "Your product is deployed, tested, and handed off with documentation and ongoing support.",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent text-white font-bold text-lg flex items-center justify-center">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 px-5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Let&apos;s discuss how I can help bring your vision to life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <PremiumButton icon={<ArrowRight className="w-4 h-4" />}>
                  Get In Touch
                </PremiumButton>
              </Link>
              <a href="mailto:nasir@nasirsidiki.com">
                <PremiumButton variant="secondary">
                  Email Me
                </PremiumButton>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
