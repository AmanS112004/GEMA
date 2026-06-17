import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', href: '#hero' },
    { name: 'Details', href: '#details' },
    { name: 'Outcomes', href: '#outcomes' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'FAQ', href: '#faq' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, '#hero')}
          className="flex items-center space-x-2 text-xl font-heading font-bold text-primary focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          <span className="bg-primary text-secondary w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg">
            R
          </span>
          <span className="tracking-tight text-primary-dark">RoboAI Camp</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-dark hover:text-primary transition-colors font-medium text-sm tracking-wide focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#register"
            onClick={(e) => handleLinkClick(e, '#register')}
            className="bg-primary text-secondary hover:bg-primary-dark transition-all duration-300 font-heading font-semibold text-sm px-6 py-3 rounded-premium shadow-premium hover:shadow-premium-hover focus-visible:ring-2 focus-visible:ring-primary"
          >
            Enroll Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-primary hover:text-primary-dark p-2 rounded focus-visible:ring-2 focus-visible:ring-primary"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        className={`fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-background/95 backdrop-blur-md z-40 transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 px-6 pb-20">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-dark hover:text-primary font-heading font-semibold text-xl tracking-wide focus-visible:ring-2 focus-visible:ring-primary px-4 py-2 rounded-lg"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#register"
            onClick={(e) => handleLinkClick(e, '#register')}
            className="bg-primary text-secondary hover:bg-primary-dark transition-all w-full text-center max-w-[280px] py-4 rounded-premium font-heading font-semibold text-lg shadow-premium"
          >
            Enroll Now
          </a>
        </div>
      </div>
    </nav>
  );
};
