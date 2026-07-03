import React from "react";
import logoImg from "@/assets/logonew.png";

interface LogoProps {
  className?: string;
  glow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8", glow = true }) => {
  return (
    <img
      src={logoImg}
      className={`${className} object-contain ${glow ? "filter drop-shadow-[0_0_8px_rgba(0,198,255,0.45)]" : ""}`}
      alt="Zyvora Finance Logo"
    />
  );
};
