"use client";

import { useState, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import Button from "./Button";
import TwoLineTitle from "./TwoLineTitle";
import Description from "./Description";
import Image from "next/image";
import CustomDropdown from "./CustomDropdown";
import styles from "../styles/registeration.module.css";
import containerStyles from "../styles/SectionContainer.module.css";
import RecommendUstaForm from "./RecommendUstaForm";
import Title from "./Title";
import ReCAPTCHA from "react-google-recaptcha";

interface FormData {
  name: string;
  email: string;
  phone: string;
  category: string | string[];
  location: string | string[];
}

export default function WaitlistForm() {
  const { t, language } = useLanguage();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    category: [] as string[],
    location: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [showRecommendForm, setShowRecommendForm] = useState(false);
  const [showCommunitySection, setShowCommunitySection] = useState(true);
  const [showWaitlistForm, setShowWaitlistForm] = useState(true);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.category ||
      !formData.location
    ) {
      setMessage(
        language === "sq"
          ? "Ju lutemi plotësoni të gjitha fushat"
          : "Please fill in all fields"
      );
      setMessageType("error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage(
        language === "sq" ? "Email jo i vlefshëm" : "Invalid email address"
      );
      setMessageType("error");
      return false;
    }

    return true;
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!validateForm()) return;

    const recaptchaToken = recaptchaRef.current?.getValue();

    if (!recaptchaToken) {
      setMessage(
        language === "sq"
          ? "Ju lutemi plotësoni reCAPTCHA"
          : "Please complete reCAPTCHA"
      );
      setMessageType("error");
      return;
    }
    debugger;

    setIsSubmitting(true);
    setMessage("");

    try {
      const validateResponse = await fetch("/api/validateRecaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recaptchaToken }),
      });

      if (!validateResponse.ok) {
        setMessage("reCAPTCHA validation failed");
        setMessageType("error");
        recaptchaRef.current?.reset();
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          language,
          userAgent: navigator.userAgent,
          gdprConsent: true,
          marketingConsent: false,
        }),
      });

      if (response.ok) {
        setMessage(language === "sq" ? "Sukses!" : "Success!");
        setMessageType("success");
        setShowRecommendForm(true);
        setShowCommunitySection(false);
        setShowWaitlistForm(false);
        setShowRegistrationSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          category: "",
          location: "",
        });
      } else {
        setMessage("Registration error");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
      recaptchaRef.current?.reset();
    }
  };

  const categories = [
    { value: "plumber", label: language === "sq" ? "Hidraulik" : "Plumber" },
    {
      value: "electrician",
      label: language === "sq" ? "Elektricist" : "Electrician",
    },
    { value: "painter", label: language === "sq" ? "Bojaxhi" : "Painter" },
    { value: "carpenter", label: language === "sq" ? "Marangoz" : "Carpenter" },
    { value: "tiler", label: language === "sq" ? "Pllakështrues" : "Tiler" },
    { value: "mason", label: language === "sq" ? "Murator" : "Mason" },
    {
      value: "woodworker",
      label: language === "sq" ? "Zdrukthëtar" : "Woodworker",
    },
    { value: "other", label: language === "sq" ? "Tjetër" : "Other" },
  ];

  const locations = [
    { value: "tirana", label: language === "sq" ? "Tiranë" : "Tirana" },
    { value: "durres", label: language === "sq" ? "Durrës" : "Durres" },
    { value: "vlore", label: language === "sq" ? "Vlorë" : "Vlore" },
    { value: "shkoder", label: language === "sq" ? "Shkodër" : "Shkoder" },
    { value: "elbasan", label: language === "sq" ? "Elbasan" : "Elbasan" },
    { value: "korce", label: language === "sq" ? "Korçë" : "Korce" },
    { value: "fier", label: language === "sq" ? "Fier" : "Fier" },
    { value: "berat", label: language === "sq" ? "Berat" : "Berat" },
    { value: "other", label: language === "sq" ? "Tjetër" : "Other" },
  ];

  console.log("showRecommendForm state:", showRecommendForm);
  console.log("showCommunitySection state:", showCommunitySection);

  return (
    <section id="waitlist" className="bg-myusta-gray relative z-10">
      <div className="max-w-[1000px] mx-auto">
        {/* Register Today Section */}
        {showWaitlistForm && (
          <div className="text-center">
            <div className="">
              <TwoLineTitle
                firstLine={
                  language === "sq" ? "Regjistrohu Sot." : "Register Today."
                }
                secondLine={language === "sq" ? "Është Falas!" : "It's Free!"}
                firstLineBold={false}
                secondLineBold={true}
                as="h2"
                centered={true}
                className="section-title"
              />
            </div>

            <div className="mx-auto w-full small:min-w-[400px] max-w-[400px]">
              <div className="neumorphic-card p-5 mobile:p-8  rounded-2xl bg-myusta-gray relative z-20">
                <div
                  className="!mb-5 text-xl font-semibold text-myusta-navy  mobile:!mb-8 text-center"
                  style={{ lineHeight: "100%" }}
                  dangerouslySetInnerHTML={{
                    __html:
                      language === "sq"
                        ? "Plotësoni informacionet <br /> e mëposhtme"
                        : "Fill out the following<br />information below.",
                  }}
                />

                {message && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      messageType === "success"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleWaitlistSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={language === "sq" ? "Emri" : "Name"}
                    className="neumorphic-input appearance-none w-full p-3 rounded-lg border-0 text-myusta-navy focus:outline-none bg-myusta-gray"
                    required
                    maxLength={100}
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={
                      language === "sq" ? "Numri i Telefonit" : "Phone Number"
                    }
                    className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy focus:outline-none bg-myusta-gray"
                    required
                    maxLength={20}
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={language === "sq" ? "E-Mail" : "E-Mail"}
                    className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy focus:outline-none bg-myusta-gray"
                    required
                    maxLength={150}
                  />

                  <CustomDropdown
                    options={categories}
                    value={formData.category}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                    placeholder={language === "sq" ? "Kategoria" : "Category"}
                    name="category"
                    required
                    multiple={true}
                  />

                  <CustomDropdown
                    options={locations}
                    value={formData.location}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, location: value }))
                    }
                    placeholder={language === "sq" ? "Vendndodhja" : "Location"}
                    name="location"
                    required
                    multiple={true}
                  />

                  <div
                    style={{
                      margin: "20px 0",
                      display: "flex",
                      justifyContent: "center",
                      minHeight: "78px",
                    }}
                  >
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      size="normal"
                      sitekey="6LfiPAosAAAAAAPqLMu7_KSBxsqaOOX93qZNL40L"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    fullWidth
                    loading={isSubmitting}
                    className="!mt-5 text-myusta-navy font-semibold text-lg rounded-lg mobile:!mt-8"
                  >
                    {isSubmitting
                      ? language === "sq"
                        ? "Po regjistrohet..."
                        : "Registering..."
                      : language === "sq"
                      ? "Futu tek Lista e Pritjes!"
                      : "Join the Waitlist!"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}

        {showRegistrationSuccess && (
          <div className="text-center max-w-2xl mx-auto mb-[32px] mt-[48px] mobile:mt-[64px] mobile:mb-[48px]">
            {/* Tick Icon */}
            <div className="mb-6 flex justify-center">
              <Image
                src="/assets/tick.svg"
                alt="Success"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>

            {/* Heading */}
            <h2
              className="text-[20px] mobile:text-[32px]  text-myusta-navy  font-semibold mb-4"
              style={{ lineHeight: "100%" }}
            >
              {language === "sq" ? "Sukses!" : "Success!"}
            </h2>

            {language === "sq" ? (
              <>
                <div className="text-[14px] mobile:text-base text-center  text-[#868686] font-normal">
                  <p className=" hidden mobile:block">
                    Faleminderit që jeni pjesë e komunitetit tonë në listën e{" "}
                    <br /> pritjes. Do ju mbajmë të informuar me përditësime dhe{" "}
                    <br /> informacione ekskluzive.
                  </p>
                  <p className="block mobile:hidden  ">
                    Faleminderit që jeni pjesë e komunitetit tonë në <br />{" "}
                    listën e pritjes. Do ju mbajmë të informuar me <br />{" "}
                    përditësime dhe informacione ekskluzive.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-[14px] mobile:text-base text-center  text-[#868686] font-normal">
                  <p className=" hidden mobile:block">
                    Thank you for being part of our waitlist community. We'll{" "}
                    <br /> keep you informed with updates, launch dates, and{" "}
                    <br /> exclusive news.
                  </p>

                  <p className="block mobile:hidden ">
                    Thank you for being part of our waitlist <br /> community.
                    We'll keep you informed with updates, <br /> launch dates,
                    and exclusive news.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        <div className={`${showRecommendForm ? "mt-0" : " "} `}>
          <div className="max-w-[1000px] mx-auto">
            <div
              style={{ lineHeight: "100%" }}
              className="text-[24px] mobile:[32px] md:text-[40px] lg:text-[48px]  font-normal text-myusta-navy section-title-description text-center"
            >
              <p className="font-normal ">
                {language === "sq" ? "Ndihmo në rritjen e" : "Help us Grow"}
              </p>
              <p className="font-bold">
                {language === "sq" ? "Komunitetit!" : "the Community!"}
              </p>
            </div>
          </div>
          <div className="mb-6 text-center">
            {language === "sq" ? (
              <>
                <div>
                  <p className=" text-sm text-center md:text-base block mobile:hidden font-normal text-[#898888]">
                    Njihni ndonjë Usta që do të përfitojë <br /> nga mundësitë e
                    punës?
                  </p>
                  <p className=" text-sm md:text-base text-center hidden mobile:block font-normal whitespace-nowrap text-[#898888]">
                    Njihni ndonjë Usta që do të përfitojë nga mundësitë e punës?
                  </p>
                </div>
                <p className=" text-sm text-center md:text-base font-normal text-[#898888]">
                  Rekomandojeni më poshtë.
                </p>
              </>
            ) : (
              <>
                <div>
                  {/* Mobile / small screens (lg se chhoti screens) */}
                  <p className=" text-sm text-center md:text-base block mobile:hidden font-normal text-[#898888]">
                    Know a fellow Usta who would benefit <br /> from job
                    opportunities?
                  </p>

                  {/* Large screens and above */}
                  <p className=" text-sm md:text-base text-center hidden mobile:block font-normal whitespace-nowrap text-[#898888]">
                    Know a fellow Usta who would benefit from job opportunities?
                  </p>
                </div>

                <p className=" text-sm text-center md:text-base font-normal text-[#898888]">
                  Recommend them below.
                </p>
              </>
            )}
          </div>
          <div className="">
            {!showRecommendForm ? (
              <div className="max-w-[1000px] mx-auto text-center">
                <div className="w-full flex justify-center">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowRecommendForm(true);
                      setShowCommunitySection(false);
                      setShowWaitlistForm(false);
                    }}
                    variant="primary"
                    className="text-myusta-navy font-semibold text-lg rounded-lg w-[207px] h-[44px]"
                  >
                    {language === "sq" ? "Rekomando Usta" : "Recommend an Usta"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center w-full small:max-w-[400px] small:min-w-[400px] text-center  mx-auto">
                <RecommendUstaForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
