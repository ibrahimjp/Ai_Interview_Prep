
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "../@/components/ui/button";
gsap.registerPlugin(useGSAP);
export default function Home() {
  return (
    <div className="flex justify-center items-center mt-50">
<div class="card ">
  <div class="banner">
    <span class="banner-text">Let's</span>
    <span class="banner-text">Get Started</span>
  </div>
  <span class="card__title">Ai Interview Preparation</span>
  <p class="card__subtitle">Get Ready For Your Interviews.</p>
    <a href="/dashboard">
    <button class="sign-up">Start</button>
    </a>
</div>

<video
  className="background-video"
  src="/anime.mp4"
  autoPlay
  loop
  muted
  playsInline
/>
    </div>
  );
}
