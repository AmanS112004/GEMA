import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCpu, FiAward, FiUsers } from 'react-icons/fi';

export const Hero: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 80, damping: 15 },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut' as const,
      },
    },
    animateDelayed: {
      y: [-5, 8, -5],
      transition: {
        duration: 7,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut' as const,
        delay: 1,
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Content Side */}
        <motion.div
          className="lg:col-span-7 flex flex-col space-y-8 text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="self-start">
            <span className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary-dark font-medium text-xs md:text-sm px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span>🤖 Interactive AI & Robotics Summer Camp</span>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-dark tracking-tight leading-[1.1]"
          >
            Where Young Minds Build the{' '}
            <span className="text-primary-light italic font-normal">Future</span> of AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-dark-muted font-sans text-base sm:text-lg md:text-xl max-w-xl font-light leading-relaxed"
          >
            A premium 4-week online workspace designed for ages 8–14. Dive deep into automation, coding logic, and hands-on smart machines.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => handleScrollTo('#register')}
              className="bg-primary text-secondary hover:bg-primary-dark transition-all duration-300 font-heading font-semibold text-base px-8 py-4 rounded-premium shadow-premium hover:shadow-premium-hover flex items-center space-x-2 group focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>Enroll Now</span>
              <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleScrollTo('#details')}
              className="bg-[#F5E5B1]/30 hover:bg-[#F5E5B1]/60 border border-primary/10 text-primary-dark transition-all duration-300 font-heading font-semibold text-base px-8 py-4 rounded-premium backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary"
            >
              Explore Details
            </button>
          </motion.div>

          {/* Trust/Proof Elements */}
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-6 pt-4 border-t border-primary/10 max-w-md"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-background bg-[#EAE4D5] flex items-center justify-center text-xs font-bold text-primary font-heading shadow-sm overflow-hidden"
                >
                  <img
                    src={`https://images.unsplash.com/photo-${
                      i === 1
                        ? '1534528741775-53994a69daeb'
                        : i === 2
                        ? '1507003211169-0a1dd7228f2d'
                        : i === 3
                        ? '1494790108377-be9c29b29330'
                        : '1500648767791-00dcc994a43e'
                    }?w=80&h=80&fit=crop&crop=faces&q=80`}
                    alt="Camp Student"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div>
              <div className="flex text-amber-500 font-semibold text-sm">★★★★★</div>
              <p className="text-xs text-dark-muted font-medium">Trusted by 500+ parents worldwide</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual Floating Cards Side */}
        <div className="lg:col-span-5 relative h-[380px] sm:h-[450px] w-full flex items-center justify-center mt-10 lg:mt-0">
          
          {/* Main Hero Card */}
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="absolute z-10 w-[260px] sm:w-[320px] bg-background/70 backdrop-blur-md border border-white/40 p-6 rounded-premium shadow-premium flex flex-col space-y-4"
          >
            <div className="w-12 h-12 bg-primary text-secondary rounded-2xl flex items-center justify-center text-2xl shadow-sm">
              <FiCpu />
            </div>
            <h3 className="font-heading font-bold text-lg text-primary-dark">Project-Based Learning</h3>
            <p className="text-xs text-dark-muted font-light leading-relaxed">
              Every child designs and runs real-time automation scripts, mapping out AI actions and debugging logical patterns.
            </p>
            <div className="bg-primary/5 p-3 rounded-xl flex items-center justify-between text-xs font-medium text-primary">
              <span>Next Cohort Spots</span>
              <span className="bg-accent text-white px-2 py-0.5 rounded-full text-[10px]">8 Left</span>
            </div>
          </motion.div>

          {/* Floating Card 2 */}
          <motion.div
            variants={floatVariants}
            animate="animateDelayed"
            className="absolute top-4 left-4 sm:left-12 z-20 bg-secondary/90 border border-white/60 p-4 rounded-premium shadow-premium flex items-center space-x-3 w-[180px] sm:w-[220px]"
          >
            <div className="w-9 h-9 bg-primary/10 text-primary-dark rounded-xl flex items-center justify-center text-lg">
              <FiUsers />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-primary-dark">8-14 Years</h4>
              <p className="text-[10px] sm:text-xs text-dark-muted">Optimized Cohorts</p>
            </div>
          </motion.div>

          {/* Floating Card 3 */}
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="absolute bottom-4 right-4 sm:right-12 z-20 bg-background border border-primary/10 p-4 rounded-premium shadow-premium flex items-center space-x-3 w-[180px] sm:w-[200px]"
          >
            <div className="w-9 h-9 bg-accent/10 text-accent rounded-xl flex items-center justify-center text-lg animate-pulse">
              <FiAward />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-primary-dark">Verified Camp</h4>
              <p className="text-[10px] sm:text-xs text-dark-muted">ISO Certified Curricula</p>
            </div>
          </motion.div>

          {/* Dynamic Background Circles behind cards */}
          <div className="absolute w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] bg-primary/5 rounded-full filter blur-3xl -z-10" />
          <div className="absolute w-[200px] h-[200px] bg-secondary/20 rounded-full filter blur-2xl -z-10 translate-x-12 translate-y-12" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-1 opacity-60">
        <span className="text-[10px] font-semibold text-primary tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-1.5 h-3 bg-primary rounded-full"
        />
      </div>
    </section>
  );
};
