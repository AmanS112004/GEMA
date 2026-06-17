import React from 'react';
import { motion } from 'framer-motion';
import { FiTv, FiLayers, FiHeart, FiAward, FiCheckCircle } from 'react-icons/fi';

export const WhyUs: React.FC = () => {
  const features = [
    {
      icon: <FiTv className="w-6 h-6 text-primary" />,
      title: 'Live Interactive Sessions',
      desc: 'No recorded boring slides. Real-time debugging and coding alongside veteran engineering mentors.',
    },
    {
      icon: <FiLayers className="w-6 h-6 text-primary" />,
      title: 'Project-Based Learning',
      desc: 'Build real-world automation routines. Every lecture starts with a concept and ends with a project.',
    },
    {
      icon: <FiHeart className="w-6 h-6 text-primary" />,
      title: 'Dedicated Parent Support',
      desc: 'Weekly progress reports, direct mentor interactions, and easy sandbox setups for parents.',
    },
    {
      icon: <FiAward className="w-6 h-6 text-primary" />,
      title: 'Completion Certificate',
      desc: 'Earn a shareable, verifiable digital credential indicating the final automation capstone build.',
    },
    {
      icon: <FiCheckCircle className="w-6 h-6 text-primary" />,
      title: '100% Beginner Friendly',
      desc: 'No background coding required. We start with fundamental block structures and move up to custom scripts.',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 90, damping: 15 },
    },
  };

  return (
    <section id="why-us" className="py-24 bg-transparent px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Trust & Pedagogy
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-primary-dark mt-4">
            Why Choose This Camp?
          </h2>
          <p className="mt-4 text-dark-muted font-light text-base sm:text-lg">
            We deliver highly engaging, certified, interactive tracks that bridge computational theory with physical building blocks.
          </p>
        </div>

        {/* Features Grids */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, index) => {
            const isFullWidthOnDesktop = index === 4; // Make the last card center nicely or take up full spacing if needed
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`bg-white/80 border border-primary/5 p-8 rounded-premium shadow-premium hover:border-primary/20 transition-all duration-300 flex flex-col space-y-4 ${
                  isFullWidthOnDesktop ? 'lg:col-span-2' : ''
                }`}
              >
                {/* Icon Circle */}
                <div className="w-12 h-12 bg-secondary/70 rounded-2xl flex items-center justify-center shadow-inner self-start">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="font-heading font-bold text-lg text-primary-dark">
                  {feature.title}
                </h3>
                <p className="text-sm text-dark-muted font-light leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
