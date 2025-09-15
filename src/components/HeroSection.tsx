// src/components/HeroSection.tsx
"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Hero background failed to load");
    };
    img.src = "/assets/hero-bg.svg";
  }, []);

  const scrollToRecommend = () => {
    const element = document.getElementById("recommend");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="h-[600px] w-full flex items-start"
      style={{
        backgroundImage: "url(/assets/hero-section-images/bg-image.png)",
        backgroundRepeat: "repeat-x",
        backgroundSize: "200px 600px",
      }}
    >
      <div className="max-w-[1280px] w-full mx-auto relative mt-8">
        <div className="absolute top-7 left-0">
          <img
            className="w-[411px] h-[493px] object-contain"
            src="/assets/hero-section-images/mobile-english.png"
            alt="phone-left"
          />
        </div>

        <div className="absolute top-32 left-[48%] -translate-x-1/2 text-center max-w-[500px]">
          <h1
            style={{ lineHeight: "1" }}
            className="text-[64px] font-bold tracking-tight text-[#00203F]"
          >
            {t("hero.title")}
          </h1>
          <p className="text-[20px] my-5  mx-auto text-[#335372]">
            {t("hero.subtitle")}
          </p>
          <div className="flex justify-center">
            <button
              className="bg-[#FFD700] text-[#00203F]  px-6 py-2 rounded-[8px] cursor-pointer"
              onClick={scrollToRecommend}
            >
              <span className="font-medium">{t("hero.cta1")}</span>
              <span className="font-semibold">{t("hero.cta2")}</span>
            </button>
          </div>
        </div>

        <div className="absolute top-2 -right-10">
          <img
            className="w-[810px] h-[567px] object-contain"
            src="/assets/hero-section-images/usta-hero-image.png"
            alt="phone-right"
          />
        </div>
      </div>
    </div>
  );
}
