
import React from "react";
import Navbar from "@/components/Navbar";
import InterviewSimulator from "@/components/InterviewSimulator";

const Interview = () => {
  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      
      <section className="pt-36 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-sm text-muted-foreground mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
              Interactive Experience
            </div>
            <h1 className="heading-lg mb-6">
              AI Interview Simulator
            </h1>
            <p className="text-xl text-muted-foreground">
              Experience a realistic technical interview with our AI. Answer questions, receive feedback, and improve your performance.
            </p>
          </div>
          
          <InterviewSimulator />
        </div>
      </section>
    </div>
  );
};

export default Interview;
