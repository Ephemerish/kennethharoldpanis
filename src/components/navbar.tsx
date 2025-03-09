"use client";

import type React from "react";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm dark:bg-gray-900">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Name */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
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
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
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
      className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
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
      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
      onClick={onClick}
    >
      {children}
    </a>
  );
}
