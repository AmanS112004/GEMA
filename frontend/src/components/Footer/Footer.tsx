import React from 'react';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary/90 backdrop-blur-md text-background py-12 px-6 border-t border-primary-light/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        {/* Brand Information */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <div className="flex items-center space-x-2 text-lg font-heading font-bold text-secondary">
            <span className="bg-secondary text-primary w-8 h-8 rounded-lg flex items-center justify-center font-bold">
              R
            </span>
            <span>RoboAI Camp</span>
          </div>
          <p className="text-background/70 text-sm max-w-xs font-light">
            Inspiring the next generation of engineers, builders, and creative problem solvers.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <a
            href="#terms"
            className="hover:text-secondary transition-colors focus-visible:ring-2 focus-visible:ring-secondary rounded px-1"
          >
            Terms of Service
          </a>
          <a
            href="#privacy"
            className="hover:text-secondary transition-colors focus-visible:ring-2 focus-visible:ring-secondary rounded px-1"
          >
            Privacy Policy
          </a>
          <a
            href="#contact"
            className="hover:text-secondary transition-colors focus-visible:ring-2 focus-visible:ring-secondary rounded px-1"
          >
            Contact Us
          </a>
        </div>

        {/* Social and Copyright */}
        <div className="flex flex-col items-center md:items-end space-y-3">
          <div className="flex space-x-4">
            <a
              href="#"
              aria-label="GitHub"
              className="text-background/80 hover:text-secondary transition-colors p-1 focus-visible:ring-2 focus-visible:ring-secondary rounded-full"
            >
              <FiGithub size={18} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-background/80 hover:text-secondary transition-colors p-1 focus-visible:ring-2 focus-visible:ring-secondary rounded-full"
            >
              <FiTwitter size={18} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-background/80 hover:text-secondary transition-colors p-1 focus-visible:ring-2 focus-visible:ring-secondary rounded-full"
            >
              <FiInstagram size={18} />
            </a>
          </div>
          <p className="text-background/50 text-xs font-light">
            &copy; {currentYear} RoboAI Camp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
