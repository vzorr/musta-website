// src/components/Header.tsx - ✅ UPDATED with Button Component
"use client";

import { useLanguage } from "../contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import Button from "./Button";
import Link from "next/link";
import styles from "../styles/Header.module.css";

export default function Header() {
  const { language } = useLanguage();

  const scrollToRegistration = () => {
    if (window.location.pathname === "/") {
      const element = document.getElementById("waitlist");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = "/#waitlist";
    }
  };

  return (
    <div className={styles.headerWrapper}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* Language Selector */}
          <div className="w-[97px]  flex items-center">
            <LanguageSwitcher />
          </div>

          {/* Logo - Centered and Clickable */}
          <div className={styles.centerSection}>
            <Link href="/" className="cursor-pointer">
              <Logo
                variant="custom"
                width={118}
                height={40}
                className="lg:w-[118px] lg:h-[40px] w-[118px] h-[32px]"
              />
            </Link>
          </div>

          {/* Register Button */}
          <div className={styles.rightSection}>
            
            <Button
              variant="primary"
              size="small"
              onClick={scrollToRegistration}
              className={styles.ctaButton}
            >
              {language === "sq" ? "Regjistrohu" : "Register"}
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
