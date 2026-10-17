import React from 'react';
import MainNavbar from '../../components/layout/MainNavbar';
import SubNavbar from '../../components/layout/SubNavbar';
import HeroSection from '../../components/sections/HeroSection';
import CategorySection from '../../components/sections/CategorySection';
import PopularProducts from '../../components/sections/PopularProducts';
import TopTrendingProducts from '../../components/sections/TopTrendingProducts';
import PromoBanner from '../../components/sections/PromoBanner';
import ExploreMoreSection from '../../components/sections/ExploreMoreSection';
import SubscriptionBanner from '../../components/sections/SubscriptionBanner';
import Footer from '../../components/layout/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col font-poppins text-gray-800 bg-[#fdfbf6]">
      <header className="relative z-50 flex flex-col w-full bg-[#fdfbf6]">
        <MainNavbar />
        <SubNavbar />
      </header>
      <main className="flex-1 w-full flex flex-col">
        <HeroSection />
        <CategorySection />
        <PopularProducts />
        <TopTrendingProducts />
        <PromoBanner />
        <ExploreMoreSection />
        <SubscriptionBanner />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
