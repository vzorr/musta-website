// src/app/recommend/page.tsx
'use client';

import Header from '../../components/Header';
import RecommendUstaForm from '../../components/RecommendUstaForm';
import Footer from '../../components/Footer';


export default function RecommendPage() {
;

  return (

      <div className="font-inter bg-myusta-gray text-myusta-navy min-h-screen relative overflow-x-hidden">
        <Header />
        
        <main className="w-full relative">
          <div className="w-full bg-myusta-gray">
            <div className="w-full max-w-[1440px] mx-auto py-12 sm:py-20 px-4 sm:px-8">
              <RecommendUstaForm  />
            </div>
          </div>
        </main>

        <Footer />
      </div>

  );
}