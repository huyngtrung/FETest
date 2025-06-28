'use client';
import Hero from '@/components/Home/Hero/Hero';
import Features from '@/components/Home/Features/Features';
import Testimonials from '@/components/Home/Testimonials/Testimonials';
import { useEffect } from 'react';
import Header from '@/components/Layout/Header/Header';
import Footer from '@/components/Layout/Footer/Footer';

export default function Home() {
  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-animate');
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <div className="scroll-animate">
        <Hero />
      </div>
      <div className="scroll-animate">
        <Features />
      </div>
      <div className="scroll-animate">
        <Testimonials />
      </div>
      <Footer />
    </>
  );
}
