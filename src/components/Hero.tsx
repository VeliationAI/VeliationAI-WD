
import React, { useEffect, useState } from "react";
import Button from "./Button";
import { ArrowRight, Code, MessageSquare, Brain } from "lucide-react";

const Hero: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      
      <div 
        className={`container mx-auto px-4 md:px-6 pt-20 pb-16 md:py-24 transition-all duration-700 ${
          loaded ? "opacity-100" : "opacity-0 transform translate-y-4"
        }`}
      >
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-sm text-muted-foreground mb-6 animate-slide-down">
            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
            Revolutionizing Technical Interviews
          </div>
          
          <h1 className="heading-xl mb-6 animate-slide-down" style={{ animationDelay: "100ms" }}>
            Master Technical Interviews With <br className="hidden md:block" />
            <span className="text-primary">AI-Powered Practice</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mb-10 animate-slide-down" style={{ animationDelay: "200ms" }}>
            Experience real-world interview scenarios, receive instant feedback, and improve your skills with our advanced AI interview system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-slide-down" style={{ animationDelay: "300ms" }}>
            <Button href="/interview" size="lg">
              Start Interview <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button href="/features" variant="secondary" size="lg">
              Explore Features
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full animate-slide-up" style={{ animationDelay: "400ms" }}>
            <div className="glass-card p-6 flex flex-col items-center text-center transform transition-all hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Feedback</h3>
              <p className="text-muted-foreground">Receive immediate analysis and suggestions on your interview responses.</p>
            </div>
            
            <div className="glass-card p-6 flex flex-col items-center text-center transform transition-all hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Code className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Technical Scenarios</h3>
              <p className="text-muted-foreground">Practice with industry-relevant coding challenges and system design questions.</p>
            </div>
            
            <div className="glass-card p-6 flex flex-col items-center text-center transform transition-all hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">Our advanced AI evaluates your answers based on real industry standards.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
