"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Sparkles, RefreshCw, Rocket, BarChart2, MessageSquare, Target, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const featureGroups = [
  {
    title: "Research",
    features: [
      { href: "/research", title: "Real-time Insights", description: "Aggregate voter sentiment from social media and current events.", icon: TrendingUp },
      { href: "/research", title: "Social Listening", description: "Monitor conversations on TikTok, Threads, and Reddit for voter opinions.", icon: MessageSquare },
    ]
  },
  {
    title: "Create",
    features: [
      { href: "/create/generate", title: "AI Ad Creation", description: "Generate ad suggestions based on trending topics and successful campaigns.", icon: Sparkles },
      { href: "/create/ideation", title: "Targeted Messaging", description: "Craft messages that resonate with specific voter segments.", icon: Target },
    ]
  },
  {
    title: "Test",
    features: [
      { href: "/create/testing", title: "Rapid A/B Testing", description: "Quickly test and iterate on ad variations for maximum impact.", icon: RefreshCw },
      { href: "/dashboard", title: "Analytics", description: "Track and analyze ad performance with detailed insights.", icon: BarChart2 },
    ]
  },
  {
    title: "Deploy",
    features: [
      { href: "/deployment", title: "Multi-Platform", description: "Seamlessly deploy ads across Google, Meta, and other platforms.", icon: Rocket },
      { href: "/dashboard", title: "Automation", description: "Streamline your ad creation process with AI-powered assistance.", icon: Zap },
    ]
  }
];


export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative mx-auto py-20 px-6 md:px-8 bg-transparent"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-4xl font-bold tracking-tight text-center"
        >
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Make smarter political ads
          </span>
          <br />
          <span className="text-gray-800 dark:text-gray-200">faster and cheaper</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-8 md:gap-y-16"
        >
          {featureGroups.map((group, index) => (
            <FeatureGroup key={group.title} group={group} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureGroup({ group, index }: { group: typeof featureGroups[number], index: number }) {
  const router = useRouter();

  const containerVariants = {
    initial: {},
    whileHover: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="relative space-y-1">
      <h3 className="z-10 absolute top-0 left-4 -translate-y-3/4 text-xs font-medium px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-t-md shadow-sm">
        {group.title}
      </h3>
      <motion.div
        variants={containerVariants}
        initial="initial"
        whileHover="whileHover"
        className="z-20 relative h-full w-full transform-gpu overflow-hidden rounded-lg bg-gradient-to-br from-blue-50/10 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)]"
      >
        <div className="p-6">
          <div className="space-y-4">
            {group.features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} router={router} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ feature, router }: { feature: typeof featureGroups[number]["features"][number], router: ReturnType<typeof useRouter> }) {
  const cardVariants = {
    initial: { y: 0, opacity: 0.8 },
    whileHover: {
      y: -3,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group cursor-pointer bg-white/50 dark:bg-blue-900/10 rounded-md p-3 transition-all duration-200 ease-in-out shadow-[0_4px_10px_rgb(0,0,0,0.08)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_20px_rgb(59,130,246,0.2)] dark:hover:shadow-[0_4px_20px_rgba(59,130,246,0.2)]"
      onClick={() => router.push(feature.href)}
    >
      <div className="flex items-center space-x-3 mb-1">
        <feature.icon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        <h4 className="text-base text-blue-700 dark:text-blue-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{feature.title}</h4>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 ml-8">{feature.description}</p>
    </motion.div>
  );
}
