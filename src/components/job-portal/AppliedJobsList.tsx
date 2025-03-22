
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, ChevronRight } from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  logo: string;
}

interface AppliedJobsListProps {
  appliedJobs: Job[];
  setActiveTab: (tab: string) => void;
}

const AppliedJobsList: React.FC<AppliedJobsListProps> = ({
  appliedJobs,
  setActiveTab,
}) => {
  return (
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
  );
};

export default AppliedJobsList;
