
import React from "react";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { ArrowRight, Zap, Clock, BarChart3, Shield, Award } from "lucide-react";
import Button from "@/components/Button";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      
      <section className="container-padding">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-4">Why Choose Our Interview System?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform delivers a realistic interview experience with personalized feedback to help you excel in technical roles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="glass-card p-8 h-full transition-all duration-300 group-hover:shadow-lg flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Advanced AI Technology</h3>
                <p className="text-muted-foreground flex-grow mb-4">
                  Our system leverages state-of-the-art language models that understand context, technical nuance, and provide realistic interview scenarios.
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" href="/features" className="text-primary p-0 flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="glass-card p-8 h-full transition-all duration-300 group-hover:shadow-lg flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Immediate Feedback</h3>
                <p className="text-muted-foreground flex-grow mb-4">
                  Get instant analysis of your performance with specific recommendations for improvement, no waiting or scheduling required.
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" href="/features" className="text-primary p-0 flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="glass-card p-8 h-full transition-all duration-300 group-hover:shadow-lg flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Performance Analytics</h3>
                <p className="text-muted-foreground flex-grow mb-4">
                  Track your progress over time with detailed metrics on your strengths, weaknesses, and overall interview readiness.
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" href="/features" className="text-primary p-0 flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-primary/5 container-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-sm text-primary mb-6">
                Elevate Your Interview Skills
              </div>
              <h2 className="heading-lg mb-6">
                Practice Makes Perfect
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                The more you practice with our realistic AI-powered interview simulator, the more confident and prepared you'll be for your actual technical interviews.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Industry-Validated Questions</h4>
                    <p className="text-muted-foreground">
                      Our questions are curated from real interviews at top tech companies.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Personalized Improvement</h4>
                    <p className="text-muted-foreground">
                      Our AI adapts to your skill level and provides tailored feedback for your growth.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button href="/interview" size="lg">
                Start Practicing Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="glass-card p-1 lg:p-2 shadow-lg">
              <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto text-xs font-medium text-gray-500 dark:text-gray-400">
                    Interview Session
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-1">
                        <span className="text-xs font-medium text-primary">AI</span>
                      </div>
                      <div>
                        <p className="mb-2 font-medium">Interviewer</p>
                        <p className="text-muted-foreground">Explain the differences between REST and GraphQL APIs, and when you would choose one over the other.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 mt-1">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-300">You</span>
                      </div>
                      <div>
                        <p className="mb-2 font-medium">Your Response</p>
                        <p className="text-muted-foreground">REST and GraphQL are both API paradigms but differ in key ways. REST uses multiple endpoints for different resources, while GraphQL uses a single endpoint...</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-1">
                        <span className="text-xs font-medium text-primary">AI</span>
                      </div>
                      <div>
                        <p className="mb-2 font-medium">Feedback</p>
                        <p className="text-muted-foreground mb-3">Great explanation of the core differences! You clearly understand both technologies.</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-2">
                              <span className="text-[10px] font-bold text-green-600">+</span>
                            </div>
                            <p className="text-green-600">Strong technical accuracy</p>
                          </div>
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                              <span className="text-[10px] font-bold text-amber-600">!</span>
                            </div>
                            <p className="text-amber-600">Could include more use case examples</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="container-padding text-center">
        <div className="container mx-auto">
          <h2 className="heading-lg mb-6">Ready to Ace Your Next Interview?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Start practicing with our AI interview system today and build the confidence you need to succeed.
          </p>
          <Button href="/interview" size="lg">
            Begin Your Interview <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
      <section className="container-padding">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-lg mb-6 mt-16">Frequently Asked Questions</h2>
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
    </div>
  );
};

export default Index;
