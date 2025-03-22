
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { FileText, Video, BookOpen, GraduationCap, ExternalLink } from "lucide-react";

const Resources = () => {
  const resourceCategories = [
    {
      title: "Resume Resources",
      icon: <FileText className="h-8 w-8 text-primary" />,
      resources: [
        { title: "Resume Writing Guide", link: "https://example.com/resume-guide", external: true },
        { title: "ATS-Friendly Resume Templates", link: "https://example.com/ats-templates", external: true },
        { title: "Action Verbs for Resumes", link: "https://example.com/action-verbs", external: true },
      ]
    },
    {
      title: "Interview Preparation",
      icon: <Video className="h-8 w-8 text-primary" />,
      resources: [
        { title: "Behavioral Interview Questions", link: "https://example.com/behavioral-questions", external: true },
        { title: "Technical Interview Prep", link: "https://example.com/technical-prep", external: true },
        { title: "Mock Interview Videos", link: "https://example.com/mock-interviews", external: true },
      ]
    },
    {
      title: "Career Development",
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      resources: [
        { title: "Skill Assessment Tools", link: "https://example.com/skill-assessment", external: true },
        { title: "Career Path Planning", link: "https://example.com/career-paths", external: true },
        { title: "Networking Strategies", link: "https://example.com/networking", external: true },
      ]
    },
    {
      title: "Industry Knowledge",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      resources: [
        { title: "Industry Trends Reports", link: "https://example.com/industry-trends", external: true },
        { title: "Salary Guides", link: "https://example.com/salary-guides", external: true },
        { title: "Company Research Tools", link: "https://example.com/company-research", external: true },
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-36 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="heading-lg mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Career Resources
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Curated resources to help you advance in your career journey, from resume building to interview preparation.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resourceCategories.map((category, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  {category.icon}
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                </div>
                <ul className="space-y-3">
                  {category.resources.map((resource, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{resource.title}</span>
                      <a 
                        href={resource.link} 
                        target={resource.external ? "_blank" : "_self"} 
                        rel={resource.external ? "noreferrer" : ""}
                        className="text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-6">Can't find what you're looking for?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our team is continuously adding new resources. If you have suggestions for resources we should include,
              please let us know.
            </p>
            <a 
              href="mailto:resources@veliation.com" 
              className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Suggest a Resource
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Resources;
