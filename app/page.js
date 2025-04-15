
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "../@/components/ui/button";
gsap.registerPlugin(useGSAP);
export default function Home() {
  useGSAP(() => {
    gsap.from("body", {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.6,
    });
  }, []);
  
  return (
    <div>
      Hello
      <Button>Button</Button>
    </div>
  );
}
