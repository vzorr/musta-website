// src/app/legal/page.tsx - Combined Terms & Conditions and Privacy Policy page
'use client';

import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Title from '../../components/Title';
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext';

export default function LegalPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-myusta-gray text-myusta-navy min-h-screen relative overflow-x-hidden">
      <Header />

      <main className="w-full relative">
        <div className="w-full bg-myusta-gray">
          <div className="w-full max-w-[1000px] mx-auto global-main-page pt-[32px] pb-[48px] mobile:pt-[48px] mobile:pb-[48px]">

            {/* Breadcrumb */}
            <nav className="mobile:mb-[64px] mb-[32px] text-sm mobile:text-base ">
              <a href="/" className="text-[#868686] hover:text-myusta-yellow transition-colors">{t("terms.breadcrumb.home")}</a>
              <span className="ml-2 mr-0.5 text-myusta-navy">/</span>
              <span className="text-myusta-navy font-semibold ">{t("terms.breadcrumb.termsAndConditions")}</span>
            </nav>

            {/* Main Title */}
            <Title
              firstText={t("terms.title.first")}
              secondText={t("terms.title.second")}
              as="h1"
              centered={true}
              className="text-[28px] mobile:text-[48px] font-bold "
            />

            {/* Terms & Conditions Section */}
            <div className="mb-4 mt-8 mobile:mt-12">
              <h2 className="text-[20px] mobile:text-[24px] font-semibold mb-4 text-myusta-navy">{t("terms.welcome.title")}</h2>
              <p className="text-sm mobile:text-base mb-5 mobile:mb-6 text-light-gray-text ">
                {t("terms.welcome.description")}
              </p>

              {/* Divider after Welcome section */}
              <div className="w-full h-[1px] bg-[#D3D3D3] mb-5 mobile:mb-6"></div>

              <h3 className="text-[20px] mobile:text-[24px] font-semibold mb-4 mobile:mb-5 text-myusta-navy">{t("terms.sections.joiningWaitlist.title")}</h3>
              <p className="text-sm mobile:text-base text-light-gray-text ">
                {t("terms.sections.joiningWaitlist.description")}
              </p>
              <ul className="list-disc pl-6 text-sm mobile:text-base text-light-gray-text space-y-1">
                <li>{t("terms.sections.joiningWaitlist.points.0")}</li>
                <li>{t("terms.sections.joiningWaitlist.points.1")}</li>
                <li>{t("terms.sections.joiningWaitlist.points.2")}</li>
              </ul>
              <p className="text-sm mobile:text-base text-light-gray-text mb-4 mobile:mb-5">
                {t("terms.sections.joiningWaitlist.note")}
              </p>

              <h3 className="text-[20px] mobile:text-[24px] font-semibold mb-4 mobile:mb-5 text-myusta-navy">{t("terms.sections.intellectualProperty.title")}</h3>
              <p className="text-sm mobile:text-base text-light-gray-text mb-4 mobile:mb-5">
                {t("terms.sections.intellectualProperty.description")}
              </p>

              <h3 className="text-[20px] mobile:text-[24px] font-semibold mb-4 mobile:mb-5 text-myusta-navy">{t("terms.sections.noWarranties.title")}</h3>
              <p className="text-sm mobile:text-base text-light-gray-text mb-4 mobile:mb-5">
                {t("terms.sections.noWarranties.description")}
              </p>

              <h3 className="text-[20px] mobile:text-[24px] font-semibold mb-4 mobile:mb-5 text-myusta-navy">{t("terms.sections.limitationOfLiability.title")}</h3>
              <p className="text-sm mobile:text-base text-light-gray-text ">
                {t("terms.sections.limitationOfLiability.description")}
              </p>
              <ul className="list-disc pl-6 text-light-gray-text space-y-1">
                <li>{t("terms.sections.limitationOfLiability.points.0")}</li>
                <li>{t("terms.sections.limitationOfLiability.points.1")}</li>
                <li>{t("terms.sections.limitationOfLiability.points.2")}</li>
              </ul>
            </div>

            {/* Privacy Policy Section */}
            <div className="mt-12">
              <h2 className="text-[20px] mobile:text-[24px] font-semibold mb-4 text-myusta-navy">{t("terms.privacyPolicy.title")}</h2>
              <p className="text-sm mobile:text-base mb-5 mobile:mb-6 text-light-gray-text ">
                {t("terms.privacyPolicy.description")}
              </p>

              <div className="w-full h-[1px] bg-[#D3D3D3] mb-5 mobile:mb-6"></div>

              <h3 className="text-[20px] mobile:text-[24px] font-semibold mb-4 mobile:mb-5 text-myusta-navy">{t("terms.privacyPolicy.sections.whatWeCollect.title")}</h3>
              <p className="text-sm mobile:text-base text-light-gray-text ">
                {t("terms.privacyPolicy.sections.whatWeCollect.description")}
              </p>
              <ul className="list-disc pl-6 text-sm mobile:text-base text-light-gray-text space-y-1">
                <li>{t("terms.privacyPolicy.sections.whatWeCollect.points.0")}</li>
                <li>{t("terms.privacyPolicy.sections.whatWeCollect.points.1")}</li>
                <li>{t("terms.privacyPolicy.sections.whatWeCollect.points.2")}</li>
              </ul>
              <p className="text-sm mobile:text-base text-light-gray-text mb-4 mobile:mb-5">
                {t("terms.privacyPolicy.sections.whatWeCollect.note")}
              </p>

              <h3 className="text-[20px] mobile:text-[24px] font-semibold mb-4 mobile:mb-5 text-myusta-navy">{t("terms.privacyPolicy.sections.howWeUseInfo.title")}</h3>
              <p className="text-sm mobile:text-base text-light-gray-text ">
                {t("terms.privacyPolicy.sections.howWeUseInfo.description")}
              </p>
              <ul className="list-disc pl-6 text-sm mobile:text-base text-light-gray-text space-y-1">
                <li>{t("terms.privacyPolicy.sections.howWeUseInfo.points.0")}</li>
                <li>{t("terms.privacyPolicy.sections.howWeUseInfo.points.1")}</li>
                <li>{t("terms.privacyPolicy.sections.howWeUseInfo.points.2")}</li>
              </ul>
              <p className="text-sm mobile:text-base text-light-gray-text mb-4 mobile:mb-5">
                {t("terms.privacyPolicy.sections.howWeUseInfo.note")}
              </p>

              <h3 className="text-[20px] mobile:text-[24px] font-semibold mb-4 mobile:mb-5 text-myusta-navy">{t("terms.privacyPolicy.sections.dataStorage.title")}</h3>
              <p className="text-sm mobile:text-base text-light-gray-text mb-4 mobile:mb-5">
                {t("terms.privacyPolicy.sections.dataStorage.description")}
              </p>

              <h3 className="text-[20px] mobile:text-[24px] font-semibold mb-4 mobile:mb-5 text-myusta-navy">{t("terms.privacyPolicy.sections.yourRights.title")}</h3>
              <p className="text-sm mobile:text-base text-light-gray-text ">
                {t("terms.privacyPolicy.sections.yourRights.description")}
              </p>
              <ul className="list-disc pl-6 text-sm mobile:text-base text-light-gray-text space-y-1">
                <li>{t("terms.privacyPolicy.sections.yourRights.points.0")}</li>
                <li>{t("terms.privacyPolicy.sections.yourRights.points.1")}</li>
                <li>{t("terms.privacyPolicy.sections.yourRights.points.2")}</li>
              </ul>

              <h3 className="text-[20px] mobile:text-[24px] font-semibold mb-4 mobile:mb-5 text-myusta-navy">{t("terms.privacyPolicy.sections.cookiesAnalytics.title")}</h3>
              <p className="text-sm mobile:text-base text-light-gray-text mb-4 mobile:mb-5">
                {t("terms.privacyPolicy.sections.cookiesAnalytics.description")}
              </p>

              <h3 className="text-[20px] mobile:text-[24px] font-semibold mb-4 mobile:mb-5 text-myusta-navy">{t("terms.privacyPolicy.sections.futureChanges.title")}</h3>
              <p className="text-sm mobile:text-base text-light-gray-text">
                {t("terms.privacyPolicy.sections.futureChanges.description")}
              </p>
            </div>

            {/* Footer Message */}
            <div className="">
              <p className="text-sm mobile:text-base text-light-gray-text">
                {t("terms.footerMessage1")}
              </p>
              <p className="text-sm mobile:text-base text-light-gray-text">
                {t("terms.footerMessage2")}
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}