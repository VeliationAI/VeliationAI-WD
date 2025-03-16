
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Interview", href: "/interview" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "glass py-3" 
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-10">
          <Link
            to="/"
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">AI</span>
            </div>
            <span className="font-semibold text-xl hidden sm:inline-block">
              InterviewPro
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative font-medium transition-colors",
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                  "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all",
                  location.pathname === item.href && "after:w-full"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden glass mt-3 overflow-hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-60" : "max-h-0"
        )}
      >
        <div className="px-4 py-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "block px-3 py-3 rounded-md font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
