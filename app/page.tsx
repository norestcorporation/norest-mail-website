"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { FaApple, FaGooglePlay, FaYoutube, FaTwitter, FaInstagram, FaFacebook, FaArrowRight, FaInfoCircle } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  const promotionalTexts = [
    "Free branded mail for your business",
    "Unlimited custom domains included",
    "Pay only for the storage you use",
    "Professional email at your own domain",
    "No hidden fees or surprise charges"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promotionalTexts.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const bgStyle = {
    // backgroundImage: "url('https://images.unsplash.com/photo-1689028293838-a6a66b0ae2c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDc1fHx8ZW58MHx8fHx8')",
    backgroundImage: "url('https://plus.unsplash.com/premium_photo-1770818235482-4f60a13b1b53?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3MHx8fGVufDB8fHx8fA%3D%3D')",
    backgroundColor: "#0a0e14",
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
    backgroundPosition: "center"
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white font-sans text-black">
      {/* Hero Wrapper - Exact 100vh */}
      <div className="flex flex-col h-screen w-full overflow-hidden shrink-0 bg-black">
        {/* Top Hero Section */}
        <section className="relative w-full flex-1 min-h-0 overflow-hidden" style={bgStyle}>

          {/* Navbar */}
          <motion.nav
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 right-0 w-full z-50 p-6 md:px-12 flex justify-between items-center max-w-[1600px] mx-auto"
          >
            {/* Left: Logo */}
            <div className="flex items-center w-1/4 gap-3">
              <Image
                src="/logo/logo-01.png"
                alt="Norest Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-white font-medium text-base tracking-normal" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>mail.norest.in</span>
            </div>

            {/* Center: Nav Links */}
            <div className="hidden md:flex items-center justify-center gap-8 w-2/4">
              <a href="#" className="text-white/80 hover:text-white font-medium text-sm transition-colors">Overview</a>
              <a href="#" className="text-white/80 hover:text-white font-medium text-sm transition-colors">Features</a>
              <a href="#" className="text-white/80 hover:text-white font-medium text-sm transition-colors">Privacy</a>
              <a href="#" className="text-white/80 hover:text-white font-medium text-sm transition-colors">Apps</a>
              <a href="#" className="text-white/80 hover:text-white font-medium text-sm transition-colors">Pricing</a>
            </div>

            {/* Right: Actions */}
            <div className="hidden md:flex items-center justify-end gap-6 w-1/4">
              <a href="/account/sign-in" className="text-white/80 hover:text-white font-medium text-sm transition-colors">Sign in</a>
              <button 
                onClick={() => router.push('/account/create')}
                className="cursor-pointer bg-white text-black px-5 py-2 rounded-full font-semibold text-sm shadow-sm hover:bg-white/80 transition-colors"
              >
                Create Account
              </button>
            </div>
          </motion.nav>

          {/* Semi-transparent white overlay to create the frosted effect */}
          <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-md" />



          <motion.div
            initial={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-30 flex flex-col justify-end h-full w-full pb-2"
          >
            {/* Small text on the right - left aligned but pushed right */}
            <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 mb-6 sm:mb-10">
              <div className="ml-auto w-full max-w-[420px]">
                <p className="text-white text-lg sm:text-xl md:text-2xl font-medium leading-snug tracking-tight text-left drop-shadow-md">
                  A modern email experience<br />
                  built around privacy, clarity,<br />
                  and the way people communicate<br />
                  every day.
                </p>
              </div>
            </div>

            {/* Promotional Text */}
            <div className="w-full flex justify-start px-6 md:px-10 mb-3 sm:mb-6 relative z-50 h-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPromoIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-white text-sm md:text-base font-medium tracking-wide absolute"
                >
                  {promotionalTexts[currentPromoIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <div className="w-full flex justify-start px-6 md:px-10 mb-4 sm:mb-8 relative z-50 gap-4">
              <button 
                onClick={() => router.push('/account/create')}
                className="group cursor-pointer select-none relative flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold text-[13px] tracking-wide hover:scale-105 transition-all duration-300"
              >
                <span className="pointer-events-none">Get Started</span>
                <span className="flex items-center justify-center pointer-events-none bg-gray-100 rounded-full w-5 h-5 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3 transition-transform duration-300" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </button>
              <button 
                onClick={() => router.push('/account/create/custom-domain/config')}
                className="group cursor-pointer select-none relative flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold text-[13px] tracking-wide hover:scale-105 transition-all duration-300"
              >
                <span className="pointer-events-none">Connect Custom Domain</span>
                <span className="flex items-center justify-center pointer-events-none bg-gray-100 rounded-full w-5 h-5 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3 transition-transform duration-300" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </button>
            </div>

            {/* Big "Performance" Text */}
            <div className="w-full flex justify-start px-4 pointer-events-none select-none">
              <h1
                className="text-[16vw] leading-[0.75] font-bold tracking-tighter pointer-events-none select-none"
                style={{
                  ...bgStyle,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.15))"
                }}
              >
                Norest Mail
              </h1>
            </div>
          </motion.div>
        </section>

        {/* Bottom Text Section */}
        <section className="w-full shrink-0 bg-white flex items-center px-6 md:px-12 py-6 md:py-8 h-[25vh]">
          <motion.p
            initial={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[4vw] md:text-[3.5vw] lg:text-[3vw] font-semibold tracking-tighter leading-[1.1] max-w-[1400px] mx-auto w-full text-black"
          >
            In a world crowded by noise, we choose focus. <br className="hidden md:block" />
            Norest Mail keeps communication simple, secure, <br className="hidden md:block" />
            and intentional - not overwhelming or intrusive.
          </motion.p>
        </section>
      </div>

      {/* Section 2 — Email, without the noise (Masonry Grid Replica - Light Theme) */}
      <section className="relative w-full bg-white text-black py-24 px-6 md:px-12 flex flex-col items-center font-sans">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
            Email, without the noise
          </h2>
          <p className="text-gray-600 text-sm md:text-base font-medium">
            Everything you need. Nothing that gets in the way.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">

          {/* Column 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col gap-4 md:gap-5"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col justify-between h-[300px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-5xl lg:text-6xl font-medium tracking-tight text-black">Focused</h3>
              <p className="text-gray-600 text-sm font-medium">Important conversations stay visible while distractions remain completely out of the way.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col justify-between h-[280px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-5xl lg:text-6xl font-medium tracking-tight text-black">Secure</h3>
              <p className="text-gray-600 text-sm font-medium">Your communication is protected with thoughtful security and transparent privacy controls.</p>
            </div>
          </motion.div>

          {/* Column 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-4 md:gap-5"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col justify-between h-[340px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-5xl lg:text-6xl font-medium tracking-tight text-black">Instant</h3>
              <p className="text-gray-600 text-sm font-medium">Find messages, contacts, attachments, and conversations instantly without digging.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col justify-between h-[240px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-5xl lg:text-6xl font-medium tracking-tight text-black">Unified</h3>
              <p className="text-gray-600 text-sm font-medium">Move seamlessly between mobile, desktop, and web platforms without losing context.</p>
            </div>
          </motion.div>

          {/* Column 3 (Tall Graphic Card) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-b from-black via-black to-black rounded-xl p-8 flex flex-col relative overflow-hidden h-[596px] md:h-auto shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
          >

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-5xl lg:text-6xl font-medium tracking-tight mb-4 text-white">Norest</h3>
                <p className="text-white/90 text-[15px] font-medium leading-relaxed">Redefining the inbox. Engineered for unprecedented speed, uncompromising privacy, and absolute focus.</p>
              </div>

              <div className="mt-auto pt-10 flex flex-col gap-6 w-full relative z-10">
                <button 
                  onClick={() => router.push('/account/create')}
                  className="bg-white text-black px-8 py-3 rounded-full text-sm font-semibold tracking-wide hover:bg-gray-200 transition-colors shadow-lg active:scale-95 w-fit"
                >
                  Get Free Forever
                </button>

                <div className="w-full h-[1px] bg-white/10"></div>

                <div className="flex flex-col gap-3">
                  <span className="text-white text-[11px] font-bold uppercase tracking-widest">Available on</span>
                  <div className="flex items-center gap-6 text-white">
                    <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group/apple">
                      <svg viewBox="0 0 384 512" fill="currentColor" className="w-[18px] h-[18px] mb-0.5 group-hover/apple:scale-110 transition-transform"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                      <span className="text-[13px] font-medium">App Store</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group/play">
                      <svg viewBox="0 0 512 512" fill="currentColor" className="w-[15px] h-[15px] group-hover/play:scale-110 transition-transform"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                      <span className="text-[13px] font-medium">Google Play</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle glow effect behind the button */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>

            {/* Top Coin (Hidden) */}
            <div className="absolute top-[45%] -right-4 w-32 h-32 rounded-full flex items-center justify-center transform -rotate-12">
              {/* <span className="text-white/50 font-bold text-5xl">N</span> */}
            </div>

            {/* Middle Coin (Hidden) */}
            <div className="absolute bottom-16 right-16 w-24 h-24 rounded-full flex items-center justify-center transform rotate-12">
              {/* <span className="text-white/50 font-bold text-3xl">M</span> */}
            </div>

            {/* Bottom Coin (Hidden) */}
            <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full flex items-center justify-center transform -rotate-6">
            </div>
          </motion.div>

        </div>
      </section>

      {/* Testimonial Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full bg-white text-black py-32 md:py-40 px-8 md:px-16 flex justify-center font-sans"
      >
        <div className="max-w-[1000px] w-full flex flex-col gap-12">

          <h2 className="text-xl md:text-xl lg:text-xl font-medium leading-[1.4] tracking-tight text-gray-900">
            <span className="text-black font-bold mr-2">“</span>
            From cluttered threads to quiet focus, we strip away the noise so you can do your best work. This is intentional communication, supercharged by brilliant design, not buried by it.
          </h2>

          <div className="flex items-center gap-4 mt-2">
            <div className="w-12 h-12 rounded-full border border-gray-200 overflow-hidden shrink-0 shadow-sm">
              {/* Using a placeholder avatar from Unsplash that fits the aesthetic */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                alt="Angelica Ortega"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm tracking-wide">
              <span className="text-gray-900 font-medium">Angelica Ortega</span>
              <span className="text-gray-500 font-medium">, Founder of Novify</span>
            </div>
          </div>

        </div>
      </motion.section>

      {/* Ecosystem Section */}
      <section className="w-full bg-white py-32 flex flex-col items-center overflow-hidden font-sans">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-10 px-6 text-center"
        >
          Embedded in the Ecosystem
        </motion.h2>

        {/* Layout Container */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-[1300px] px-6 mx-auto justify-center items-center">

          {/* Left Card (Preview) */}
          {/* Left Card (Integrations) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="hidden md:flex flex-col flex-1 h-[420px] relative rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 bg-[#fff] p-8 pb-0 group"
          >

            {/* Text Content (Top Left Aligned) */}
            <div className="relative z-20 flex flex-col items-start w-full text-left">
              <h3 className="text-[26px] font-medium text-gray-900 mb-3 tracking-tight">Seamless Integrations</h3>
              <p className="text-[15px] text-gray-500 font-medium leading-[1.6] mb-6 pr-2">
                Effortlessly connect Norest Mail to your favorite tools while preserving your workflow and privacy.
              </p>
              <a href="#" className="flex items-center gap-2 text-[15px] font-medium text-black hover:text-gray-600 transition-colors group/link">
                See More
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 mt-0.5 group-hover/link:translate-x-1 transition-transform" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>


          </motion.div>

          {/* Center Card (Free Forever) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full md:w-[650px] lg:w-[750px] shrink-0 h-[460px] md:h-[500px] relative rounded-[2rem] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-gray-100"
          >
            {/* <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover object-center opacity-80" alt="Office space" /> */}
            {/* Soft, light gradient overlay over the blur */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/95 backdrop-blur-[10px]"></div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 md:p-16 text-center">
              <span className="px-5 py-2 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 shadow-md">Free Forever</span>
              <h3 className="text-3xl md:text-4xl font-medium text-gray-900 mb-5">The Norest Experience</h3>
              <p className="text-[15px] text-gray-600 font-medium leading-relaxed mb-10 max-w-[480px]">
                Take back control of your time. Enjoy a lightning-fast, noise-cancelling inbox with uncompromising privacy. No credit card required, ever.
              </p>
              <button 
                onClick={() => router.push('/account/create')}
                className="bg-black text-white px-8 py-3.5 rounded-full text-[14px] font-semibold hover:bg-black/90 cursor-pointer transition-colors shadow-lg active:scale-95"
              >
                Create Free Account
              </button>
            </div>
          </motion.div>

          {/* Right Card (Custom Domain) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="hidden md:flex flex-col flex-1 h-[420px] relative rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 bg-[#fff] p-8 pb-0 group"
          >

            {/* Text Content (Top Left Aligned) */}
            <div className="relative z-20 flex flex-col items-start w-full text-left">
              <h3 className="text-[26px] font-medium text-gray-900 mb-3 tracking-tight">Custom Domain</h3>
              <p className="text-[15px] text-gray-500 font-medium leading-[1.6] mb-6 pr-2">
                Bring your own identity. Connect your custom domain and send emails that truly represent your brand.
              </p>
              <button 
                onClick={() => router.push('/account/create/custom-domain/config')}
                className="flex items-center gap-2 text-[15px] font-medium text-black hover:text-gray-600 transition-colors group/link cursor-pointer"
              >
                Connect now
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 mt-0.5 group-hover/link:translate-x-1 transition-transform" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>

          </motion.div>

        </div>
      </section>

      {/* Workflow Integrations Section (Node Map) */}
      <section className="w-full bg-[#fff] py-32 flex flex-col items-center overflow-hidden font-sans">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mb-24 px-6 relative z-10"
        >
          <h2 className="text-4xl md:text-[44px] font-medium tracking-tight text-gray-900 mb-6 leading-[1.1]">
            Offer your team a better email experience, scale your productivity
          </h2>
          <p className="text-[17px] text-gray-500 font-medium">
            Norest Mail brings communication, collaboration, and inbox management<br />into one private, responsive workspace.
          </p>
        </motion.div>

        {/* Tree Graphic Container */}
        <div className="relative flex flex-col items-center w-full max-w-[1000px] px-6">

          {/* Top Nodes & Hub */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex justify-center items-center w-full z-10"
          >

            {/* Center Hub (Norest) */}
            <div className="relative z-30 mx-auto">
              {/* Pill Badge (Inverted Norest Logo) */}
              <div className="bg-[#111] cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.2)] rounded-[2.5rem] px-10 py-5 flex items-center gap-4 relative overflow-hidden group border border-gray-800">
                <img
                  src="/logo/logo-01.png"
                  alt="Norest"
                  className="w-7 h-7 object-contain invert brightness-0 group-hover:rotate-180 transition-transform duration-700"
                />
                <span className="text-white text-[26px] font-light tracking-tight mt-0.5">norest mail</span>
              </div>
            </div>

          </motion.div>

          {/* Stem connecting down (Desktop only) */}
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: 80 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block w-[3px] ml-0.5 bg-gray-300 relative -mt-4 z-0 origin-top"
          ></motion.div>

          {/* Horizontal Bridge (Desktop only) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeInOut" }}
            className="hidden lg:block w-[66.66%] h-[3px] bg-gray-300 relative z-0 origin-center"
          ></motion.div>

          {/* Bottom UI Cards */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full relative z-10 lg:pt-8 mt-16 lg:mt-0"
          >

            {/* Stem droppers for cards (Desktop only) */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: 32 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="hidden lg:block absolute top-0 left-[16.66%] w-[3px] bg-gray-300 -z-10 origin-top"
            ></motion.div>
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: 32 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="hidden lg:block absolute top-0 left-1/2 w-[3px] bg-gray-300 -z-10 origin-top"
            ></motion.div>
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: 32 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="hidden lg:block absolute top-0 right-[16.66%] w-[3px] bg-gray-300 -z-10 origin-top"
            ></motion.div>

            {/* Card 1 */}
            <div className="bg-white rounded-none p-7 shadow-sm border border-gray-100 flex flex-col h-[380px] group hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-semibold text-gray-900 text-[17px]">One focused inbox</h4>
              </div>
              <p className="text-[13.5px] text-gray-500 leading-relaxed mb-6 font-medium">Bring every important conversation into one clean, organised space without the usual inbox clutter.</p>

              <div className="mt-auto bg-[#f8f9fa] rounded-xl p-5 border border-gray-100 relative h-[180px] overflow-hidden">
                <div className="absolute top-6 left-6 right-6 bg-white p-5 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-50">
                  <div className="text-[11px] text-gray-400 font-bold mb-1 uppercase tracking-widest">latency</div>
                  <div className="text-[40px] font-medium text-gray-900 leading-none">~29<span className="text-[17px] text-gray-400 font-medium ml-1.5">ms</span></div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-none p-7 shadow-sm border border-gray-100 flex flex-col h-[380px] group hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-semibold text-gray-900 text-[17px]">Seamless team collaboration</h4>
              </div>
              <p className="text-[13.5px] text-gray-500 leading-relaxed mb-6 font-medium">Share conversations, assign follow-ups, and keep everyone aligned without forwarding long email chains.</p>

              <div className="mt-auto bg-[#f8f9fa] rounded-xl p-5 border border-gray-100 relative h-[180px] overflow-hidden">
                <div className="absolute top-6 left-6 right-6 bg-white p-5 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col gap-3.5">
                  <div className="text-[12px] text-gray-900 font-bold">Task's status</div>
                  <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden"><div className="w-[45%] bg-black h-full rounded-full"></div></div>
                  <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden"><div className="w-[70%] bg-black h-full rounded-full"></div></div>
                  <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden"><div className="w-[30%] bg-black h-full rounded-full"></div></div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-none p-7 shadow-sm border border-gray-100 flex flex-col h-[380px] group hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-semibold text-gray-900 text-[17px]">Never miss a follow-up</h4>
              </div>
              <p className="text-[13.5px] text-gray-500 leading-relaxed mb-6 font-medium">Norest Mail automatically brings unanswered conversations back at the right time, so important replies never disappear inside your inbox.</p>

              <div className="mt-auto bg-[#f8f9fa] rounded-xl p-0 border border-gray-100 relative h-[180px] overflow-hidden group-hover:bg-gray-50 transition-colors flex flex-col justify-end">

                {/* Floating Email Preview */}
                <div className="absolute top-8 left-4 right-4 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200/80 p-4 transform transition-all duration-700 group-hover:-translate-y-4 z-10 opacity-80 group-hover:opacity-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                    <span className="text-[10px] font-bold text-black">Follow-up</span>
                  </div>
                  <h5 className="text-[13px] font-semibold text-gray-900 mb-1">Partnership proposal</h5>
                  <p className="text-[12px] text-gray-500">No reply for 2 days</p>
                </div>

                {/* Reminder Panel */}
                <div className="w-[85%] mx-auto bg-white rounded-t-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] border-t border-l border-r border-gray-200/80 p-4 transform transition-all duration-700 translate-y-8 group-hover:translate-y-0 relative z-20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-medium text-gray-700">Remind me</span>
                    <span className="text-[11px] font-medium text-black bg-zinc-50 px-2 py-1 rounded-md">Tomorrow,<br /> 9:00 AM</span>
                  </div>
                  <div className="w-full h-[1px] bg-gray-100 mb-3"></div>
                  <div className="flex justify-between items-center text-[11px] text-gray-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5 text-gray-400" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Follow-up created
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </motion.div>

        </div>
      </section>

      {/* App & Cross-Device Section */}
      <section className="w-full bg-[#fff] py-32 flex flex-col items-center overflow-hidden font-sans">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mb-20 px-6 z-20"
        >
          <h2 className="text-[40px] md:text-[60px] font-medium tracking-tight text-black mb-4 leading-tight">
            Your <span className="text-black font-medium">Email</span> Journey<br />
            <span className="text-black font-medium">Starts Here...</span>
          </h2>
        </motion.div>

        <div className="relative w-full max-w-[1200px] flex justify-center items-end h-[500px] px-6">

          {/* Floating Card: Left Top */}
          <div className="hidden lg:flex absolute left-10 top-10 bg-white rounded-none shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-gray-100 p-4 items-center gap-4 z-20 hover:-translate-y-2 transition-transform duration-500 w-[260px]">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl overflow-hidden shrink-0">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" className="w-full h-full object-cover" alt="User" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-[14px]">Nikita Kaur</h4>
              <p className="text-[12px] text-gray-500 leading-snug font-medium">Zero unread emails. Inbox fully cleared.</p>
            </div>
          </div>

          {/* Floating Card: Right Top */}
          <div className="hidden lg:flex absolute right-10 top-20 bg-white rounded-none shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-gray-100 p-6 flex-col gap-4 z-20 hover:-translate-y-2 transition-transform duration-500 w-[240px]">
            <h4 className="font-semibold text-gray-900 text-[14px]">Best Response Time</h4>
            <div className="flex items-end gap-2.5 h-16 w-full justify-between">
              <div className="w-full bg-black rounded-t-none h-[40%]"></div>
              <div className="w-full bg-black rounded-t-none h-[60%]"></div>
              <div className="w-full bg-black rounded-t-none h-[90%]"></div>
              <div className="w-full bg-black rounded-t-none h-[70%]"></div>
              <div className="w-full bg-black rounded-t-none h-[100%]"></div>
            </div>
          </div>

          {/* Floating Card: Left Bottom */}
          <div className="hidden lg:flex absolute left-32 bottom-20 bg-white rounded-none shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-gray-100 px-7 py-3 items-center gap-4 z-20 hover:-translate-y-2 transition-transform duration-500">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Storage used</span>
              <span className="text-[15px] font-bold text-gray-900">3.5 GB / 5 TB</span>
            </div>
          </div>

          {/* Floating Card: Right Bottom */}
          <div className="hidden lg:flex absolute right-32 bottom-32 bg-white rounded-none shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-gray-100 px-7 py-3 items-center gap-4 z-20 hover:-translate-y-2 transition-transform duration-500">
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-gray-900">Fully Encrypted</span>
              <span className="text-[11px] text-gray-500 font-medium">Privacy first</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 ml-2 text-gray-900" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>

          {/* Center Phone Mockup */}
          <div
            className="relative w-[320px] h-[550px] bg-white rounded-[3.5rem] border-[4px] border-[#111] shadow-2xl overflow-hidden z-10 flex flex-col transform translate-y-8"
            style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 25%, transparent 85%)', maskImage: 'linear-gradient(to bottom, black 25%, transparent 85%)' }}
          >
            {/* Phone Screen Inner */}
            <div className="w-full h-full bg-[#fff] flex flex-col relative pt-9 px-5">
              {/* UI Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[22px] font-medium text-gray-400">Hey, <span className="text-gray-900 font-semibold">Nikita!</span></h3>
                <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" className="w-full h-full object-cover" alt="User" />
                </div>
              </div>

              {/* Inbox Label + Unread Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Inbox</span>
                <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full leading-none">5 new</span>
              </div>

              {/* UI Featured Mail — Unread/Urgent */}
              <div className="w-full bg-[#fff] rounded-2xl p-4 border border-black/5 flex flex-col gap-2.5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-black text-white rounded-full text-[9px] font-bold uppercase tracking-widest w-fit">Unread · Urgent</span>
                  <span className="text-[9px] text-black font-semibold">Just now</span>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-gray-900 leading-tight mb-1">Final Design Assets</h4>
                  <p className="text-[11px] text-gray-500 leading-snug">Please review the attached files before our sync.</p>
                </div>
                <button className="w-full py-2 bg-[#111] text-white rounded-xl text-[11px] font-semibold hover:bg-gray-800 transition-colors">
                  Review Now
                </button>
              </div>

              {/* Inbox Email List */}
              <div className="flex flex-col mt-4" style={{ gap: '0' }}>

                {/* Unread row 1 */}
                <div className="flex gap-3 items-center px-1 py-3 rounded-xl bg-[#f5f8ff] border-b border-gray-100">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-black"></div>
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-black rounded-full border-2 border-white"></span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[12px] font-bold text-gray-900 truncate">Aman Basumatary</span>
                      <span className="text-[9px] text-black font-bold shrink-0">9:41 AM</span>
                    </div>
                    <span className="text-[11px] text-gray-700 font-semibold truncate">Project update for Q3 roadmap...</span>
                  </div>
                </div>

                {/* Unread row 2 */}
                <div className="flex gap-3 items-center px-1 py-3 rounded-xl bg-[#f5f8ff] border-b border-gray-100">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-500 to-gray-800"></div>
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-black rounded-full border-2 border-white"></span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[12px] font-bold text-gray-900 truncate">David Chen</span>
                      <span className="text-[9px] text-black font-bold shrink-0">8:22 AM</span>
                    </div>
                    <span className="text-[11px] text-gray-700 font-semibold truncate">Meeting notes from sync...</span>
                  </div>
                </div>

                {/* Read row */}
                <div className="flex gap-3 items-center px-1 py-3 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-gray-300 shrink-0"></div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[12px] font-medium text-gray-500 truncate">Sarah Kim</span>
                      <span className="text-[9px] text-gray-400 shrink-0">Yesterday</span>
                    </div>
                    <span className="text-[11px] text-gray-400 truncate">Thanks for the update, looks good!</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center mt-24 gap-6 relative z-20">
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex cursor-pointer items-center justify-center gap-3 bg-[#000] text-white px-8 py-3.5 rounded-full hover:bg-black/90 transition-colors shadow-[0_8px_20px_rgb(0,0,0,0.15)] min-w-[200px]">
              <FaApple className="w-6 h-6" />
              <div className="flex flex-col items-start leading-[1.1]">
                <span className="text-[10px] text-gray-300 font-medium tracking-wide">Download on the</span>
                <span className="text-[16px] font-semibold tracking-tight">App Store</span>
              </div>
            </button>
            <button className="flex cursor-pointer items-center justify-center gap-3 bg-white text-black border border-gray-200 px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors shadow-sm min-w-[200px]">
              <FaGooglePlay className="w-5 h-5 text-gray-900 mr-1" />
              <div className="flex flex-col items-start leading-[1.1]">
                <span className="text-[10px] text-gray-500 font-medium tracking-wide">GET IT ON</span>
                <span className="text-[16px] font-semibold tracking-tight">Google Play</span>
              </div>
            </button>
          </div>
          <a href="#" className="text-[14px] font-medium text-gray-400 hover:text-gray-900 transition-colors underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 mt-2">
            or continue with web mail
          </a>
        </div>
      </section>

      {/* Pre-Footer CTA */}
      <section className="w-full bg-white text-black relative flex flex-col items-center pt-16 pb-16 z-10 min-h-[440px]">

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mb-40 mt-4"
        >
          <h2 className="text-5xl md:text-[72px] font-semibold tracking-[-0.03em] text-black leading-[1.05] mb-5">
            Silence the Noise.<br />Reclaim Your Time.
          </h2>
          <p className="text-[14px] md:text-[15px] text-gray-500 font-medium tracking-wide mb-8">
            Experience a faster, more private, and intentional inbox designed for deep work.
          </p>
          <button 
            onClick={() => router.push('/account/create')}
            className="bg-black text-white px-7 py-3 text-[12px] font-bold tracking-[0.15em] hover:bg-gray-800 transition-colors uppercase cursor-pointer"
          >
            Create Free Account
          </button>
        </motion.div>

        {/* Huge text graphic bleeding into footer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[35%] w-full z-0 pointer-events-none flex justify-center items-end">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[120px] md:text-[210px] font-extrabold text-black tracking-tighter leading-none opacity-100 text-center whitespace-nowrap"
          >
            NOREST MAIL
          </motion.h1>
        </div>
      </section>

      {/* New Footer Section */}
      <div className="w-full bg-transparent backdrop-blur-sm pt-0 pb-0 px-6 flex flex-col items-center border-t border-gray-200 mt-auto relative z-20">

        {/* Main Footer Box */}
        <div className="w-full max-w-[950px] p-8 md:p-14 border-l border-r border-gray-200 flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16">

          {/* Left Column: Brand & Subscribe */}
          <div className="flex flex-col gap-6 w-full md:w-[260px] shrink-0">
            <img src="/logo/logo-01.png" alt="Norest" className="h-[40px] w-auto brightness-0 object-contain self-start" />
            <p className="text-black font-semibold text-[12px] leading-[1.8] tracking-wide">
              Norest Mail is a fast, private, and focused email experience built for individuals and teams who want better communication without unnecessary noise.
            </p>
            <div className="flex w-full h-[42px] shadow-sm mt-2">
              <input
                type="email"
                placeholder="NAME@EMAIL.COM"
                className="bg-gray-50 text-black px-4 py-0 text-[10px] font-bold tracking-widest w-full outline-none border border-gray-200 border-r-0 placeholder:text-gray-400"
              />
              <button className="bg-black text-white text-[10px] font-bold tracking-widest px-5 hover:bg-gray-800 transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>

          {/* Right Column: 4-Column Directory */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full mt-4 md:mt-0">
            {/* Product */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[11px] font-bold text-black uppercase tracking-wider mb-2">Product</h4>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Overview</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Features</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Teams</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Security</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Pricing</a>
            </div>
            {/* Resources */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[11px] font-bold text-black uppercase tracking-wider mb-2">Resources</h4>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Help Center</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Getting Started</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">System Status</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Release Notes</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Support</a>
            </div>
            {/* Company */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[11px] font-bold text-black uppercase tracking-wider mb-2">Company</h4>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">About Norest</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Careers</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Brand</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Contact</a>
            </div>
            {/* Legal */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[11px] font-bold text-black uppercase tracking-wider mb-2">Legal</h4>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Privacy</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Terms</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Cookies</a>
              <a href="#" className="text-[12px] text-gray-500 font-medium hover:text-black transition-colors">Acceptable Use</a>
            </div>
          </div>

        </div>

        {/* Copyright Row */}
        <div className="w-full max-w-[950px] px-8 py-6 border-t border-l border-r border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-semibold tracking-wide text-gray-400">
          <div
            className="relative flex items-center gap-2 cursor-pointer"
            onMouseEnter={() => setIsAboutOpen(true)}
            onMouseLeave={() => setIsAboutOpen(false)}
          >
            <span>&copy; 2026 Norest Corporation Private Limited.</span>
            <button
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              className="flex items-center justify-center w-[18px] h-[18px] rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
              aria-label="About Norest Corporation"
            >
              <FaInfoCircle className="w-full h-full" />
            </button>

            {/* Dropdown Modal */}
            {isAboutOpen && (
              <div className="absolute bottom-full left-0 mb-4 w-[300px] md:w-[450px] bg-white border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-6 text-gray-600 z-50 text-[12px] leading-[1.6] flex flex-col gap-3 font-normal normal-case tracking-normal">
                <h3 className="font-bold text-black text-[14px] mb-1 tracking-wide">About Norest Corporation.</h3>
                <p>Norest Corporation Private Limited is a technology company dedicated to building secure, scalable, and thoughtfully designed digital products for users around the world.</p>
                <p>The name Norest reflects our identity and origin. It is derived from "Nor" (North) and "Est" (East), representing Northeast India - the region where our journey began. Headquartered in Assam, we proudly carry the spirit of the Northeast into everything we build.</p>
                <p>We believe that innovation is not defined by geography. Great technology can be created anywhere by teams driven by curiosity, craftsmanship, and a commitment to solving meaningful problems. Our goal is to develop products that meet global standards while demonstrating the talent and potential emerging from Northeast India.</p>
                <p>At Norest, we focus on creating software and digital platforms that emphasize reliability, performance, security, and exceptional user experience. We approach every product with a long-term engineering mindset, building solutions designed to scale with the needs of individuals, businesses, and organizations.</p>
                <p>As we grow, our ambition remains clear: to establish Norest as a globally recognized technology company while inspiring the next generation of innovators from Northeast India.</p>
                <p className="font-bold text-black mt-2">Built in Northeast India. For the World.</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="mailto:support@norest.in" className="bg-black text-white px-5 py-2 text-[10px] font-medium tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center shadow-sm">
              support@norest.in
            </a>
            <a href="#" className="bg-white text-black px-5 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-black"></span>
              </span>
              System Status
            </a>
          </div>
        </div>
        {/* Subtle Bottom Border to close the box */}
        <div className="w-full max-w-[950px] border-t border-gray-200 mb-12"></div>
      </div>
    </div >
  );
}
