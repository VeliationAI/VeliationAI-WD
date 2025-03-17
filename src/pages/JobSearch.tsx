
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import JobPortal from "@/components/JobPortal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CrownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const JobSearch = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pb-16">
      <Navbar />
      
      <section className="pt-36 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-sm text-indigo-700 mb-6 animate-fade-in">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
              AI-Powered Job Search
            </div>
            <h1 className="heading-lg mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Find Your Perfect Role with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Our AI analyzes your skills and experience to match you with the most relevant job opportunities including LinkedIn auto-apply.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4"></div>
          </div>
          
          <Alert className="max-w-4xl mx-auto mb-8 bg-primary/5 border-primary/20">
            <CrownIcon className="h-5 w-5 text-primary" />
            <AlertTitle>Upgrade to Premium</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span>Get access to LinkedIn auto-apply, resume optimization, and interview preparation.</span>
              <Button asChild className="whitespace-nowrap">
                <Link to="/subscription">View Plans</Link>
              </Button>
            </AlertDescription>
          </Alert>
          
          <div className="max-w-6xl mx-auto">
            <JobPortal />
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobSearch;
