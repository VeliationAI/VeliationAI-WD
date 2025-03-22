
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2 as CheckCircle } from "lucide-react";

interface AutoApplyResults {
  applied: number;
  failed: number;
  total: number;
}

interface AutoApplyModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  status: "idle" | "running" | "completed" | "failed";
  progress: number;
  results: AutoApplyResults;
  setActiveTab: (tab: string) => void;
}

const AutoApplyModal: React.FC<AutoApplyModalProps> = ({
  showModal,
  setShowModal,
  status,
  progress,
  results,
  setActiveTab,
}) => {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {status === "completed" 
              ? "Auto-Apply Complete" 
              : "Auto-Apply in Progress"}
          </DialogTitle>
          <DialogDescription>
            {status === "completed" 
              ? "See the results of the automated job application process."
              : "AI is automatically applying to jobs that match your profile."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          {status === "running" && (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="font-medium mb-2">Applying to jobs...</p>
              <p className="text-sm text-muted-foreground mb-4">
                Please don't close this window
              </p>
              <Progress value={progress} className="w-full h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                {progress}% complete
              </p>
            </div>
          )}
          
          {status === "completed" && (
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
                    {results.applied}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Applied Successfully
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {results.failed}
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Failed
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {results.total}
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
          {status === "completed" ? (
            <Button onClick={() => {
              setShowModal(false);
              setActiveTab("applied");
            }}>
              View Applied Jobs
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AutoApplyModal;
