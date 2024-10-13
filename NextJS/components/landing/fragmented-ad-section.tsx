"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Layers, PenTool, Rocket } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

const adStages = [
  {
    title: "Media Monitoring",
    tools: ["Meltwater", "Critical Mention", "DSPolitical"],
    description: "Human-curated, very expensive data, basic insights.",
    icon: Layers,
  },
  {
    title: "Ad Creation & Testing",
    tools: ["Canva", "InDesign", "Google Optimize"],
    description: "Manual creation and slow testing timelines.",
    icon: PenTool,
  },
  {
    title: "Deployment & Iteration",
    tools: ["Google Ads", "Facebook Ads"],
    description: "Complex and bloated ad dashboards.",
    icon: Rocket,
  },
];

export default function FragmentedAdSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative mx-auto py-20 px-6 md:px-8 bg-transparent dark:from-blue-900 dark:to-black"
    >
      <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center"
          >
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Advertising is fragmented.
            </span>
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-lg font-light tracking-tight text-center mt-3 mb-8 sm:mb-16"
          >
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
           There is no truly centralized (and smart) tool.
            </span>
          </motion.h3>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {adStages.map((stage, index) => (
            <AdStageCard key={stage.title} stage={stage} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AdStageCard({ stage, index }: { stage: typeof adStages[number], index: number }) {
  return (
    <div className="bg-white dark:bg-blue-900/20 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <stage.icon className="w-12 h-12 text-blue-500 dark:text-blue-400 mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{stage.title}</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {stage.tools.map((tool) => (
          <span key={tool} className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs rounded-full">
            {tool}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{stage.description}</p>
    </div>
  );
}