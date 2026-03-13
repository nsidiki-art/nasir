import React from "react";
import Image from "next/image";

import Link from "next/link";
import {
  FaLinkedin,
  FaFacebookSquare,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto text-gray-600 body-font relative">
      {/* Natural gradient blob coming from below with larger size */}
      <div className="absolute bottom-5 md:-bottom-20 left-10 md:-left-20 w-64 h-64 bg-theme-gradient rounded-full blur-[100px] opacity-20 dark:opacity-30 -z-10"></div>
      
      <div className="px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <Link href={"/"} className="flex mb-4 md:mb-0 relative py-2 items-center gap-3 group">
          <Image src="/assets/logo.svg" width={44} height={44} alt={"Nasir Siddiqui Logo"} className="relative z-10 drop-shadow-lg rounded-xl group-hover:scale-105 transition-all duration-300" unoptimized />
          <span className="font-montserrat font-bold tracking-tight text-foreground text-xl">
            Nasir Siddiqui
          </span>
        </Link>
        <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © 2026 Nasir Siddiqui | Designed with 🩷 @
          <Link
            href="http://www.hashtagstech.com"
            className="text-accent ml-1 hover:text-accent/80 font-medium transition-colors"
            target="_blank"
          >
            Hashtags Technology.
          </Link>
        </p>
        <span className="inline-flex gap-3 sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <Link
            href="/services"
            className="text-gray-500 text-base font-semibold hover:text-accent mr-2"
            prefetch={false}
          >
            Services
          </Link>
          <Link
            href={"https://www.linkedin.com/in/nasirsidiki"}
            className="text-gray-500 text-2xl hover:text-[#0077B5]"
            target="_blank"
          >
            <FaLinkedin />
          </Link>
          <Link
            href={"https://www.x.com/nasirs74"}
            className="text-gray-500 text-2xl hover:text-[#171515]"
            target="_blank"
          >
            <FaSquareXTwitter />
          </Link>
          <Link
            href={"https://www.facebook.com/nasirsidiki"}
            className="text-gray-500 text-2xl hover:text-[#5890FF]"
            target="_blank"
          >
            <FaFacebookSquare />
          </Link>
        </span>
      </div>
    </footer>
  );
};

export default Footer;