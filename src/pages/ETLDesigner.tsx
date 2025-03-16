
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ETLPipelineDesigner from "@/components/ETLPipelineDesigner";
import { FileTextIcon, DatabaseIcon } from "lucide-react";

const ETLDesigner = () => {
  const [activeTab, setActiveTab] = useState("prompt");

  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      
      <section className="pt-36 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-sm text-muted-foreground mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
              AI-Powered ETL Designer
            </div>
            <h1 className="heading-lg mb-6">
              Create ETL Pipelines with Natural Language
            </h1>
            <p className="text-xl text-muted-foreground">
              Design and deploy data pipelines on Azure using simple English prompts or our visual designer.
            </p>
          </div>
          
          <Tabs 
            defaultValue="prompt" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mx-auto max-w-5xl"
          >
            <div className="flex justify-center mb-10">
              <TabsList className="grid grid-cols-2 w-[400px]">
                <TabsTrigger value="prompt" className="flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4" />
                  Text Prompt
                </TabsTrigger>
                <TabsTrigger value="visual" className="flex items-center gap-2">
                  <DatabaseIcon className="h-4 w-4" />
                  Visual Designer
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="prompt">
              <ETLPipelineDesigner mode="prompt" />
            </TabsContent>
            
            <TabsContent value="visual">
              <ETLPipelineDesigner mode="visual" />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default ETLDesigner;
