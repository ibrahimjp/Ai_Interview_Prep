"use client";
import React from "react";
import { Image } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
gsap.registerPlugin(useGSAP);
const Header = () => {
  const path = usePathname(); 
  
  return (
    <div className="flex p-4 items-center justify-between shadow-md bg-[#2b2a2a]">
      <img src={"/logo.png"} width={50} height={50} alt="logo"/>
      <ul className="hidden md:flex gap-6">
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer ${path === "/dashboard" && "font-bold text-purple-800"}`}>
          DashBoard
        </li>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer ${path === "/dashboard/questions" && "font-bold text-purple-800"}`}>
          Questions
        </li>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer ${path === "/dashboard/upgrade" && "font-bold text-purple-800"}`}>
          Upgrade
        </li>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer ${path === "/dashboard/how" && "font-bold text-purple-800"}`}>
          How It Works ?
        </li>
      </ul>
      <UserButton />
    </div>
  );
};

export default Header;