// src/components/HeroSection.tsx
"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import styles from '../styles/HeroSection.module.css';

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
    <section
      className={`w-full flex items-start 
                tablet:h-[460px] xl:h-[600px] 
                ${styles.heroBg}`}
      style={{
        backgroundImage: "url(/assets/hero-section-images/bg-image.png)",
        backgroundSize: "200px 600px",
        backgroundRepeat: "repeat-x",

      }}
    >

      <div className="max-w-[1280px] w-full mx-auto relative xl:mt-8 tablet:mt-4 flex flex-col items-center justify-center tablet:flwx-none">
        <div className="xl:absolute xl:top-7 xl:left-0 hidden xl:block">
          <img
            className="w-[411px] h-[493px] object-contain"
            src="/assets/hero-section-images/mobile-english.png"
            alt="phone-left"
          />
        </div>

        <div className="tablet:absolute tablet:top-16 xl:top-32 tablet:left-[40%] tablet:-translate-x-1/2
        
        xl:left-[48%] xl:-translate-x-1/2 text-center xl:max-w-[500px] tablet:max-w-[440px]
        ">
          <h1
            style={{ lineHeight: "1" }}
            className="xl:text-[64px] mt-8 tablet:mt-0 tablet:text-[48px] text-[32px]  font-bold tracking-tight text-[#00203F]"
          >
            {t("hero.title")}
          </h1>
          <p className="xl:text-[20px] text-sm tablet:text-base my-5  mx-auto text-[#335372]">
            {t("hero.subtitle")}
          </p>
          <div className="flex justify-center">
            <button
              className="bg-[#FFD700] text-[#00203F] text-base  px-6 py-2 rounded-[8px] cursor-pointer"
              onClick={scrollToRecommend}
            >
              <span className="font-medium">{t("hero.cta1")}</span>
              <span className="font-semibold">{t("hero.cta2")}</span>
            </button>
          </div>
        </div>

        <div className="-mt-8 sm:-mt-14 tablet:mt-0 tablet:absolute tablet:top-12 xl:top-2 xl:-right-10  tablet:-right-10">
          <img
            className="xl:w-[810px] xl:h-[567px] tablet:w-[561px] tablet:h-[393px] object-contain"
            src="/assets/hero-section-images/usta-hero-image.png"
            alt="phone-right"
          /> 
        </div>
      </div>
    </section>
  );
}
