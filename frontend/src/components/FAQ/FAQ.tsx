import React, { useState, useRef, useEffect } from 'react';
import { animate } from 'animejs';
import { FiChevronDown } from 'react-icons/fi';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  id: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick, id }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!contentRef.current || !iconRef.current) return;

    if (isOpen) {
      // Animate expansion
      animate(contentRef.current, {
        height: [0, contentRef.current.scrollHeight],
        opacity: [0, 1],
        duration: 350,
        easing: 'easeOutQuart',
      });
      animate(iconRef.current, {
        rotate: 180,
        duration: 300,
        easing: 'easeOutQuad',
      });
    } else {
      // Animate collapse
      animate(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 300,
        easing: 'easeOutQuart',
      });
      animate(iconRef.current, {
        rotate: 0,
        duration: 300,
        easing: 'easeOutQuad',
      });
    }
  }, [isOpen]);

  return (
    <div className="border-b border-primary/10 last:border-none py-4">
      {/* Header Button */}
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-4 px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl transition-all duration-300"
        aria-expanded={isOpen}
        aria-controls={`faq-content-${id}`}
        id={`faq-btn-${id}`}
      >
        <span className="font-heading font-bold text-base sm:text-lg text-primary-dark">
          {question}
        </span>
        <span
          ref={iconRef}
          className="text-primary hover:text-primary-dark transition-colors p-1"
        >
          <FiChevronDown size={20} />
        </span>
      </button>

      {/* Answer Area */}
      <div
        id={`faq-content-${id}`}
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
        role="region"
        aria-labelledby={`faq-btn-${id}`}
      >
        <div className="px-2 pb-6 text-sm sm:text-base text-dark-muted font-light leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Do children need coding experience?',
      answer: 'No, absolutely not! This workshop is tailored for beginners. We build everything from scratch, starting with modular problem-solving logic before writing clean syntax scripts.',
    },
    {
      question: 'Are classes recorded?',
      answer: 'Yes, all our live interactions are recorded and uploaded to our learning portal. Students can review them at any time during the camp and for up to 6 months post-completion.',
    },
    {
      question: 'What is required to attend?',
      answer: 'All you need is a laptop or computer running Windows, macOS, or ChromeOS, a stable high-speed internet connection, and a web browser. No external robotic kits are needed for the starter lessons as we utilize advanced digital sandbox environments.',
    },
  ];

  const toggleIndex = (idx: number) => {
    if (openIndex === idx) {
      setOpenIndex(null);
    } else {
      setOpenIndex(idx);
    }
  };

  return (
    <section id="faq" className="py-24 bg-transparent px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto bg-white/30 backdrop-blur-sm border border-white/60 p-8 sm:p-12 rounded-premium shadow-premium">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Help Center
          </span>
          <h2 className="text-3xl font-heading font-extrabold text-primary-dark mt-4">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQs */}
        <div className="divide-y divide-primary/5">
          {faqs.map((faq, idx) => (
            <FAQItem
              key={idx}
              id={idx.toString()}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === idx}
              onClick={() => toggleIndex(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
