"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaChevronRight, FaMoon, FaSun } from "react-icons/fa";
import { RiNextjsLine, RiWordpressLine } from "react-icons/ri";
import { TbBrandTypescript, TbBrandPython } from "react-icons/tb";
import Link from "next/link";
import { HeroHighlight } from "@/components/ui/HeroHighlight";
import { AnimatedTooltip } from "@/components/ui/AnimatedTooltip";
import { Github, Linkedin, Mail } from "lucide-react";
import dynamic from "next/dynamic";

const Typewriter = dynamic(
  () => import("nextjs-simple-typewriter").then((mod) => mod.Typewriter),
  {
    ssr: false,
    loading: () => <span>AI Automation Expert</span>,
  }
);

// We simulate the new color palette via an object mapping
// allowing us to toggle between light and dark locally 
// before making global layout changes.
const ThemeConfig = {
  dark: {
    bgBase: "bg-[#0A0A0A]",
    bgCard: "bg-[#141414]",
    textMain: "text-white",
    textMuted: "text-gray-400",
    textHeading: "text-white",
    accentGradient: "bg-gradient-to-r from-[#FECD1A] to-[#64F4AB]",
    accentGradientText: "text-transparent bg-clip-text bg-gradient-to-r from-[#FECD1A] to-[#64F4AB]",
    accentText: "text-[#64F4AB]",
    primaryText: "text-[#FECD1A]",
    borderGlow: "border-[#FECD1A]/30",
    buttonText: "text-black",
    glowPrimary: "bg-[#FECD1A]",
    glowAccent: "bg-[#64F4AB]",
    cardBorder: "border-white/10",
    iconBg: "bg-[#1A1A1A]",
    ringBadge: "border-white/10 bg-[#141414]",
  },
  light: {
    bgBase: "bg-[#FAFAFA]",
    bgCard: "bg-white",
    textMain: "text-gray-900",
    textMuted: "text-gray-600",
    textHeading: "text-gray-900",
    accentGradient: "bg-gradient-to-r from-[#FECD1A] to-[#64F4AB]",
    accentGradientText: "text-transparent bg-clip-text bg-gradient-to-r from-[#d4aa00] to-[#25ad68]", // darker for contrast
    accentText: "text-[#25ad68]", // darker green
    primaryText: "text-[#d4aa00]", // darker yellow
    borderGlow: "border-[#FECD1A]/50",
    buttonText: "text-black",
    glowPrimary: "bg-[#FECD1A]",
    glowAccent: "bg-[#64F4AB]",
    cardBorder: "border-black/5",
    iconBg: "bg-[#F4F4F5]",
    ringBadge: "border-black/5 bg-white",
  }
};

