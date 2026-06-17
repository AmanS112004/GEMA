import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiLayers, FiGitMerge, FiTarget, FiBox } from 'react-icons/fi';

export const LearningOutcomes: React.FC = () => {
  const outcomes = [
    {
      num: '01',
      title: 'Build Basic AI Projects',
      desc: 'Learn visual model training, speech classifiers, and simple pattern matching projects.',
      icon: <FiCode className="w-5 h-5 text-secondary" />,
      color: 'bg-primary',
    },
    {
      num: '02',
      title: 'Understand Robotics Fundamentals',
      desc: 'Explore sensor mappings, motor drivers, voltage variables, and microcontrollers.',
      icon: <FiLayers className="w-5 h-5 text-primary" />,
      color: 'bg-secondary',
    },
    {
      num: '03',
      title: 'Create Simple Automation Workflows',
      desc: 'Link multiple nodes and triggers to orchestrate automated routines and active alarms.',
      icon: <FiGitMerge className="w-5 h-5 text-secondary" />,
      color: 'bg-primary',
    },
    {
      num: '04',
      title: 'Learn Logical Problem Solving',
      desc: 'Formulate conditional triggers (if/else loops), logical gates, and modular function blocks.',
      icon: <FiTarget className="w-5 h-5 text-primary" />,
      color: 'bg-secondary',
    },
    {
      num: '05',
      title: 'Develop Creative Tech Thinking',
      desc: 'Brainstorm, design, prototype, and refine physical or web-based system designs from scratch.',
      icon: <FiBox className="w-5 h-5 text-secondary" />,
      color: 'bg-primary',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 1.5, ease: 'easeInOut' as const },
    },
  };

  const nodeVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 120, damping: 12 },
    },
  };

  const contentVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 80, damping: 15 },
    },
  };

  return (
    <section id="outcomes" className="py-24 bg-transparent relative overflow-hidden px-6 lg:px-8">
      {/* Background design accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full filter blur-2xl -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Syllabus
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-primary-dark mt-4">
            Learning Outcomes & Milestones
          </h2>
          <p className="mt-4 text-dark-muted font-light text-base sm:text-lg">
            A comprehensive, child-friendly development track focused on building direct engineering capabilities.
          </p>
        </div>

        {/* Timeline Container */}
        <motion.div
          className="relative pl-8 md:pl-0 flex flex-col items-stretch space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Vertical central line (offset left on mobile, center on md+) */}
          <motion.div
            variants={lineVariants}
            className="absolute left-[18px] md:left-1/2 top-2 bottom-2 w-0.5 bg-primary/20 origin-top transform md:-translate-x-1/2"
          />

          {outcomes.map((outcome, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={outcome.num}
                className={`flex flex-col md:flex-row items-start md:items-center relative ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Node Dot on central line */}
                <motion.div
                  variants={nodeVariants}
                  className={`absolute left-0 md:left-1/2 w-9 h-9 rounded-full ${outcome.color} border-4 border-background flex items-center justify-center shadow-md z-10 transform -translate-x-[16px] md:-translate-x-1/2`}
                >
                  {outcome.icon}
                </motion.div>

                {/* Timeline Content Block (left/right aligned) */}
                <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16'} text-left`}>
                  <motion.div
                    variants={contentVariants}
                    className="bg-white/80 border border-primary/5 p-6 rounded-premium shadow-premium relative group hover:border-primary/20 transition-all duration-300"
                  >
                    {/* outcome number badge */}
                    <div className="absolute right-6 top-6 text-3xl font-heading font-extrabold text-primary/10 group-hover:text-primary/20 transition-colors">
                      {outcome.num}
                    </div>

                    <h3 className="font-heading font-bold text-lg text-primary-dark mb-2">
                      {outcome.title}
                    </h3>
                    <p className="text-sm text-dark-muted font-light leading-relaxed">
                      {outcome.desc}
                    </p>
                  </motion.div>
                </div>

                {/* Empty spacer block to align cards opposite sides on desktop */}
                <div className="hidden md:block w-1/2" />
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
