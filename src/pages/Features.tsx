
import React, { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { features } from "@/lib/interview-data";
import FeatureCard from "@/components/FeatureCard";
import { ArrowRight, Check } from "lucide-react";
import Button from "@/components/Button";

const Features = () => {
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-4");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    featureRefs.current.forEach((ref) => {
      if (ref) {
        ref.classList.add("opacity-0", "translate-y-4", "transition-all", "duration-500");
        observer.observe(ref);
      }
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-sm text-muted-foreground mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
              Comprehensive Features
            </div>
            <h1 className="heading-lg mb-6">
              Tools for Interview Success
            </h1>
            <p className="text-xl text-muted-foreground">
              Our AI interview system combines advanced technology with industry expertise to deliver a comprehensive interview preparation experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                ref={(el) => (featureRefs.current[index] = el)}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="container-padding bg-primary/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-sm text-primary mb-6">
                For Different Career Stages
              </div>
              <h2 className="heading-lg mb-6">
                Tailored for Your Experience Level
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're a recent graduate preparing for your first technical interview or a seasoned professional looking to upgrade your skills, our platform adapts to your needs.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p>Entry-level interview preparation</p>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p>Mid-career role-specific scenarios</p>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p>Senior and leadership position simulations</p>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p>Specialized industry domain expertise</p>
                </div>
              </div>
              
              <Button href="/interview" size="lg">
                Start Your Interview <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="glass-card overflow-hidden p-1">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl px-6 py-8 md:p-10">
                  <div className="space-y-6">
                    <div className="glass-card p-4 transform hover:translate-y-[-5px] transition-transform">
                      <h3 className="font-semibold mb-2">Junior Developer Track</h3>
                      <p className="text-sm text-muted-foreground">
                        Focus on fundamental concepts, coding basics, and entry-level system design questions.
                      </p>
                    </div>
                    
                    <div className="glass-card p-4 transform hover:translate-y-[-5px] transition-transform">
                      <h3 className="font-semibold mb-2">Mid-Level Engineer Track</h3>
                      <p className="text-sm text-muted-foreground">
                        Advance to complex problem-solving, architectural considerations, and team collaboration scenarios.
                      </p>
                    </div>
                    
                    <div className="glass-card p-4 transform hover:translate-y-[-5px] transition-transform">
                      <h3 className="font-semibold mb-2">Senior & Lead Track</h3>
                      <p className="text-sm text-muted-foreground">
                        Master high-level system design, technical leadership questions, and strategic decision-making.
                      </p>
                    </div>
                    
                    <div className="glass-card p-4 transform hover:translate-y-[-5px] transition-transform">
                      <h3 className="font-semibold mb-2">Specialized Tracks</h3>
                      <p className="text-sm text-muted-foreground">
                        Tailored preparation for specific domains like AI/ML, Cloud Infrastructure, Security, and more.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="container-padding">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-lg mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Learn more about how our AI interview system can help you prepare for your next technical interview.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-3">How accurate is the AI feedback?</h3>
              <p className="text-muted-foreground">
                Our AI has been trained on thousands of real interview responses and industry standards, providing feedback comparable to experienced technical interviewers.
              </p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-3">Can I practice specific technologies?</h3>
              <p className="text-muted-foreground">
                Yes, you can select specific technologies, frameworks, or domains to focus your practice sessions on topics relevant to your target roles.
              </p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-3">How often is the question bank updated?</h3>
              <p className="text-muted-foreground">
                Our question bank is continuously updated with new questions based on recent interview reports and industry trends to ensure relevance.
              </p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-3">Can I track my progress over time?</h3>
              <p className="text-muted-foreground">
                Yes, the system provides detailed analytics on your performance across different question types and skills, showing your improvement over time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="container-padding bg-primary/5 text-center">
        <div className="container mx-auto">
          <h2 className="heading-lg mb-6">Ready to Transform Your Interview Skills?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Join thousands of successful candidates who have improved their interview performance with our AI-powered platform.
          </p>
          <Button href="/interview" size="lg">
            Start Your First Interview <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Features;
