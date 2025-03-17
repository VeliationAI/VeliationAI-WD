
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, ChevronDown, Briefcase } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Interview", href: "/interview" },
    { name: "Job Search", href: "/job-search" },
    { name: "ETL Designer", href: "/etl-designer" },
    { name: "Subscription", href: "/subscription" },
  ];

  const mobileMenu = (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container h-full flex flex-col">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-xl">Veliation AI</span>
          </Link>
          <Button size="icon" variant="ghost" onClick={toggleMenu}>
            <X className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
        <div className="flex flex-col gap-4 py-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-xl py-2 ${
                location.pathname === link.href
                  ? "font-semibold text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={toggleMenu}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="mt-auto py-8 flex flex-col gap-4">
          <Button className="w-full">Get Started</Button>
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <header className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-sm border-b">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold text-xl">Veliation AI</span>
            </Link>
            {!isMobile && (
              <nav className="hidden md:flex gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`text-sm font-medium ${
                      location.pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none">
                    Resources <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Documentation</DropdownMenuItem>
                    <DropdownMenuItem>Blog</DropdownMenuItem>
                    <DropdownMenuItem>Tutorials</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            )}
          </div>
          <div className="flex items-center gap-4">
            {!isMobile ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/subscription">View Plans</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/interview">Get Started</Link>
                </Button>
                <ThemeToggle />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={toggleMenu}
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <ThemeToggle />
              </div>
            )}
          </div>
        </div>
      </div>
      {isMobile && isMenuOpen && mobileMenu}
    </header>
  );
};

export default Navbar;
