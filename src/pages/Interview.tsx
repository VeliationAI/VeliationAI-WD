
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InterviewSimulator from "@/components/InterviewSimulator";
import ResumeGenerator from "@/components/ResumeGenerator";
import EdTechFeatures from "@/components/EdTechFeatures";
import { BrainIcon, FileTextIcon, BriefcaseIcon } from "lucide-react";

const Interview = () => {
  const [activeTab, setActiveTab] = useState("interview");

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pb-16">
      <Navbar />
      
      <section className="pt-36 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-sm text-indigo-700 mb-6 animate-fade-in">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
              AI-Powered Career Solutions
            </div>
            <h1 className="heading-lg mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Prepare for Your Next Career Move
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Practice interviews, create standout resumes, and access AI-powered career tools to help you succeed.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4"></div>
          </div>
          
          <div className="max-w-5xl mx-auto glass-card p-2 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 rounded-xl">
            <Tabs 
              defaultValue="interview" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="mx-auto"
            >
              <div className="flex justify-center mb-10">
                <TabsList className="grid grid-cols-3 w-[500px] bg-indigo-50/70 dark:bg-gray-700/50 p-1 rounded-lg">
                  <TabsTrigger 
                    value="interview" 
                    className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-md rounded-md transition-all"
                  >
                    <BrainIcon className="h-4 w-4" />
                    Interview Simulation
                  </TabsTrigger>
                  <TabsTrigger 
                    value="resume" 
                    className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-md rounded-md transition-all"
                  >
                    <FileTextIcon className="h-4 w-4" />
                    Resume Generator
                  </TabsTrigger>
                  <TabsTrigger 
                    value="career" 
                    className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-md rounded-md transition-all"
                  >
                    <BriefcaseIcon className="h-4 w-4" />
                    Career Tools
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="px-4 py-2">
                <TabsContent value="interview" className="animate-fade-in">
                  <InterviewSimulator />
                </TabsContent>
                
                <TabsContent value="resume" className="animate-fade-in">
                  <ResumeGenerator />
                </TabsContent>
                
                <TabsContent value="career" className="animate-fade-in">
                  <EdTechFeatures />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Interview;
