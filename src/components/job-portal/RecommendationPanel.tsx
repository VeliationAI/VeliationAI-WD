
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Upload, FileCheck, Loader2, Linkedin
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  matched: number;
  reasonsForMatch: string[];
  logo: string;
  linkedinEasyApply: boolean;
}

interface RecommendationPanelProps {
  isLoading: boolean;
  aiRecommendations: Job[];
  resumeUploaded: boolean;
  setResumeUploaded: (value: boolean) => void;
  loadAIRecommendations: () => void;
  handleApply: (id: number) => void;
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  isLoading,
  aiRecommendations,
  resumeUploaded,
  setResumeUploaded,
  loadAIRecommendations,
  handleApply,
}) => {
  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Simulate resume upload
      setTimeout(() => {
        setResumeUploaded(true);
        // No need to toast here as it's already being handled in the main component
      }, 1000);
    }
  };

  return (
    <div className="text-center py-10">
      <h3 className="text-xl font-semibold mb-2">AI-Powered Job Recommendations</h3>
      <p className="text-muted-foreground mb-6">
        Our AI analyzes your resume and preferences to find the perfect match. 
      </p>
      
      {aiRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
          {aiRecommendations.map((job) => (
            <Card 
              key={job.id} 
              className="p-5 border hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                  </div>
                </div>
                
                <div className="flex-grow space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-muted-foreground">{job.company} • {job.location}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {job.matched}% Match
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">AI Matching Factors:</p>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      {job.reasonsForMatch.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={() => handleApply(job.id)}
                      className={job.linkedinEasyApply ? "bg-[#0A66C2] hover:bg-[#0A66C2]/90" : ""}
                      size="sm"
                    >
                      {job.linkedinEasyApply ? (
                        <>
                          <Linkedin className="h-4 w-4 mr-2" /> Easy Apply
                        </>
                      ) : (
                        "Apply Now"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="h-8 w-8 border-2 border-primary border-r-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Generating personalized recommendations...</p>
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-700 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
            </div>
          </div>
          <h4 className="text-lg font-medium mb-2">Resume Analysis</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your resume to let our AI match you with the best job opportunities
            based on your skills, experience, and career goals.
          </p>
          {!resumeUploaded ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                />
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Upload Resume
                </Button>
              </div>
              <div className="block">
                <Button onClick={loadAIRecommendations} disabled>
                  Get AI Recommendations
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <FileCheck className="h-5 w-5" />
                <span>Resume uploaded successfully</span>
              </div>
              <Button onClick={loadAIRecommendations}>
                Get AI Recommendations
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationPanel;
