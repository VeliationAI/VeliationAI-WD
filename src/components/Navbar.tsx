
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, ChevronDown, Briefcase, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

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

  const getInitials = (name: string) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

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
          {user ? (
            <>
              <Button asChild variant="outline" className="w-full">
                <Link to="/profile" onClick={toggleMenu}>Profile</Link>
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => {
                signOut();
                toggleMenu();
              }}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="w-full">
                <Link to="/auth/signin" onClick={toggleMenu}>Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth/signup" onClick={toggleMenu}>Sign Up</Link>
              </Button>
            </>
          )}
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
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(user.user_metadata?.full_name || '')}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/profile">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/subscription">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Subscription
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => signOut()}>
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/auth/signin">Sign In</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/auth/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
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
