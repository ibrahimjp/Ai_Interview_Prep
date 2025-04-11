"use client";
import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function CustomSignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-tr from-[#19223e] via-[#18323a] to-[#29345f]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl  rounded-3xl p-8 sm:p-12  text-white"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">🚀 Welcome to AI Interview Prep</h1>
        <p className="text-center mb-6 text-sm text-gray-300">
          Sign in to supercharge your prep journey.
        </p>
        <div className="ml-10 space-y-4">
          <SignIn
/>
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">
          Secured with <span className="text-white font-semibold">Clerk</span>
        </p>
      </motion.div>
    </div>
  );
}
