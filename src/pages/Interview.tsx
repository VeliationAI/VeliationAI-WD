
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
    <div className="min-h-screen pb-16">
      <Navbar />
      
      <section className="pt-36 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-sm text-muted-foreground mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
              AI-Powered Career Solutions
            </div>
            <h1 className="heading-lg mb-6">
              Prepare for Your Next Career Move
            </h1>
            <p className="text-xl text-muted-foreground">
              Practice interviews, create standout resumes, and access AI-powered career tools to help you succeed.
            </p>
          </div>
          
          <Tabs 
            defaultValue="interview" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mx-auto max-w-5xl"
          >
            <div className="flex justify-center mb-10">
              <TabsList className="grid grid-cols-3 w-[500px]">
                <TabsTrigger value="interview" className="flex items-center gap-2">
                  <BrainIcon className="h-4 w-4" />
                  Interview Simulation
                </TabsTrigger>
                <TabsTrigger value="resume" className="flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4" />
                  Resume Generator
                </TabsTrigger>
                <TabsTrigger value="career" className="flex items-center gap-2">
                  <BriefcaseIcon className="h-4 w-4" />
                  Career Tools
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="interview">
              <InterviewSimulator />
            </TabsContent>
            
            <TabsContent value="resume">
              <ResumeGenerator />
            </TabsContent>
            
            <TabsContent value="career">
              <EdTechFeatures />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Interview;
