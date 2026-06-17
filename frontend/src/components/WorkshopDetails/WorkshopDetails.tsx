import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiClock, FiTv, FiPlay, FiSmile } from 'react-icons/fi';

export const WorkshopDetails: React.FC = () => {
  const details = [
    {
      icon: <FiUsers className="w-6 h-6 text-primary" />,
      label: 'Age Group',
      value: '8–14 Years',
      desc: 'Age-appropriate cohorts mapping custom logic tracks.',
    },
    {
      icon: <FiClock className="w-6 h-6 text-primary" />,
      label: 'Duration',
      value: '4 Weeks',
      desc: 'Highly interactive modules with rich projects.',
    },
    {
      icon: <FiTv className="w-6 h-6 text-primary" />,
      label: 'Mode',
      value: 'Online',
      desc: 'Live interactive classrooms + virtual lab accesses.',
    },
    {
      icon: <FiSmile className="w-6 h-6 text-primary" />,
      label: 'Fee',
      value: '₹2,999',
      desc: 'Inclusive of coding platforms, certificates, & resources.',
    },
    {
      icon: <FiPlay className="w-6 h-6 text-primary" />,
      label: 'Start Date',
      value: '15 July 2026',
      desc: 'Enroll early to secure pre-camp reading materials.',
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

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section id="details" className="py-24 bg-gradient-to-b from-[#F5F1E8] to-[#EAE4D5] px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-primary-dark">
            Workshop Quick Details
          </h2>
          <p className="mt-4 text-dark-muted font-light text-base sm:text-lg">
            Everything you need to know about our upcoming summer camp cohort at a single glance.
          </p>
        </div>

        {/* Details Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {details.map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-background/60 backdrop-blur-sm border border-white/60 p-6 rounded-premium shadow-premium transition-all duration-300 flex flex-col items-start text-left space-y-4 cursor-pointer"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 bg-secondary/80 rounded-2xl flex items-center justify-center shadow-inner">
                {item.icon}
              </div>

              {/* Text Meta */}
              <div className="flex-grow flex flex-col space-y-1">
                <span className="text-xs font-semibold text-dark-muted uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-lg sm:text-xl font-heading font-extrabold text-primary-dark">
                  {item.value}
                </span>
                <p className="text-xs text-dark-muted font-light leading-relaxed mt-2">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
