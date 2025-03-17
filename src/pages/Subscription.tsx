
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  CheckIcon, 
  XIcon, 
  ZapIcon, 
  StarIcon, 
  BuildingIcon,
  CreditCardIcon,
  BadgeCheckIcon,
  CalendarIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PlanFeature {
  title: string;
  free: boolean;
  basic: boolean;
  premium: boolean;
  enterprise: boolean;
}

interface BillingOption {
  id: string;
  name: string;
  discount: number;
}

const Subscription = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<string>("monthly");
  
  const billingOptions: BillingOption[] = [
    { id: "monthly", name: "Monthly", discount: 0 },
    { id: "quarterly", name: "Quarterly", discount: 10 },
    { id: "yearly", name: "Yearly", discount: 20 }
  ];
  
  const planFeatures: PlanFeature[] = [
    { title: "Resume Generator", free: true, basic: true, premium: true, enterprise: true },
    { title: "Cover Letter Generator", free: false, basic: true, premium: true, enterprise: true },
    { title: "Basic Mock Interviews", free: false, basic: true, premium: true, enterprise: true },
    { title: "AI-powered Feedback", free: false, basic: true, premium: true, enterprise: true },
    { title: "Advanced Mock Interviews", free: false, basic: false, premium: true, enterprise: true },
    { title: "Face & Speech Analysis", free: false, basic: false, premium: true, enterprise: true },
    { title: "Live Coding Assessments", free: false, basic: false, premium: true, enterprise: true },
    { title: "LinkedIn Integration", free: false, basic: false, premium: true, enterprise: true },
    { title: "Custom Branding", free: false, basic: false, premium: false, enterprise: true },
    { title: "Bulk User Management", free: false, basic: false, premium: false, enterprise: true },
    { title: "Analytics Dashboard", free: false, basic: false, premium: false, enterprise: true },
    { title: "Priority Support", free: false, basic: false, premium: false, enterprise: true },
  ];
  
  const planPricing = {
    free: 0,
    basic: 19.99,
    premium: 49.99,
    enterprise: 199.99
  };
  
  const calculatePrice = (basePrice: number): number => {
    const option = billingOptions.find(opt => opt.id === billingCycle);
    if (!option) return basePrice;
    return basePrice * (1 - option.discount / 100);
  };
  
  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    toast.success(`${plan.charAt(0).toUpperCase() + plan.slice(1)} plan selected`);
  };
  
  const handleSubscribe = () => {
    if (!selectedPlan) {
      toast.error("Please select a plan first");
      return;
    }
    toast.success(`Subscribed to ${selectedPlan} plan with ${billingCycle} billing cycle`);
    navigate("/interview");
  };
  
  const FeatureCheck = ({ available }: { available: boolean }) => (
    available ? 
      <CheckIcon className="h-5 w-5 text-green-500" /> : 
      <XIcon className="h-5 w-5 text-red-400" />
  );
  
  const PlanIcon = ({ plan }: { plan: string }) => {
    switch(plan) {
      case "free": return <ZapIcon className="h-6 w-6 text-gray-500" />;
      case "basic": return <StarIcon className="h-6 w-6 text-blue-500" />;
      case "premium": return <BadgeCheckIcon className="h-6 w-6 text-purple-500" />;
      case "enterprise": return <BuildingIcon className="h-6 w-6 text-indigo-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <section className="container mx-auto pt-36 pb-24 px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary border-primary/20 mb-4">
            Subscription Plans
          </Badge>
          <h1 className="heading-lg mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Unlock the full power of Veliation AI with our subscription plans tailored to your needs.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8 mb-12">
            <div className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow-md">
              <div className="flex gap-1">
                {billingOptions.map(option => (
                  <Button
                    key={option.id}
                    variant={billingCycle === option.id ? "default" : "ghost"}
                    className={`flex gap-2 items-center ${billingCycle === option.id ? "bg-primary text-white" : ""}`}
                    onClick={() => setBillingCycle(option.id)}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {option.name}
                    {option.discount > 0 && (
                      <Badge variant="outline" className="ml-1 bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
                        {option.discount}% off
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Free Plan */}
          <Card className={`p-6 border-2 ${selectedPlan === 'free' ? 'border-primary' : 'border-transparent'} transition-all hover:shadow-lg`}>
            <div className="flex items-center gap-3 mb-4">
              <PlanIcon plan="free" />
              <h3 className="text-2xl font-bold">Free</h3>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold mb-2">$0</div>
              <p className="text-muted-foreground">Basic tools to get started</p>
            </div>
            <div className="mb-8">
              <Button 
                variant={selectedPlan === 'free' ? "default" : "outline"} 
                className="w-full"
                onClick={() => handleSelectPlan('free')}
              >
                {selectedPlan === 'free' ? 'Selected' : 'Select Plan'}
              </Button>
            </div>
            <ul className="space-y-3">
              {planFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <FeatureCheck available={feature.free} />
                  <span className={!feature.free ? "text-muted-foreground" : ""}>{feature.title}</span>
                </li>
              ))}
            </ul>
          </Card>
          
          {/* Basic Plan */}
          <Card className={`p-6 border-2 ${selectedPlan === 'basic' ? 'border-primary' : 'border-transparent'} transition-all hover:shadow-lg`}>
            <div className="flex items-center gap-3 mb-4">
              <PlanIcon plan="basic" />
              <h3 className="text-2xl font-bold">Basic</h3>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold mb-2">${calculatePrice(planPricing.basic).toFixed(2)}</div>
              <p className="text-muted-foreground">Everything you need for job prep</p>
            </div>
            <div className="mb-8">
              <Button 
                variant={selectedPlan === 'basic' ? "default" : "outline"} 
                className="w-full"
                onClick={() => handleSelectPlan('basic')}
              >
                {selectedPlan === 'basic' ? 'Selected' : 'Select Plan'}
              </Button>
            </div>
            <ul className="space-y-3">
              {planFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <FeatureCheck available={feature.basic} />
                  <span className={!feature.basic ? "text-muted-foreground" : ""}>{feature.title}</span>
                </li>
              ))}
            </ul>
          </Card>
          
          {/* Premium Plan */}
          <Card className={`p-6 border-2 ${selectedPlan === 'premium' ? 'border-primary' : 'border-transparent'} relative overflow-hidden transition-all hover:shadow-lg`}>
            <div className="absolute top-0 right-0">
              <Badge className="bg-gradient-to-r from-orange-400 to-pink-500 text-white m-2">
                POPULAR
              </Badge>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <PlanIcon plan="premium" />
              <h3 className="text-2xl font-bold">Premium</h3>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold mb-2">${calculatePrice(planPricing.premium).toFixed(2)}</div>
              <p className="text-muted-foreground">Advanced features for job seekers</p>
            </div>
            <div className="mb-8">
              <Button 
                variant={selectedPlan === 'premium' ? "default" : "outline"} 
                className="w-full"
                onClick={() => handleSelectPlan('premium')}
              >
                {selectedPlan === 'premium' ? 'Selected' : 'Select Plan'}
              </Button>
            </div>
            <ul className="space-y-3">
              {planFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <FeatureCheck available={feature.premium} />
                  <span className={!feature.premium ? "text-muted-foreground" : ""}>{feature.title}</span>
                </li>
              ))}
            </ul>
          </Card>
          
          {/* Enterprise Plan */}
          <Card className={`p-6 border-2 ${selectedPlan === 'enterprise' ? 'border-primary' : 'border-transparent'} transition-all hover:shadow-lg`}>
            <div className="flex items-center gap-3 mb-4">
              <PlanIcon plan="enterprise" />
              <h3 className="text-2xl font-bold">Enterprise</h3>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold mb-2">${calculatePrice(planPricing.enterprise).toFixed(2)}</div>
              <p className="text-muted-foreground">Complete solution for organizations</p>
            </div>
            <div className="mb-8">
              <Button 
                variant={selectedPlan === 'enterprise' ? "default" : "outline"} 
                className="w-full"
                onClick={() => handleSelectPlan('enterprise')}
              >
                {selectedPlan === 'enterprise' ? 'Selected' : 'Custom Quote'}
              </Button>
            </div>
            <ul className="space-y-3">
              {planFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <FeatureCheck available={feature.enterprise} />
                  <span className={!feature.enterprise ? "text-muted-foreground" : ""}>{feature.title}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        
        {selectedPlan && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 glass-card">
              <h3 className="text-2xl font-bold mb-6">Complete Your Subscription</h3>
              
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span>Selected Plan:</span>
                  <span className="font-semibold capitalize">{selectedPlan}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Billing Cycle:</span>
                  <span className="font-semibold capitalize">{billingCycle}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Price:</span>
                  <span className="font-semibold">
                    ${calculatePrice(planPricing[selectedPlan as keyof typeof planPricing]).toFixed(2)}
                    {billingCycle === "monthly" ? "/month" : billingCycle === "quarterly" ? "/quarter" : "/year"}
                  </span>
                </div>
                {billingCycle !== "monthly" && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>
                      {billingOptions.find(opt => opt.id === billingCycle)?.discount}% off
                    </span>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleSubscribe} 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Subscribe Now
              </Button>
              
              <p className="text-sm text-muted-foreground text-center mt-4">
                Your subscription includes a 7-day free trial. Cancel anytime.
              </p>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
};

export default Subscription;
