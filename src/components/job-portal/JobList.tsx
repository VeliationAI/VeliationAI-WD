
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, Clock, Building, Search, RefreshCw,
  Linkedin, Loader2
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  companySize?: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  skills: string[];
  posted: string;
  logo: string;
  linkedinEasyApply: boolean;
  applied?: boolean;
  matched?: number;
  reasonsForMatch?: string[];
}

interface JobListProps {
  isLoading: boolean;
  filteredJobs: Job[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedJobId: number | null;
  setSelectedJobId: (id: number | null) => void;
  handleApply: (id: number) => void;
  resetFilters: () => void;
}

const JobList: React.FC<JobListProps> = ({
  isLoading,
  filteredJobs,
  searchTerm,
  setSearchTerm,
  selectedJobId,
  setSelectedJobId,
  handleApply,
  resetFilters,
}) => {
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="w-full md:w-3/4">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            className="pl-10 pr-16" 
            placeholder="Search job titles, companies, or keywords..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={handleClearSearch}
            >
              <span className="text-xs">Clear</span>
            </button>
          )}
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
                      {job.matched && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {job.matched}% Match
                        </Badge>
                      )}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApply(job.id);
                              }}
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
              <p className="text-muted-foreground mb-4">No jobs matching your criteria found.</p>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filters or search terms to see more results.
              </p>
              <Button variant="outline" className="mt-2" onClick={resetFilters}>
                <RefreshCw className="mr-2 h-4 w-4" /> Reset All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobList;
