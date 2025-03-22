
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Briefcase, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getJobRecommendations, submitJobApplication, getAIRecommendations } from "@/services/jobService";

// Import our new components
import JobFilterPanel from "./job-portal/JobFilterPanel";
import JobList from "./job-portal/JobList";
import AppliedJobsList from "./job-portal/AppliedJobsList";
import RecommendationPanel from "./job-portal/RecommendationPanel";
import AutoApplyModal from "./job-portal/AutoApplyModal";

const JobPortal = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [originalJobs, setOriginalJobs] = useState([]);
  const [salaryRange, setSalaryRange] = useState([70, 160]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [easyApplyOnly, setEasyApplyOnly] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [isAutoApplyEnabled, setIsAutoApplyEnabled] = useState(false);
  const [showAutoApplyModal, setShowAutoApplyModal] = useState(false);
  const [autoApplyProgress, setAutoApplyProgress] = useState(0);
  const [autoApplyStatus, setAutoApplyStatus] = useState<"idle" | "running" | "completed" | "failed">("idle");
  const [autoApplyResults, setAutoApplyResults] = useState({ applied: 0, failed: 0, total: 0 });
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load jobs data
    setIsLoading(true);
    getJobRecommendations()
      .then(jobs => {
        setOriginalJobs(jobs);
        setFilteredJobs(jobs);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error fetching jobs",
          description: "Please try again later",
          variant: "destructive"
        });
        setIsLoading(false);
      });
  }, [toast]);

  const applyFilters = () => {
    if (originalJobs.length === 0) return;
    
    let filtered = [...originalJobs];
    
    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter(job => {
        if (selectedLocation === "remote") {
          return job.location.toLowerCase().includes("remote");
        } else if (selectedLocation === "usa") {
          return job.location.includes("CA") || job.location.includes("NY") || job.location.includes("TX");
        } else if (selectedLocation === "india") {
          return job.location.includes("Bangalore") || job.location.includes("Mumbai") || job.location.includes("Delhi");
        }
        return true;
      });
    }
    
    // Experience level filter
    if (selectedExperience.length > 0) {
      filtered = filtered.filter(job => {
        // This is a simplified example - in a real app, you'd have experience data on the job object
        const yearsRequired = parseInt(job.description.match(/(\d+)\+?\s*years?/i)?.[1] || "0", 10);
        
        return selectedExperience.some(level => {
          if (level === "entry" && yearsRequired <= 2) return true;
          if (level === "mid" && yearsRequired >= 3 && yearsRequired <= 5) return true;
          if (level === "senior" && yearsRequired >= 5 && yearsRequired <= 8) return true;
          if (level === "lead" && yearsRequired >= 8) return true;
          return false;
        });
      });
    }
    
    // Job type filter
    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter(job => 
        selectedJobTypes.some(type => job.type.toLowerCase().includes(type.toLowerCase()))
      );
    }
    
    // Remote filter
    if (remoteOnly) {
      filtered = filtered.filter(job => job.location.toLowerCase().includes("remote"));
    }
    
    // LinkedIn Easy Apply filter
    if (easyApplyOnly) {
      filtered = filtered.filter(job => job.linkedinEasyApply);
    }
    
    // Salary filter
    filtered = filtered.filter(job => {
      // Parse salary range from format like "$120K - $150K"
      const salaryText = job.salary.replace(/[^0-9-]/g, '');
      const [minSalary, maxSalary] = salaryText.split('-').map(s => parseInt(s, 10));
      
      return minSalary >= salaryRange[0] * 1000 && (!maxSalary || maxSalary <= salaryRange[1] * 1000);
    });
    
    setFilteredJobs(filtered);
  };

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters();
  }, [
    searchTerm, remoteOnly, easyApplyOnly, salaryRange, 
    selectedLocation, selectedExperience, selectedJobTypes
  ]);

  const handleApply = (jobId: number) => {
    setIsLoading(true);
    submitJobApplication(jobId)
      .then(response => {
        if (response.success) {
          // Mark job as applied
          const updatedJobs = filteredJobs.map(job => 
            job.id === jobId ? { ...job, applied: true } : job
          );
          setFilteredJobs(updatedJobs);
          
          // Also update in original jobs
          const updatedOriginalJobs = originalJobs.map(job => 
            job.id === jobId ? { ...job, applied: true } : job
          );
          setOriginalJobs(updatedOriginalJobs);
          
          // Add to applied jobs
          const appliedJob = filteredJobs.find(job => job.id === jobId);
          if (appliedJob) {
            setAppliedJobs(prev => [...prev, appliedJob]);
          }
          
          toast({
            title: "Application Submitted!",
            description: "Your application has been successfully submitted via LinkedIn Easy Apply.",
          });
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error submitting application:", error);
        toast({
          title: "Error submitting application",
          description: "Please try again later",
          variant: "destructive"
        });
        setIsLoading(false);
      });
  };

  const handleAutoApply = () => {
    // Check if resume is uploaded
    if (!resumeUploaded) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume before using auto-apply",
        variant: "destructive"
      });
      return;
    }
    
    setShowAutoApplyModal(true);
    setAutoApplyStatus("running");
    setAutoApplyProgress(0);
    
    // Get eligible jobs (LinkedIn Easy Apply only)
    const eligibleJobs = filteredJobs.filter(job => 
      job.linkedinEasyApply && !job.applied
    );
    
    setAutoApplyResults({
      applied: 0,
      failed: 0,
      total: eligibleJobs.length
    });
    
    if (eligibleJobs.length === 0) {
      setAutoApplyStatus("completed");
      setAutoApplyProgress(100);
      return;
    }
    
    // Simulate applying to jobs one by one
    let applied = 0;
    let failed = 0;
    let processed = 0;
    
    const applyInterval = setInterval(() => {
      if (processed >= eligibleJobs.length) {
        clearInterval(applyInterval);
        setAutoApplyStatus("completed");
        setAutoApplyProgress(100);
        
        // Refresh job list to update applied status
        applyFilters();
        
        return;
      }
      
      const currentJob = eligibleJobs[processed];
      processed++;
      
      // Simulate 85% success rate
      const isSuccess = Math.random() < 0.85;
      
      if (isSuccess) {
        applied++;
        
        // Update job as applied
        const updatedJobs = originalJobs.map(job => 
          job.id === currentJob.id ? { ...job, applied: true } : job
        );
        setOriginalJobs(updatedJobs);
        
        // Add to applied jobs
        setAppliedJobs(prev => [...prev, currentJob]);
      } else {
        failed++;
      }
      
      setAutoApplyResults({
        applied,
        failed,
        total: eligibleJobs.length
      });
      
      setAutoApplyProgress(Math.round((processed / eligibleJobs.length) * 100));
    }, 800);
  };

  const handlePromptSearch = () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    toast({
      title: "Searching jobs based on your prompt",
      description: "This may take a moment...",
    });
    
    // Simulate AI-powered job search
    setTimeout(() => {
      // Get a random subset of jobs as "matching" jobs
      const matchCount = Math.floor(Math.random() * 5) + 3; // 3-7 matches
      const matchingJobs = [...originalJobs]
        .sort(() => Math.random() - 0.5)
        .slice(0, matchCount)
        .map(job => ({
          ...job,
          matched: Math.floor(Math.random() * 20) + 75, // 75-95% match
          reasonsForMatch: [
            "Skills align with job requirements",
            "Experience level matches the role",
            "Location preference compatible"
          ]
        }));
      
      setFilteredJobs(matchingJobs);
      setIsLoading(false);
      
      toast({
        title: "Jobs Found",
        description: `Found ${matchingJobs.length} jobs matching your prompt`,
      });
    }, 2000);
  };

  const loadAIRecommendations = () => {
    setIsLoading(true);
    getAIRecommendations()
      .then(recommendations => {
        setAiRecommendations(recommendations);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error getting AI recommendations:", error);
        toast({
          title: "Error generating recommendations",
          description: "Please try again later",
          variant: "destructive"
        });
        setIsLoading(false);
      });
  };

  // When switching to the recommendations tab, load AI recommendations
  useEffect(() => {
    if (activeTab === "recommended" && aiRecommendations.length === 0) {
      loadAIRecommendations();
    }
    
    // Update applied jobs list when switching to applied tab
    if (activeTab === "applied") {
      const applied = originalJobs.filter(job => job.applied);
      setAppliedJobs(applied);
    }
  }, [activeTab, aiRecommendations.length, originalJobs]);

  const handleExperienceChange = (level: string) => {
    setSelectedExperience(prev => 
      prev.includes(level) 
        ? prev.filter(item => item !== level) 
        : [...prev, level]
    );
  };

  const handleJobTypeChange = (type: string) => {
    setSelectedJobTypes(prev => 
      prev.includes(type) 
        ? prev.filter(item => item !== type) 
        : [...prev, type]
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedExperience([]);
    setSelectedJobTypes([]);
    setRemoteOnly(false);
    setEasyApplyOnly(false);
    setSalaryRange([70, 160]);
    setSelectedLocation("all");
  };
  
  return (
    <div className="glass-card rounded-xl p-6 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-white/20 dark:border-gray-700/20">
      <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Job Search
          </TabsTrigger>
          <TabsTrigger value="applied" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Applied Jobs
          </TabsTrigger>
          <TabsTrigger value="recommended" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Recommendations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="animate-fade-in">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters panel */}
            <JobFilterPanel 
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              salaryRange={salaryRange}
              setSalaryRange={setSalaryRange}
              selectedExperience={selectedExperience}
              handleExperienceChange={handleExperienceChange}
              selectedJobTypes={selectedJobTypes}
              handleJobTypeChange={handleJobTypeChange}
              remoteOnly={remoteOnly}
              setRemoteOnly={setRemoteOnly}
              easyApplyOnly={easyApplyOnly}
              setEasyApplyOnly={setEasyApplyOnly}
              resumeUploaded={resumeUploaded}
              setResumeUploaded={setResumeUploaded}
              prompt={prompt}
              setPrompt={setPrompt}
              handleAutoApply={handleAutoApply}
              handlePromptSearch={handlePromptSearch}
              isLoading={isLoading}
              isAutoApplyEnabled={isAutoApplyEnabled}
            />
            
            {/* Main job list */}
            <JobList 
              isLoading={isLoading}
              filteredJobs={filteredJobs}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedJobId={selectedJobId}
              setSelectedJobId={setSelectedJobId}
              handleApply={handleApply}
              resetFilters={resetFilters}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="applied" className="animate-fade-in">
          <AppliedJobsList 
            appliedJobs={appliedJobs}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
        
        <TabsContent value="recommended" className="animate-fade-in">
          <RecommendationPanel
            isLoading={isLoading}
            aiRecommendations={aiRecommendations}
            resumeUploaded={resumeUploaded}
            setResumeUploaded={setResumeUploaded}
            loadAIRecommendations={loadAIRecommendations}
            handleApply={handleApply}
          />
        </TabsContent>
      </Tabs>
      
      {/* Auto-Apply Modal */}
      <AutoApplyModal 
        showModal={showAutoApplyModal}
        setShowModal={setShowAutoApplyModal}
        status={autoApplyStatus}
        progress={autoApplyProgress}
        results={autoApplyResults}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default JobPortal;
