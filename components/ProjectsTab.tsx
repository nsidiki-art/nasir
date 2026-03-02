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
    },
    {
      title: "TeamFlow",
      description: "An AI-powered team management and task assignment platform designed for agencies. Features intelligent task distribution, team workload balancing, and automated project tracking with real-time collaboration.",
      tags: ["Next.js", "AI", "SaaS", "Team Management", "Agencies"],
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    },
    {
      title: "RentParlo",
      description: "A peer-to-peer marketplace for renting goods. Connects lenders with borrowers, featuring secure transactions, rental agreements, item verification, and a streamlined user experience.",
      tags: ["Next.js", "Marketplace", "Rental", "P2P", "E-commerce"],
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    },
    {
      title: "FurnitureMart.pk",
      description: "A fully dynamic furniture marketplace built using Next.js, Sanity CMS, and Tailwind CSS. Features product catalog, shopping cart, payment integration, and admin panel for inventory management.",
      tags: ["Next.js", "Sanity", "E-commerce", "Marketplace"],
      techStack: ["Next.js", "Sanity CMS", "Tailwind CSS"],
    },
  ],
  "WordPress": [
    {
      title: "Landscape & Gardening Website",
      description: "Professional website for a landscape and gardening service provider, showcasing their expertise, services portfolio, and customer testimonials with SEO optimization.",
      tags: ["WordPress", "PHP", "Elementor", "Business"],
    },
    {
      title: "Four M Enterprises",
      description: "Corporate website for a roofing material supplier, featuring product catalog, request quote system, and company information pages designed for B2B lead generation.",
      tags: ["WordPress", "Business", "SEO", "B2B"],
    },
    {
      title: "IDI Overseas HR",
      description: "HR consultancy website with job listings, company profile, services overview, and contact forms for overseas employment opportunities.",
      tags: ["WordPress", "PHP", "HR", "Recruitment"],
    },
    {
      title: "Rukhsar Marriage Bureau",
      description: "Matchmaking service website with profile listings, success stories, service packages, and inquiry forms for matrimonial services.",
      tags: ["WordPress", "PHP", "Matrimonial", "Services"],
    },
  ],
  "Tools & Automation": [
    {
      title: "AI Content Generator",
      description: "Tool for generating AI-powered social media content from YouTube videos. Uses OpenAI API for content generation and Streamlit for the web interface.",
      tags: ["Python", "Automation", "AI", "Content"],
      techStack: ["Python", "Streamlit", "OpenAI API"],
    },
    {
      title: "AI Data Alchemist",
      description: "Data transformation and cleaning tool that helps users filter, visualize, and get AI-powered suggestions for CSV/Excel files with an intuitive web interface.",
      tags: ["Python", "AI", "Data", "Analytics"],
      techStack: ["Python", "Streamlit", "Pandas", "Gemini API"],
    },
    {
      title: "Password Strength Meter",
      description: "Secure password management tool that evaluates password strength, generates strong passwords, and provides security recommendations with a clean, user-friendly interface.",
      tags: ["Python", "Streamlit", "Security", "Tool"],
      techStack: ["Python", "Streamlit"],
    },
    {
      title: "AI Powered Unit Converter",
      description: "Smart unit and currency converter with real-time exchange rates, AI-powered conversion suggestions, and support for multiple measurement categories.",
      tags: ["Python", "Streamlit", "AI", "Converter"],
      techStack: ["Python", "Streamlit"],
    },
  ],
  "HTML & CSS": [
    {
      title: "Resume Builder",
      description: "Custom resume-building tool with PDF export functionality, professional templates, real-time preview, and print-ready output for job applications.",
      tags: ["HTML", "TypeScript", "Tool", "PDF"],
      techStack: ["HTML", "TypeScript", "JavaScript", "CSS"],
    },
    {
      title: "Inventory Management System",
      description: "Simple yet effective inventory tracking tool with add/edit/delete functionality, local storage persistence, and clean interface for small business inventory.",
      tags: ["HTML", "TypeScript", "Tool", "Management"],
      techStack: ["HTML", "TypeScript", "JavaScript", "CSS"],
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
                        className="lg:h-48 md:h-36 w-full"
                      >
                        <Image
                          src="/assets/placeholder.png"
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
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-accent/80 transition-colors flex items-center gap-1 text-sm font-medium"
                          >
                            <FaGithub className="text-base" />
                          </a>
                        )}
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
