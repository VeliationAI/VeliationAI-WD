
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Clock, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-sm text-indigo-700 mb-6 animate-fade-in">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
              Veliation AI EdTech Platform
            </div>
            <h1 className="heading-xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Advance Your Career with AI-Powered Tools
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Prepare for interviews, build professional resumes, and excel in technical assessments with our AI-driven platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/subscription">
                  View Subscription Plans <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to={user ? "/interview" : "/auth/signup"}>
                  {user ? "Try Now" : "Sign Up Free"}
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-indigo-500" />
                <span>AI-Generated Resumes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span>Mock Interviews</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                <span>Career Tracking</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="glass-card p-8 rounded-2xl shadow-xl">
              <div className="relative">
                <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-auto text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Subscription Options
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-8">
                      <p className="font-bold text-xl mb-2">Choose Your Plan</p>
                      <p className="text-muted-foreground text-sm">Unlock premium features with our subscription plans.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900">
                        <div className="font-bold mb-1">Free Plan</div>
                        <div className="text-sm text-muted-foreground mb-2">Basic resume builder and limited interviews</div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400">$0/month</div>
                      </div>
                      <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 relative">
                        <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">Popular</div>
                        <div className="font-bold mb-1">Premium Plan</div>
                        <div className="text-sm text-muted-foreground mb-2">Advanced interviews, face recognition & code assessment</div>
                        <div className="text-xs text-primary">$49.99/month</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="font-bold mb-1">Enterprise</div>
                        <div className="text-sm text-muted-foreground mb-2">Custom solutions for organizations</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Custom pricing</div>
                      </div>
                    </div>
                    <Button className="w-full mt-6" asChild>
                      <Link to={user ? "/subscription" : "/auth/signup"}>
                        {user ? "Upgrade Now" : "Get Started"}
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-indigo-500 to-purple-600 w-24 h-24 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -top-4 -left-4 bg-gradient-to-tr from-blue-500 to-cyan-600 w-20 h-20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
