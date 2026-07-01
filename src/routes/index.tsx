import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import LiquidEther from "@/components/LiquidEther";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aether — The Future of Digital Wealth" },
      { name: "description", content: "Institutional crypto investing for people who move markets. Enter the advanced financial operating system." },
      { property: "og:title", content: "Aether — The Future of Digital Wealth" },
      { property: "og:description", content: "Institutional-grade crypto investing, AI portfolios, and tokenization for market movers." },
    ],
  }),
  component: Index,
});

function Index() {
