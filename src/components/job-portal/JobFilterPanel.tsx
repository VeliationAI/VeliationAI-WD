
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Filter, Search, Zap, Upload, CheckCircle2 as CheckCircle,
  Globe, IndianRupee, DollarSign, Sparkles, Loader2
} from "lucide-react";

// Define job location types
const locations = [
  { id: "all", name: "All Locations" },
  { id: "usa", name: "United States", icon: <DollarSign className="h-3 w-3" /> },
  { id: "india", name: "India", icon: <IndianRupee className="h-3 w-3" /> },
  { id: "remote", name: "Remote Only", icon: <Globe className="h-3 w-3" /> },
];

// Job experience levels
const experienceLevels = [
  { id: "entry", name: "Entry Level (0-2 years)" },
  { id: "mid", name: "Mid Level (3-5 years)" },
  { id: "senior", name: "Senior (5+ years)" },
  { id: "lead", name: "Lead/Manager (8+ years)" },
];

// Job types
const jobTypes = [
  { id: "fulltime", name: "Full-time" },
  { id: "contract", name: "Contract" },
  { id: "parttime", name: "Part-time" },
  { id: "internship", name: "Internship" },
];

interface JobFilterPanelProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  salaryRange: number[];
  setSalaryRange: (range: number[]) => void;
  selectedExperience: string[];
  handleExperienceChange: (level: string) => void;
  selectedJobTypes: string[];
  handleJobTypeChange: (type: string) => void;
  remoteOnly: boolean;
  setRemoteOnly: (value: boolean) => void;
  easyApplyOnly: boolean;
  setEasyApplyOnly: (value: boolean) => void;
  resumeUploaded: boolean;
  setResumeUploaded: (value: boolean) => void;
  prompt: string;
  setPrompt: (value: string) => void;
  handleAutoApply: () => void;
  handlePromptSearch: () => void;
  isLoading: boolean;
  isAutoApplyEnabled: boolean;
}

const JobFilterPanel: React.FC<JobFilterPanelProps> = ({
  selectedLocation,
  setSelectedLocation,
  salaryRange,
  setSalaryRange,
  selectedExperience,
  handleExperienceChange,
  selectedJobTypes,
  handleJobTypeChange,
  remoteOnly,
  setRemoteOnly,
  easyApplyOnly,
  setEasyApplyOnly,
  resumeUploaded,
  setResumeUploaded,
  prompt,
  setPrompt,
  handleAutoApply,
  handlePromptSearch,
  isLoading,
  isAutoApplyEnabled,
}) => {
  const { toast } = useToast();

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Simulate resume upload
      setTimeout(() => {
        setResumeUploaded(true);
        toast({
          title: "Resume Uploaded",
          description: "Your resume has been uploaded successfully",
        });
      }, 1000);
    }
  };

  return (
    <div className="w-full md:w-1/4 space-y-6">
      <div className="p-4 border rounded-lg bg-background/60">
        <h3 className="font-medium mb-4 flex items-center">
          <Filter className="h-4 w-4 mr-2" /> Filters
        </h3>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location.id} value={location.id}>
                    <div className="flex items-center">
                      {location.icon && <span className="mr-2">{location.icon}</span>}
                      {location.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salary-range">Salary Range (K)</Label>
            <div className="flex justify-between text-sm mb-1">
              <span>${salaryRange[0]}K</span>
              <span>${salaryRange[1]}K</span>
            </div>
            <Slider
              id="salary-range"
              defaultValue={[70, 160]}
              max={200}
              min={40}
              step={5}
              value={salaryRange}
              onValueChange={setSalaryRange}
            />
          </div>
          
          <div className="space-y-3">
            <Label>Experience Level</Label>
            {experienceLevels.map(level => (
              <div key={level.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`exp-${level.id}`} 
                  checked={selectedExperience.includes(level.id)}
                  onCheckedChange={() => handleExperienceChange(level.id)}
                />
                <Label htmlFor={`exp-${level.id}`}>{level.name}</Label>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <Label>Job Type</Label>
            {jobTypes.map(type => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`type-${type.id}`} 
                  checked={selectedJobTypes.includes(type.id)}
                  onCheckedChange={() => handleJobTypeChange(type.id)}
                />
                <Label htmlFor={`type-${type.id}`}>{type.name}</Label>
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remote" 
              checked={remoteOnly}
              onCheckedChange={(checked) => setRemoteOnly(checked === true)}
            />
            <Label htmlFor="remote">Remote only</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="easy-apply" 
              checked={easyApplyOnly}
              onCheckedChange={(checked) => setEasyApplyOnly(checked === true)}
            />
            <Label htmlFor="easy-apply">LinkedIn Easy Apply only</Label>
          </div>
        </div>
      </div>
      
      <div className="p-4 border rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
        <h3 className="font-medium mb-4 flex items-center text-indigo-700 dark:text-indigo-300">
          <Zap className="h-4 w-4 mr-2" /> AI Auto-Apply
        </h3>
        <p className="text-sm text-indigo-600/80 dark:text-indigo-300/80 mb-4">
          Let our AI automatically apply to matching jobs on your behalf.
        </p>
        
        {!resumeUploaded ? (
          <div className="space-y-3">
            <p className="text-xs text-indigo-600/60 dark:text-indigo-300/60">
              Upload your resume to enable auto-apply
            </p>
            <div className="relative">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
              <Button variant="secondary" size="sm" className="w-full">
                <Upload className="mr-2 h-4 w-4" /> Upload Resume
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <p className="text-xs text-green-600 dark:text-green-400">Resume uploaded</p>
            </div>
            <Button 
              className="w-full" 
              size="sm" 
              onClick={handleAutoApply}
              disabled={isAutoApplyEnabled}
            >
              {isAutoApplyEnabled ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Auto-Apply Running
                </>
              ) : (
                <>Enable Auto-Apply</>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <div className="p-4 border rounded-lg bg-primary/5">
        <h3 className="font-medium mb-3 flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-primary" /> AI Job Search
        </h3>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Describe your ideal job in natural language
          </p>
          <Textarea 
            placeholder="e.g., Remote React developer role with competitive salary and flexible hours"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="text-sm min-h-[80px]"
          />
          <Button 
            size="sm" 
            className="w-full"
            onClick={handlePromptSearch}
            disabled={!prompt.trim() || isLoading}
          >
            <Search className="mr-2 h-4 w-4" /> Search with AI
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobFilterPanel;
