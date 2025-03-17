
import React, { useState, useEffect } from "react";
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

// Mock data for job listings
const mockJobs = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "TechNova Solutions",
    location: "San Francisco, CA (Remote)",
    type: "Full-time",
    salary: "$120K - $150K",
    posted: "2 days ago",
    description: "We're looking for a senior full stack developer with expertise in React, Node.js, and cloud technologies to join our growing team.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    matched: 95,
    applied: false,
    logo: "https://picsum.photos/seed/technova/200/200",
    companySize: "100-500 employees",
    linkedinEasyApply: true
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "AnalyticsMind Inc.",
    location: "New York, NY (Hybrid)",
    type: "Full-time",
    salary: "$110K - $140K",
    posted: "1 week ago",
    description: "Join our data science team to develop machine learning models and analytics solutions for our enterprise clients.",
    skills: ["Python", "TensorFlow", "PyTorch", "SQL", "Data Visualization"],
    matched: 87,
    applied: false,
    logo: "https://picsum.photos/seed/analytics/200/200",
    companySize: "50-100 employees",
    linkedinEasyApply: true
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "DesignFirst Creative",
    location: "Austin, TX (On-site)",
    type: "Contract",
    salary: "$90K - $120K",
    posted: "3 days ago",
    description: "We are seeking a talented UX/UI designer to create stunning, user-friendly interfaces for our clients in the healthcare sector.",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Wireframing"],
    matched: 78,
    applied: false,
    logo: "https://picsum.photos/seed/design/200/200",
    companySize: "10-50 employees",
    linkedinEasyApply: false
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudScale Technologies",
    location: "Boston, MA (Remote)",
    type: "Full-time",
    salary: "$115K - $145K",
    posted: "5 days ago",
    description: "Looking for a DevOps engineer to build and maintain our cloud infrastructure and CI/CD pipelines.",
    skills: ["Kubernetes", "AWS", "Terraform", "Jenkins", "Docker"],
    matched: 92,
    applied: false,
    logo: "https://picsum.photos/seed/cloudscale/200/200",
    companySize: "100-500 employees",
    linkedinEasyApply: true
  },
  {
    id: 5,
    title: "Machine Learning Engineer",
    company: "AI Innovations",
    location: "Seattle, WA (Remote)",
    type: "Full-time",
    salary: "$130K - $160K",
    posted: "1 day ago",
    description: "Join our team developing cutting-edge ML models for computer vision and natural language processing applications.",
    skills: ["Python", "PyTorch", "TensorFlow", "Computer Vision", "NLP"],
    matched: 91,
    applied: false,
    logo: "https://picsum.photos/seed/aiinnovations/200/200",
    companySize: "50-100 employees",
    linkedinEasyApply: true
  }
];

const JobPortal = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [salaryRange, setSalaryRange] = useState([70, 160]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [easyApplyOnly, setEasyApplyOnly] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let filtered = mockJobs.filter(job => {
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
  }, [searchTerm, remoteOnly, easyApplyOnly, salaryRange]);

  const handleApply = (jobId: number) => {
    const updatedJobs = filteredJobs.map(job => 
      job.id === jobId ? { ...job, applied: true } : job
    );
    setFilteredJobs(updatedJobs);
    
    toast({
      title: "Application Submitted!",
      description: "Your application has been successfully submitted via LinkedIn Easy Apply.",
    });
  };

  const selectedJob = filteredJobs.find(job => job.id === selectedJobId);

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
              <br />Upload your resume to get personalized recommendations.
            </p>
            
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
              <Button>Upload Resume</Button>
            </div>
            
            <div className="border-t pt-6">
              <p className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                <Star className="h-4 w-4 text-amber-500" />
                Premium Feature
              </p>
              <Button variant="outline" asChild>
                <Link to="/subscription">Upgrade to Get AI Recommendations</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobPortal;
