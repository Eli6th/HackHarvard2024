"use client";

import React from "react";
import TextShimmer from "@/components/magicui/text-shimmer";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, DashboardIcon } from "@radix-ui/react-icons";
import HeroVideo from "@/components/magicui/hero-video";
import { CloudLightning } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  return (
    <section
      id="hero"
      className="relative mx-auto mt-16 sm:mt-32 max-w-[80rem] px-4 sm:px-6 text-center md:px-8"
    >
      <div onClick={() => router.push("/dashboard")} className="backdrop-filter-[12px] inline-flex h-auto py-2 sm:h-7 items-center justify-between rounded-full border border-blue-200/30 bg-blue-100/20 px-3 sm:px-5 text-sm sm:text-md text-blue-500 dark:text-blue-200 transition-all ease-in hover:cursor-pointer hover:bg-blue-200/30 group translate-y-[-1rem] animate-fade-in opacity-0">
        <TextShimmer className="inline-flex items-center justify-center space-x-2">
          <DashboardIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>We&apos;re live at /research</span>
          <ArrowRightIcon className="w-2 h-2 sm:w-3 sm:h-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </TextShimmer>
      </div>
      <h1 className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms] mt-4">
        <span className="flex flex-col sm:flex-row items-center justify-center">
          <CloudLightning className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-2 sm:mb-0 sm:mr-4 text-blue-500 dark:text-blue-400" />
          <span className="bg-gradient-to-br from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-600 bg-clip-text py-2 sm:py-6 text-4xl sm:text-5xl font-medium leading-none tracking-tighter text-transparent text-balance md:text-7xl lg:text-8xl">
            Lightspeed Ads
          </span>
        </span>
        <span className="p-2 sm:p-3 bg-gradient-to-br from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-xl sm:text-3xl md:text-4xl lg:text-6xl font-medium leading-tight tracking-tighter text-transparent text-balance block mt-4 sm:mt-2">
          a single AI workflow for political media monitoring, PR, & advertising teams.
        </span>
      </h1>
      <Button onClick={() => router.push("/research")} className="mt-8 sm:mt-[55px] translate-y-[-1rem] animate-fade-in gap-1 rounded-lg text-white opacity-0 ease-in-out [--animation-delay:600ms] bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 dark:bg-white dark:text-black dark:hover:bg-gray-200">
        Check out our public demo!
        <ArrowRightIcon className="ml-1 size-3 sm:size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
      </Button>
      <HeroVideo
        animationStyle="from-center"
        videoSrc="/"
        thumbnailSrc="/"
        thumbnailAlt="Hero Video Thumbnail"
        className="w-full mt-8 sm:mt-12"
      />
    </section>
  );
}
