
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import Button from "@/components/Button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  FileUp, 
  FilePlus, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  BarChart,
  ArrowRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

// Form schema
const resumeFormSchema = z.object({
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  jobDescription: z.string().optional(),
  skills: z.string().optional(),
});

type ResumeFormValues = z.infer<typeof resumeFormSchema>;

const ResumeGenerator: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState<"idle" | "analyzing" | "completed" | "error">("idle");
  const [resumeContent, setResumeContent] = useState<string | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);

  // Resume form
  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      skills: "",
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
      
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const nextProgress = prev + 10;
          if (nextProgress >= 100) {
            clearInterval(interval);
            setAnalysisStatus("analyzing");
            
            // Simulate analysis completion after 2 seconds
            setTimeout(() => {
              setAnalysisStatus("completed");
              generateMockResumeContent();
              setAtsScore(Math.floor(Math.random() * 30) + 65); // 65-95 range
            }, 2000);
            
            return 100;
          }
          return nextProgress;
        });
      }, 300);
    }
  };

  const generateMockResumeContent = () => {
    const mockContent = `
# John Doe
Software Engineer | johndoe@example.com | (123) 456-7890 | linkedin.com/in/johndoe

## Summary
Experienced Software Engineer with 5+ years specializing in full-stack development with expertise in React, Node.js, and cloud infrastructure. Proven track record of delivering scalable, high-performance applications.

## Experience
**Senior Software Engineer**
*TechCorp Inc. | Jan 2020 - Present*
- Led development of microservices architecture reducing API response time by 40%
- Implemented CI/CD pipeline reducing deployment time from days to hours
- Mentored junior developers and conducted code reviews

**Software Developer**
*InnovateSoft | March 2017 - Dec 2019*
- Developed responsive web applications using React and TypeScript
- Collaborated with UX designers to implement UI components
- Integrated third-party APIs for payment processing and analytics

## Skills
JavaScript, TypeScript, React, Node.js, Express, MongoDB, PostgreSQL, AWS, Docker, Kubernetes, CI/CD

## Education
**Bachelor of Science in Computer Science**
*University of Technology | 2013 - 2017*
    `;
    
    setResumeContent(mockContent);
  };

  const onSubmit = (data: ResumeFormValues) => {
    setAnalysisStatus("analyzing");
    
    // Simulate analysis and generation
    setTimeout(() => {
      setAnalysisStatus("completed");
      generateMockResumeContent();
      setAtsScore(Math.floor(Math.random() * 30) + 65); // 65-95 range
    }, 2000);
  };

  return (
    <Card className="glass-card max-w-3xl mx-auto p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="heading-lg mb-4">AI Resume Generator</h2>
        <p className="text-muted-foreground">
          Upload your existing resume or create a new one. Our AI will help you create an ATS-friendly resume tailored to your target role.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Resume Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Upload Resume</h3>
          
          {!uploadedFile ? (
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-primary/60 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Drag and drop your resume here, or click to browse</p>
              <div className="relative">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
                <Button variant="secondary" size="sm">
                  <FileUp className="mr-2 h-4 w-4" /> Browse Files
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-primary mr-3" />
                  <div>
                    <p className="font-medium truncate max-w-[180px]">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{Math.round(uploadedFile.size / 1024)} KB</p>
                  </div>
                </div>
                {analysisStatus === "completed" && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              
              {uploadProgress < 100 && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{uploadProgress}% uploaded</p>
                </div>
              )}
              
              {analysisStatus === "analyzing" && (
                <div className="p-4 border rounded-lg bg-primary/5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Analyzing Resume</p>
                    <div className="h-4 w-4 border-2 border-primary border-r-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Our AI is analyzing your resume to extract relevant information and optimize it for ATS systems.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create New Resume Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Create New Resume</h3>
          
          <Dialog>
            <DialogTrigger asChild>
              <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 transition-colors">
                <FilePlus className="h-12 w-12 text-primary/60 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Start fresh with our AI-powered resume builder</p>
                <Button variant="primary" size="sm">
                  Create New Resume
                </Button>
              </div>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Resume</DialogTitle>
                <DialogDescription>
                  Enter your target job title and details to generate an optimized resume
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Job Title</FormLabel>
                        <FormControl>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="e.g., Senior Software Engineer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste the job description to optimize for specific requirements"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This helps the AI tailor your resume to the job requirements
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Skills (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., React, Node.js, AWS, Project Management"
                            className="min-h-[60px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit">
                      Generate Resume
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Results Section */}
      {analysisStatus === "completed" && resumeContent && (
        <div className="mt-12 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Generated Resume</h3>
            
            <div className="flex items-center gap-4">
              {atsScore !== null && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                  <BarChart className="h-4 w-4 text-primary" />
                  <span className="font-medium">ATS Score: {atsScore}/100</span>
                </div>
              )}
              
              <Button size="sm">
                <FileText className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </div>
          </div>
          
          <Card className="p-6 border border-primary/20">
            <div className="prose max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap font-mono text-sm bg-secondary/20 p-4 rounded-lg">
                {resumeContent}
              </pre>
            </div>
          </Card>
          
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">ATS Optimization Tips</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={cn(
                "p-4 border rounded-lg",
                atsScore && atsScore < 75 ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800" : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
              )}>
                <h5 className="font-medium mb-2 flex items-center">
                  {atsScore && atsScore < 75 ? (
                    <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  )}
                  Keyword Optimization
                </h5>
                <p className="text-sm">
                  {atsScore && atsScore < 75
                    ? "Consider adding more industry-specific keywords related to your target role."
                    : "Good use of relevant keywords matched to the job description."
                  }
                </p>
              </div>
              
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <h5 className="font-medium mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Formatting
                </h5>
                <p className="text-sm">
                  Your resume uses ATS-friendly formatting with clear section headings.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <h5 className="font-medium mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Contact Information
                </h5>
                <p className="text-sm">
                  All essential contact details are properly formatted and easily scannable.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                <h5 className="font-medium mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                  Quantifiable Achievements
                </h5>
                <p className="text-sm">
                  Try adding more metrics and specific results to strengthen your impact statements.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ResumeGenerator;
