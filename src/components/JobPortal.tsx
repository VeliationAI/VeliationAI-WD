import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, Building, Filter, Search, Zap, Linkedin, Sparkles, Star, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { getJobRecommendations, submitJobApplication, getAIRecommendations } from "@/services/jobService";

const JobPortal = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [salaryRange, setSalaryRange] = useState([70, 160]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [easyApplyOnly, setEasyApplyOnly] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load jobs data
    setIsLoading(true);
    getJobRecommendations()
      .then(jobs => {
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

  useEffect(() => {
    // Filter jobs based on user criteria
    if (filteredJobs.length > 0) {
      let filtered = filteredJobs.filter(job => {
        // Search filter
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase());
                           
      // Remote filter
      const matchesRemote = remoteOnly ? job.location.includes("Remote") : true;
      
      // LinkedIn Easy Apply filter
      const matchesEasyApply = easyApplyOnly ? job.linkedinEasyApply : true;
      
      // Salary filter - simplified for mock data
      const minSalary = parseInt(job.salary.replace(/[^0-9-]/g, '').split('-')[0]);
      const matchesSalary = minSalary >= salaryRange[0] * 1000;
      
      return matchesSearch && matchesRemote && matchesEasyApply && matchesSalary;
    });
      
      setFilteredJobs(filtered);
    }
  }, [searchTerm, remoteOnly, easyApplyOnly, salaryRange, filteredJobs]);

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
  }, [activeTab, aiRecommendations.length]);

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
                  <Zap className="h-4 w-4 mr-2" /> AI Assistant
                </h3>
                <p className="text-sm text-indigo-600/80 dark:text-indigo-300/80 mb-4">
                  Let our AI refine your search and automatically apply to matching jobs.
                </p>
                <Button className="w-full" size="sm">
                  Enable Auto-Apply
                </Button>
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="applied" className="animate-fade-in">
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">Track Your Applications</h3>
            <p className="text-muted-foreground mb-8">
              All jobs you've applied to will appear here. You can track their status and follow up.
            </p>
            
            {filteredJobs.filter(job => job.applied).length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredJobs.filter(job => job.applied).map((job) => (
                  <Card key={job.id} className="p-5 border">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company} • {job.location}</p>
                      </div>
                      <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                        Applied
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Button variant="outline" className="mx-auto">
                Start Applying to Jobs <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
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
                <Button onClick={loadAIRecommendations}>Get AI Recommendations</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobPortal;
