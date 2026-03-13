import React from 'react';
import { siteConfig } from '@/lib/config';

interface JsonLdSchemaProps {
  type: 'home' | 'about' | 'projects' | 'skills' | 'contact' | 'services' | 'service';
  pageUrl: string;
}

const JsonLdSchema: React.FC<JsonLdSchemaProps> = ({ type, pageUrl }) => {
  const baseUrl = siteConfig.url;

  // Person Schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    "name": "Nasir Siddiqui",
    "alternateName": ["Muhammad Nasir", "Nasir"],
    "jobTitle": ["AI Automation Expert", "Chatbot Developer", "Full Stack Developer", "Next.js Developer", "Web Developer"],
    "description": "AI automation expert and full-stack developer specializing in intelligent chatbots, business automation, and modern web solutions.",
    "url": baseUrl,
    "image": `${baseUrl}/assets/Nasir.png`,
    "sameAs": [
      "https://www.linkedin.com/in/nasirsidiki",
      "https://www.x.com/nasirs74",
      "https://www.facebook.com/nasirsidiki",
    ],
    "knowsAbout": [
      "AI Agents Development",
      "Full Stack Development",
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Web Development",
      "AI Integration",
      "Machine Learning",
      "Frontend Development",
      "Backend Development",
      "Wordpress Development",
      "Search Engine Optimization",
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance Developer",
      "url": baseUrl
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Pakistan"
    }
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "Nasir Siddiqui Portfolio",
    "url": baseUrl,
    "logo": `${baseUrl}/assets/Nasir.png`,
    "description": "Professional portfolio of Nasir Siddiqui - AI Automation Expert and Full Stack Developer",
    "founder": {
      "@type": "Person",
      "name": "Nasir Siddiqui"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "name": "Nasir Siddiqui Portfolio",
    "url": baseUrl,
    "description": "Professional portfolio showcasing AI Agents Development, Full Stack Development, and Next.js expertise",
    "publisher": {
      "@type": "Person",
      "name": "Nasir Siddiqui"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    "url": pageUrl,
    "name": getPageTitle(type),
    "description": getPageDescription(type),
    "isPartOf": {
      "@id": `${baseUrl}/#website`
    },
    "about": {
      "@id": `${baseUrl}/#person`
    },
    "author": {
      "@id": `${baseUrl}/#person`
    },
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "mainEntity": {
      "@id": `${baseUrl}/#person`
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": getBreadcrumbItems(type, baseUrl)
    }
  };

  // CreativeWork Schema for Projects (if on projects page)
  const creativeWorkSchema = type === 'projects' ? {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${pageUrl}#creativework`,
    "name": "Portfolio Projects",
    "description": "Collection of web development and AI integration projects by Nasir Siddiqui",
    "author": {
      "@id": `${baseUrl}/#person`
    },
    "creator": {
      "@id": `${baseUrl}/#person`
    },
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "genre": ["Web Development", "AI Integration", "Software Development"],
    "keywords": "AI Agents Development, Full Stack Development, Next.js, React, Web Development"
  } : null;

  // Service Schema for Contact page
  const serviceSchema = type === 'contact' ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    "name": "Web Development Services",
    "description": "Professional web development and AI integration services by Nasir Siddiqui",
    "provider": {
      "@id": `${baseUrl}/#person`
    },
    "serviceType": [
      "AI Agents Development",
      "Full Stack Development",
      "Next.js Development",
      "React Development",
      "Web Application Development"
    ],
    "areaServed": "Worldwide",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": pageUrl
    }
  } : null;

  const schemas = [
    personSchema,
    organizationSchema,
    websiteSchema,
    webPageSchema,
    ...(creativeWorkSchema ? [creativeWorkSchema] : []),
    ...(serviceSchema ? [serviceSchema] : [])
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

// Helper functions
function getPageTitle(type: string): string {
  const titles = {
    home: "Nasir Siddiqui | AI Automation Expert & Full Stack Developer",
    about: "About Nasir Siddiqui | AI Automation Expert & Full Stack Developer",
    projects: "Projects | Nasir Siddiqui - AI Automation Expert & Full Stack Developer",
    skills: "Skills | Nasir Siddiqui - AI Automation Expert & Full Stack Developer",
    contact: "Contact | Nasir Siddiqui - AI Automation Expert & Full Stack Developer",
    services: "Services | Nasir Siddiqui - AI Automations & Digital Services",
    service: "Service | Nasir Siddiqui - AI Automations & Web Development"
  };
  return titles[type as keyof typeof titles] || titles.home;
}

function getPageDescription(type: string): string {
  const descriptions = {
    home: "Welcome to Nasir Siddiqui's portfolio. AI automation expert and full-stack developer specializing in intelligent chatbots, business automation, and modern web solutions.",
    about: "Learn more about Nasir Siddiqui - AI automation expert and full-stack developer. Discover my background, expertise, and passion for building intelligent chatbots and modern web solutions.",
    projects: "Explore Nasir Siddiqui's portfolio of projects. AI automation expert and full-stack developer showcasing innovative chatbots, automation systems, and modern web applications.",
    skills: "Discover Nasir Siddiqui's technical skills and expertise. AI automation expert and full-stack developer proficient in React, TypeScript, chatbots, and modern web technologies.",
    contact: "Get in touch with Nasir Siddiqui - AI automation expert and full-stack developer. Available for freelance projects, collaborations, and professional opportunities.",
    services: "Explore services offered by Nasir Siddiqui: AI Automations, Chatbot Development, Web Development, E-commerce Solutions, API Development, and Technical Consulting.",
    service: "Professional services by Nasir Siddiqui - AI automation expert and full-stack developer specializing in chatbots, automation, and modern web development."
  };
  return descriptions[type as keyof typeof descriptions] || descriptions.home;
}

function getBreadcrumbItems(type: string, baseUrl: string) {
  const breadcrumbs = {
    home: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl }
    ],
    about: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "About", "item": `${baseUrl}/about` }
    ],
    projects: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Projects", "item": `${baseUrl}/projects` }
    ],
    skills: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Skills", "item": `${baseUrl}/skills` }
    ],
    contact: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Contact", "item": `${baseUrl}/contact` }
    ],
    services: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": `${baseUrl}/services` }
    ],
    service: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": `${baseUrl}/services` }
    ]
  };
  return breadcrumbs[type as keyof typeof breadcrumbs] || breadcrumbs.home;
}

export default JsonLdSchema; 