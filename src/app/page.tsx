"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge";

import { ArrowRight, Code2, Play, Sparkles } from "lucide-react";
import { motion, Variants, Easing } from "framer-motion";

const easeOut: Easing = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};


export default function Home() {
  const router = useRouter()
  const { isSignedIn } = useUser()

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/dashboard")
    } else {
      router.push("/signup")
    }
  }
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden flex items-center">
      <div className="container mx-auto px-4 md:px-8 py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            className="order-2 lg:order-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <Badge
                variant="outline"
                className="mb-6 px-4 py-2 border-primary/30 bg-primary/5 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                <span className="text-primary font-medium">Next-Gen Tech Education</span>
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display leading-[1.1] mb-6"
            >
              Building Tech{" "}
              <span className="gradient-text">Leaders</span>{" "}
              of Tomorrow
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed"
            >
              Learn coding and technology skills from industry experts.
              Transform your future with our innovative curriculum designed for all ages.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Button
                size="lg"
                className="group text-lg h-14 px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg h-14 px-8 border-2 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>


          </motion.div>

          {/* Image */}
          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Image Container */}
            <div className="relative">
              {/* Main Image */}
              <motion.div
                className="relative rounded-2xl overflow-hidden glow-effect"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent z-10" />
                <img
                  src="/hero-academy.jpg"
                  alt="Students learning to code in a futuristic classroom"
                  className="w-full h-auto rounded-2xl object-cover aspect-4/3"
                />
              </motion.div>

              {/* Floating Card */}
              <motion.div
                className="absolute -bottom-6 -left-6 glass-effect rounded-xl p-4 shadow-lg z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Live Classes</p>
                    <p className="text-sm text-muted-foreground">Join 500+ active learners</p>
                  </div>
                </div>
              </motion.div>
              {/* Achievement Badge
            <motion.div
              className="absolute -top-4 -right-4 glass-effect rounded-xl p-3 shadow-lg z-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-foreground">#1 Rated</span>
              </div>
            </motion.div> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

