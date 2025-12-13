"use client";

import type React from "react";

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-neutral-200 relative">
      <div className="absolute inset-0">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-0 border-l border-r border-neutral-200 h-full"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo/Name */}
          <div className="shrink-0">
            <a
              href="/"
              className="text-xl font-bold text-brand-gradient drop-shadow-sm"
            >
              Kenneth Harold Panis
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/projects">Projects</NavLink>
              <NavLink to="/blogs">Blogs</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 hover:text-black"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <MobileNavLink to="/" onClick={toggleMenu}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/projects" onClick={toggleMenu}>
              Projects
            </MobileNavLink>
            <MobileNavLink to="/blogs" onClick={toggleMenu}>
              Blogs
            </MobileNavLink>
            <MobileNavLink to="/contact" onClick={toggleMenu}>
              Contact
            </MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

// Desktop Navigation Link
function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <a
      href={to}
      className="px-3 py-2 text-sm font-medium text-black hover:bg-gray-100 hover:text-black"
    >
      {children}
    </a>
  );
}

// Mobile Navigation Link
function MobileNavLink({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={to}
      className="block px-3 py-2 text-base font-medium text-black hover:bg-gray-100 hover:text-black"
      onClick={onClick}
    >
      {children}
    </a>
  );
}
