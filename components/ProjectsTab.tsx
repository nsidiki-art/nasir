"use client";
import { useState } from "react";
import Image from "next/image";
import { FaRegArrowAltCircleRight, FaGithub } from "react-icons/fa";
import { RiRefreshLine } from "react-icons/ri";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { PremiumButton } from "./ui/PremiumButton";

interface Project {
  title: string;
  description: string;
  tags: string[];
  techStack?: string[];
  repoUrl?: string;
  image?: string;
}

interface ProjectsByCategory {
  [category: string]: Project[];
}

// Hardcoded projects data
const HARDCODED_PROJECTS: ProjectsByCategory = {
  "Next.js": [
    {
      title: "Personal Portfolio Website",
      description: "My personal portfolio showcasing my skills, projects, and experience, built with Next.js, TypeScript, and Tailwind CSS featuring a modern dark theme with glassmorphism effects and smooth animations.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Portfolio"],
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
      repoUrl: "https://github.com/nsidiki-art/nasir.git",
      image: "/assets/portfolio.jpeg",
    },
    {
      title: "Skillex Learning Platform",
      description: "An online learning platform offering courses and skill development modules. Built with Next.js and integrated with modern payment gateways and interactive video modules.",
      tags: ["Next.js", "React", "EdTech", "Platform"],
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
      image: "/assets/skillex.jpeg",
    },
    {
      title: "Furniture E-Commerce",
      description: "A fully dynamic furniture marketplace built using Next.js, Sanity CMS, and Tailwind CSS. Features product catalog, shopping cart, payment integration, and admin panel.",
      tags: ["Next.js", "Sanity", "E-commerce", "Marketplace"],
      techStack: ["Next.js", "Sanity CMS", "Tailwind CSS"],
      image: "/assets/furniture.jpeg",
    },
    {
      title: "Apparel StoreFront",
      description: "A responsive e-commerce web application for an urban clothing brand. Features user authentication, wishlists, and a streamlined checkout process tailored for modern consumers.",
      tags: ["Next.js", "E-Commerce", "Fashion", "Retail"],
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
      image: "/assets/apparel-ecom.jpeg",
    },
  ],
  "WordPress": [
    {
      title: "Artisan Coffee Roasters",
      description: "A rich and inviting WordPress website for a local coffee shop, showcasing their menu, sourcing process, events, and an integrated table reservation system.",
      tags: ["WordPress", "PHP", "Elementor", "Business"],
      image: "/assets/coffee.jpeg",
    },
    {
      title: "Creative Media Agency",
      description: "Corporate website for a creative media and digital marketing agency highlighting their full portfolio of campaigns, case studies, and client video testimonials.",
      tags: ["WordPress", "Business", "Media", "Agency"],
      image: "/assets/media.jpeg",
    },
    {
      title: "The Book Haven",
      description: "An online bookstore built with WooCommerce, featuring extensive book categories, specialized author interviews, and a dedicated community reader review section.",
      tags: ["WordPress", "WooCommerce", "E-commerce", "Retail"],
      image: "/assets/book.jpeg",
    },
    {
      title: "App Design Studio",
      description: "A premium landing page for a mobile app design studio focusing on lead generation, dynamic service offerings, and high-conversion aesthetic funnels.",
      tags: ["WordPress", "Design", "Landing Page", "Services"],
      image: "/assets/app-design.jpeg",
    },
  ],
  "UI/UX Design": [
    {
      title: "Modern UI Component Library",
      description: "A comprehensive design system featuring versatile, accessible UI components crafted for scalability and modern aesthetics across diverse web platforms.",
      tags: ["Figma", "Design System", "UI", "Components"],
      image: "/assets/ui-design.jpeg",
    },
    {
      title: "SaaS Dashboard UX",
      description: "A meticulous UX case study and high-fidelity prototype for a SaaS analytics dashboard focusing on data visualization, intuitive navigation, and dark mode interface.",
      tags: ["Figma", "UX", "Dashboard", "Prototyping"],
      image: "/assets/ui-ux.jpeg",
    },
  ],
};

const ProjectTabs = () => {
  const [visibleCount, setVisibleCount] = useState<Record<string, number>>({});
  const [loadingMore, setLoadingMore] = useState<Record<string, boolean>>({});
  const PROJECTS_PER_PAGE = 6;

  // Initialize visible counts on mount
  useState(() => {
    const initialCounts: Record<string, number> = {};
    const initialLoading: Record<string, boolean> = {};
    Object.keys(HARDCODED_PROJECTS).forEach(cat => {
      initialCounts[cat] = Math.min(3, HARDCODED_PROJECTS[cat]?.length || 0);
      initialLoading[cat] = false;
    });
    setVisibleCount(initialCounts);
    setLoadingMore(initialLoading);
  });

  const handleLoadMore = async (category: string) => {
    setLoadingMore(prev => ({ ...prev, [category]: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    setVisibleCount(prev => ({
      ...prev,
      [category]: Math.min((prev[category] || 0) + PROJECTS_PER_PAGE, (HARDCODED_PROJECTS[category] || []).length)
    }));
    setLoadingMore(prev => ({ ...prev, [category]: false }));
  };

  const categories = Object.keys(HARDCODED_PROJECTS);

  return (
    <section id="projects" className="max-w-7xl mx-auto mt-20 px-5 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="text-base text-accent font-medium sm:text-lg">
          See My Work
        </h3>
        <h2 className="text-5xl text-foreground font-semibold sm:text-6xl">
          Projects
        </h2>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue={categories[0]} className="w-full mt-10 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <TabsList className="flex flex-wrap justify-center gap-3 p-2 bg-transparent">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="px-4 py-2 rounded-lg bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                {category}
                <span className="ml-2 text-xs opacity-70">
                  ({HARDCODED_PROJECTS[category]?.length || 0})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </motion.div>

        {/* Tab Content */}
        {categories.map((category) => {
          const projects = HARDCODED_PROJECTS[category] || [];
          const visibleProjects = projects.slice(0, visibleCount[category] || PROJECTS_PER_PAGE);
          const hasMore = projects.length > (visibleCount[category] || PROJECTS_PER_PAGE);
          const isLoading = loadingMore[category] || false;

          return (
            <TabsContent key={category} value={category} className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {visibleProjects.map((project, index) => (
                  <motion.div
                    key={`${category}-${project.title.replace(/\s+/g, '-').toLowerCase()}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="scroll-smooth border border-border rounded-xl overflow-hidden shadow-lg bg-card group"
                  >
                    {/* Placeholder image */}
                    <div className="relative overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="h-44 md:h-36 lg:h-48 w-full"
                      >
                        <Image
                          src={project.image || "/assets/placeholder.png"}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        {project.title}
                      </h2>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.slice(0, 3).map((tag, i) => (
                          <motion.span
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-1">
                          {project.techStack && project.techStack.map((tech, i) => (
                            <span key={i} className="text-accent">•</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PremiumButton
                      onClick={() => handleLoadMore(category)}
                      disabled={isLoading}
                      icon={isLoading ? <RiRefreshLine className="animate-spin text-lg" /> : <FaRegArrowAltCircleRight />}
                    >
                      {isLoading ? "Loading..." : "Load More Projects"}
                    </PremiumButton>
                  </motion.div>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
};

export default ProjectTabs;
