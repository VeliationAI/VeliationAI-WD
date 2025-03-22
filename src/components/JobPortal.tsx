
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, MapPin, Clock, Building, Filter, Search, Zap, 
  Linkedin, Sparkles, Star, ChevronRight, Upload, CircleCheck,
  AlertTriangle, FileCheck, PanelLeft, Loader2, RefreshCw, 
  Globe, IndianRupee, DollarSign 
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { getJobRecommendations, submitJobApplication, getAIRecommendations } from "@/services/jobService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

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
            
            {/* Main content */}
            <div className="w-full md:w-3/4">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    className="pl-10" 
                    placeholder="Search job titles, companies, or keywords..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Searching for jobs...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <Card 
                        key={job.id} 
                        className={`p-5 border hover:shadow-md transition-all cursor-pointer ${selectedJobId === job.id ? 'border-primary/50 bg-primary/5' : ''}`}
                        onClick={() => setSelectedJobId(job.id)}
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
                                <p className="text-muted-foreground flex items-center gap-1">
                                  <Building className="h-3 w-3" /> {job.company} • {job.companySize}
                                </p>
                              </div>
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                {job.matched}% Match
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {job.location}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {job.type}
                              </Badge>
                              <Badge variant="outline">{job.salary}</Badge>
                              {job.linkedinEasyApply && (
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                                  <Linkedin className="h-3 w-3 mr-1" /> Easy Apply
                                </Badge>
                              )}
                            </div>
                            
                            {selectedJobId === job.id && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm text-muted-foreground mb-3">
                                  {job.description}
                                </p>
                                <div className="mb-3">
                                  <p className="text-sm font-medium mb-2">Key Skills:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {job.skills.map(skill => (
                                      <Badge key={skill} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                  <Badge variant="outline" className="text-muted-foreground">
                                    Posted {job.posted}
                                  </Badge>
                                  {job.applied ? (
                                    <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                                      Applied
                                    </Badge>
                                  ) : (
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
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-10 border rounded-lg">
                      <p className="text-muted-foreground">No jobs matching your criteria found.</p>
                      <Button variant="outline" className="mt-4" onClick={() => {
                        setSearchTerm("");
                        setSelectedExperience([]);
                        setSelectedJobTypes([]);
                        setRemoteOnly(false);
                        setEasyApplyOnly(false);
                        setSalaryRange([70, 160]);
                        setSelectedLocation("all");
                      }}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="applied" className="animate-fade-in">
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-2">Track Your Applications</h3>
            <p className="text-muted-foreground mb-8">
              All jobs you've applied to will appear here. You can track their status and follow up.
            </p>
            
            {appliedJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
                {appliedJobs.map((job) => (
                  <Card key={job.id} className="p-5 border">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company} • {job.location}</p>
                        <div className="mt-2 flex gap-2">
                          <Badge variant="outline">{job.type}</Badge>
                          <Badge variant="outline">{job.salary}</Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                          Applied
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Applied {Math.floor(Math.random() * 10) + 1} days ago
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Application Status</p>
                          <p className="text-xs text-muted-foreground">
                            Your application is currently being reviewed
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="max-w-md mx-auto bg-primary/5 rounded-lg p-8">
                <Briefcase className="h-12 w-12 text-primary/60 mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">No Applications Yet</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  You haven't applied to any jobs yet. Start your job search and apply to opportunities that match your skills.
                </p>
                <Button variant="outline" onClick={() => setActiveTab("search")}>
                  Start Applying to Jobs <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recommended" className="animate-fade-in">
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
        </TabsContent>
      </Tabs>
      
      {/* Auto-Apply Modal */}
      <Dialog open={showAutoApplyModal} onOpenChange={setShowAutoApplyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {autoApplyStatus === "completed" 
                ? "Auto-Apply Complete" 
                : "Auto-Apply in Progress"}
            </DialogTitle>
            <DialogDescription>
              {autoApplyStatus === "completed" 
                ? "See the results of the automated job application process."
                : "AI is automatically applying to jobs that match your profile."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            {autoApplyStatus === "running" && (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="font-medium mb-2">Applying to jobs...</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Please don't close this window
                </p>
                <Progress value={autoApplyProgress} className="w-full h-2 mb-2" />
                <p className="text-xs text-muted-foreground">
                  {autoApplyProgress}% complete
                </p>
              </div>
            )}
            
            {autoApplyStatus === "completed" && (
              <div className="space-y-6">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h4 className="text-lg font-medium mb-2">Auto-Apply Complete</h4>
                  <p className="text-sm text-muted-foreground">
                    The AI has finished applying to jobs on your behalf
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {autoApplyResults.applied}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Applied Successfully
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {autoApplyResults.failed}
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Failed
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {autoApplyResults.total}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Total Jobs
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            {autoApplyStatus === "completed" ? (
              <Button onClick={() => {
                setShowAutoApplyModal(false);
                setActiveTab("applied");
              }}>
                View Applied Jobs
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setShowAutoApplyModal(false)}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobPortal;
