"use client";
import React from "react";
import Hero from "./Hero";
import Journey from "./Journey";
import Footer from "../layout/Footer";
import SuccessStories from "./SuccessStories";

interface HomeProps {
  onStart: () => void;
  onExploreLibrary: () => void;
}

export default function Home({ onStart, onExploreLibrary }: HomeProps) {
  return (
    <div className="w-full flex flex-col">
      <Hero onStart={onStart} onExploreLibrary={onExploreLibrary} />
      <Journey />
      <SuccessStories />
      <Footer />
    </div>
  );
}