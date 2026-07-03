import React, { useState, useRef, useEffect } from "react";
import { Country, COUNTRIES } from "../utils/phoneValidation";
import { ChevronDown, Check, Search } from "lucide-react";

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === value) || COUNTRIES[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search)
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
        className="flex items-center justify-between gap-1.5 rounded-xl bg-white/5 border border-white/10 px-2.5 py-2.5 sm:px-4 sm:py-3 outline-none focus:border-[#00C6FF] text-white text-sm w-full h-full cursor-pointer hover:bg-white/10 transition duration-200 whitespace-nowrap"
        style={{ minWidth: "88px" }}
      >
        <span className="flex items-center gap-2">
          <span className="text-xl leading-none">{selectedCountry.flag}</span>
          <span className="text-sm font-semibold text-white/90">
            {selectedCountry.code === "GEN" ? "Other" : selectedCountry.dialCode || selectedCountry.code}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-white/50 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#00C6FF]" : ""}`} />
      </button>

      {isOpen && (
        <div className="glass-strong noise absolute top-full left-0 z-50 mt-2 max-h-72 w-[min(280px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0d14] p-1.5 shadow-[0_20px_50px_rgba(0,198,255,0.25)] backdrop-blur-xl animate-fade-in flex flex-col">
          {/* Search Input */}
          <div className="relative mb-1.5 p-1 flex items-center border-b border-white/5">
            <Search className="absolute left-3 h-3.5 w-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/5 pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-[#00C6FF]/40 transition"
            />
          </div>

          {/* List options */}
          <div className="flex-1 overflow-y-auto max-h-48 space-y-0.5 custom-scrollbar">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => {
                const isSelected = c.code === value;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onChange(c.code);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-left text-xs transition duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-gradient-brand text-[#03040A] font-bold shadow-[0_0_15px_rgba(0,198,255,0.2)]"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg leading-none">{c.flag}</span>
                      <span className="font-medium line-clamp-1">{c.name}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className={`text-[10px] ${isSelected ? "text-[#03040A]/70" : "text-white/40"}`}>
                        {c.dialCode}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#03040A]" />}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-white/40">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