export default function DesignSample() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = isDark ? ThemeConfig.dark : ThemeConfig.light;

  return (
    <div
      className={`min-h-screen ${currentTheme.bgBase} ${currentTheme.textMain} font-sans selection:bg-[#FECD1A]/30 relative overflow-hidden transition-colors duration-500`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${isDark ? '0.03' : '0.015'}'/%3E%3C/svg%3E")`,
      }}
    >
      {/* Global Header ThemeToggle handles the switch now */}

      {/* Background Ambient Glows */}
      <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${currentTheme.glowPrimary} rounded-full blur-[150px] ${isDark ? 'opacity-10' : 'opacity-20'} pointer-events-none transition-opacity duration-500`} />
      <div className={`absolute top-[40%] right-[-10%] w-[30%] h-[50%] ${currentTheme.glowAccent} rounded-full blur-[150px] ${isDark ? 'opacity-5' : 'opacity-10'} pointer-events-none transition-opacity duration-500`} />

      {/* Hero Section styled with the new colors */}
      <section className="relative overflow-hidden z-0">
        <HeroHighlight>
          <div className="max-w-7xl mx-auto flex px-5 pt-40 py-10 md:flex-row flex-col items-center min-h-screen">
            <div className="sm:entrance-left lg:flex-grow md:w-1/2 lg:pr-16 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center lg:w-3/5">
              
              {/* Available Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${currentTheme.textMuted} border ${currentTheme.ringBadge} shadow-xl backdrop-blur-md transition-colors duration-500`}>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#64F4AB] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#64F4AB]"></span>
                  </span>
                  Available for AI Projects & Web Development
                </span>
              </div>

              <div className="min-h-60 xs:min-h-44 md:min-h-0">
                <h1 className={`sm:text-5xl text-4xl mb-4 font-montserrat font-bold ${currentTheme.textHeading} tracking-tight transition-colors duration-500`}>
                  Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600">Nasir Siddiqui</span><span className={currentTheme.accentText}>.</span>
                  <br />
                  <span className={`${isDark ? 'text-gray-200' : 'text-gray-800'} font-semibold tracking-normal mt-2 inline-block transition-colors duration-500`}>
                    <Typewriter
                      words={[
                        "an AI Automation Expert.",
                        "a Chatbot Developer.",
                        "a Web Development Specialist.",
                        "a Full Stack Developer.",
                        "a TypeScript Expert.",
                        "a WordPress & CMS Expert.",
                      ]}
                      loop={0}
                      cursor
                      cursorStyle="|"
                      typeSpeed={70}
                      deleteSpeed={50}
                      delaySpeed={1000}
                    />
                  </span>
                </h1>
              </div>
              <p className={`mb-8 leading-relaxed font-poppins ${currentTheme.textMuted} transition-colors duration-500`}>
                I build intelligent chatbots, automation systems, and modern web applications that help businesses work smarter. Specializing in AI-powered solutions, full-stack development, and digital services that drive real results.
              </p>
              
              <div className="flex justify-center gap-4 flex-wrap">
                <Link href="#contact" className="scroll-smooth duration-300">
                  <button className={`group relative overflow-hidden flex items-center ${currentTheme.buttonText} px-8 py-3.5 rounded-full font-bold text-sm tracking-wide ${currentTheme.accentGradient} shadow-lg shadow-[#FECD1A]/20`}>
                    <span className="relative z-10 flex items-center">
                      Get In Touch
                      <FaChevronRight className="ml-3 group-hover:translate-x-1 duration-300 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </Link>
                <Link href="#projects" className="scroll-smooth duration-300">
                  <button className={`group flex items-center ${currentTheme.textMain} bg-transparent border ${isDark ? 'border-white/20 hover:border-white/50' : 'border-black/20 hover:border-black/50'} py-3.5 rounded-full font-medium text-sm px-8 transition-all duration-300`}>
                    View Projects
                    <FaChevronRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 items-center justify-center mt-8">
                <div>
                  <p className="mb-2 font-bold md:ml-4 text-xs tracking-widest text-gray-500 uppercase">TECH STACK:</p>
                  <div className="container flex flex-row items-center gap-3 justify-center md:justify-start flex-wrap">
                    <AnimatedTooltip tooltipTitle="Next.js" tooltipDescription="SaaS & Full-Stack">
                      <div className={`shadow-xl opacity-80 hover:opacity-100 rounded-lg ${currentTheme.iconBg} border ${currentTheme.cardBorder} p-3 text-2xl ${currentTheme.textMuted} hover:${currentTheme.primaryText} transition-all duration-300`}>
                        <RiNextjsLine />
                      </div>
                    </AnimatedTooltip>
                    <AnimatedTooltip tooltipTitle="TypeScript" tooltipDescription="Type-Safe Development">
                      <div className={`shadow-xl opacity-80 hover:opacity-100 rounded-lg ${currentTheme.iconBg} border ${currentTheme.cardBorder} p-3 text-2xl ${currentTheme.textMuted} hover:${currentTheme.primaryText} transition-all duration-300`}>
                        <TbBrandTypescript />
                      </div>
                    </AnimatedTooltip>
                    <AnimatedTooltip tooltipTitle="Python" tooltipDescription="Chatbots & Automation">
                      <div className={`shadow-xl opacity-80 hover:opacity-100 rounded-lg ${currentTheme.iconBg} border ${currentTheme.cardBorder} p-3 text-2xl ${currentTheme.textMuted} hover:${currentTheme.primaryText} transition-all duration-300`}>
                        <TbBrandPython />
                      </div>
                    </AnimatedTooltip>
                    <AnimatedTooltip tooltipTitle="WordPress" tooltipDescription="CMS & E-commerce">
                      <div className={`shadow-xl opacity-80 hover:opacity-100 rounded-lg ${currentTheme.iconBg} border ${currentTheme.cardBorder} p-3 text-2xl ${currentTheme.textMuted} hover:${currentTheme.primaryText} transition-all duration-300`}>
                        <RiWordpressLine />
                      </div>
                    </AnimatedTooltip>
                  </div>
                </div>

                <div>
                  <p className="mt-8 lg:mt-0 mb-2 font-bold md:ml-4 text-xs tracking-widest text-gray-500 uppercase">CONNECT WITH ME:</p>
                  <div className="container flex flex-row items-center gap-3 justify-center md:justify-start ">
                    <AnimatedTooltip tooltipTitle="Linkedin" tooltipDescription="Connect with me on Linkedin">
                      <Link href={"https://www.linkedin.com/in/nasirsiddiqui/"} target="_blank">
                        <div className={`shadow-xl opacity-80 hover:opacity-100 rounded-lg ${currentTheme.iconBg} border ${currentTheme.cardBorder} p-3 text-2xl ${currentTheme.textMuted} hover:${currentTheme.primaryText} transition-all duration-300`}>
                          <Linkedin className="w-6 h-6" />
                        </div>
                      </Link>
                    </AnimatedTooltip>
                    <AnimatedTooltip tooltipTitle="Github" tooltipDescription="View my repositories on Github">
                      <Link href={"https://github.com/nasirsiddiqui"} target="_blank">
                        <div className={`shadow-xl opacity-80 hover:opacity-100 rounded-lg ${currentTheme.iconBg} border ${currentTheme.cardBorder} p-3 text-2xl ${currentTheme.textMuted} hover:${currentTheme.primaryText} transition-all duration-300`}>
                          <Github className="w-6 h-6" />
                        </div>
                      </Link>
                    </AnimatedTooltip>
                    <AnimatedTooltip tooltipTitle="Email" tooltipDescription="Send me an email">
                      <Link href={"mailto:nasir@nasirsidiki.com"} target="_blank">
                        <div className={`shadow-xl opacity-80 hover:opacity-100 rounded-lg ${currentTheme.iconBg} border ${currentTheme.cardBorder} p-3 text-2xl ${currentTheme.textMuted} hover:${currentTheme.primaryText} transition-all duration-300`}>
                          <Mail className="w-6 h-6" />
                        </div>
                      </Link>
                    </AnimatedTooltip>
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:entrance-right lg:max-w-lg md:w-2/5 sm:-ml-16 sm:pt-0 relative lg:-mt-8 xl:-mt-14 md:ml-20 md:-mt-52 ">
              <div className={`-mt-56 -mr-[155px] w-11/12 sm:w-[24rem] h-[70%] shadow-2xl opacity-40 shadow-[#FECD1A]/10 rounded-xl absolute bottom-0 right-40 z-0 md:w-11/12 md:h-[75%] md:-mr-28 md:bottom-0 xs:h-[75%] xs:bottom-0 sm:bottom-0 sm:-mr-32 sm:w-10/12 lg:-mr-40 xl:w-10/12 xl:-mr-30 xl:h-[75%] xl:bottom-0 ${currentTheme.bgCard} border ${currentTheme.cardBorder} transition-colors duration-500`}></div>
              <AnimatedTooltip tooltipTitle="Nasir Siddiqui" tooltipDescription="AI Automation & Web Developer">
                <Image
                  src="/assets/Nasir.png"
                  className="relative object-contain object-center -mt-16 xs:ml-5 xs:-mt-14 z-10 md:mt-32 md:-ml-10 sm:-mt-9 sm:ml-16 lg:ml-4 lg:mt-4 xl:ml-12 drop-shadow-2xl"
                  width={450}
                  height={350}
                  quality={100}
                  unoptimized
                  priority
                  alt="Nasir Siddiqui - AI Automation & Web Developer"
                />
              </AnimatedTooltip>
            </div>
          </div>
          <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-black/10'} justify-center flex m-auto mt-10 transition-colors duration-500`}></div>
        </HeroHighlight>
      </section>
    </div>
  );
}

