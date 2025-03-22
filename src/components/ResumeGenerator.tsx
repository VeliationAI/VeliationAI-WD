
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
  ArrowRight,
  Lightbulb,
  RefreshCw,
  MessageSquare,
  PanelRight,
  ChevronRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { downloadResume, analyzeResumeForATS } from "@/utils/pdfUtils";
import { useToast } from "@/hooks/use-toast";

// Form schema
const resumeFormSchema = z.object({
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  jobDescription: z.string().optional(),
  skills: z.string().optional(),
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).optional(),
  email: z.string().email("Please enter a valid email").optional(),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  summary: z.string().optional(),
  workExperience: z.string().optional(),
  education: z.string().optional(),
  certifications: z.string().optional(),
});

type ResumeFormValues = z.infer<typeof resumeFormSchema>;

// Templates
const resumeTemplates = [
  { id: "modern", name: "Modern Professional" },
  { id: "minimal", name: "Minimalist" },
  { id: "creative", name: "Creative" },
  { id: "executive", name: "Executive" },
  { id: "technical", name: "Technical Specialist" },
];

const ResumeGenerator: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState<"idle" | "analyzing" | "completed" | "error">("idle");
  const [resumeContent, setResumeContent] = useState<string | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [activeTab, setActiveTab] = useState("upload");
  const [keywordMatches, setKeywordMatches] = useState<{keyword: string, count: number}[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "Hi! I'm your AI resume assistant. How can I help you optimize your resume today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const { toast } = useToast();

  // Resume form
  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      skills: "",
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      summary: "",
      workExperience: "",
      education: "",
      certifications: "",
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document (.pdf, .doc, .docx)",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setUploadedFile(file);
      
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
              const jobDescription = form.getValues("jobDescription") || "";
              const analysis = analyzeResumeForATS(mockContent, jobDescription);
              setAtsScore(analysis.score);
              setKeywordMatches(analysis.keywordMatches);
            }, 2000);
            
            return 100;
          }
          return nextProgress;
        });
      }, 300);
    }
  };

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

  const generateMockResumeContent = () => {
    setResumeContent(mockContent);
  };

  const handleDownloadResume = () => {
    if (resumeContent) {
      const result = downloadResume(resumeContent, "ai_optimized_resume.pdf");
      
      if (result.success) {
        toast({
          title: "Resume Downloaded",
          description: "Your optimized resume has been downloaded successfully.",
        });
      } else {
        toast({
          title: "Download Failed",
          description: "There was an error downloading your resume. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: "user", content: chatInput }]);
    
    // Clear input and show loading state
    const userMessage = chatInput;
    setChatInput("");
    setChatLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = {
        "how can i improve my resume": "I'd recommend highlighting more quantifiable achievements. For example, instead of saying you 'improved performance', say you 'improved application performance by 40%'. Additionally, ensure your skills section prominently features keywords from the job description.",
        "ats optimization": "To optimize for ATS systems: 1) Use standard section headings like 'Experience' and 'Education', 2) Include keywords directly from the job description, 3) Avoid tables, images, or complex formatting, 4) Use a clean, single-column layout, 5) Submit in PDF format unless specified otherwise.",
        "template": "I'd recommend the Modern Professional template for corporate roles or Technical Specialist for engineering positions. These templates have clean, ATS-friendly layouts while still looking professional.",
        "keywords": "Based on your uploaded resume and target job, I'd recommend emphasizing these keywords: React, Node.js, Cloud Infrastructure, Microservices, CI/CD, and API Development. Try to incorporate them naturally throughout your experience section.",
      };
      
      let response = "I'm not sure about that. Could you ask something about resume optimization, ATS systems, templates, or keywords?";
      
      // Check if message contains specific keywords and provide relevant response
      for (const [key, value] of Object.entries(aiResponses)) {
        if (userMessage.toLowerCase().includes(key)) {
          response = value;
          break;
        }
      }
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, { role: "assistant", content: response }]);
      setChatLoading(false);
    }, 1500);
  };

  const onSubmit = (data: ResumeFormValues) => {
    setAnalysisStatus("analyzing");
    
    // Simulate analysis and generation
    setTimeout(() => {
      setAnalysisStatus("completed");
      
      // Generate resume content based on form data
      const formattedResume = `
# ${data.fullName || "John Doe"}
${data.jobTitle} | ${data.email || "email@example.com"} | ${data.phone || "(123) 456-7890"} | ${data.linkedin || "linkedin.com/in/johndoe"}

## Summary
${data.summary || "Experienced professional with a track record of success in the industry."}

## Experience
${data.workExperience || "**Previous Role**\n*Company Name | Duration*\n- Achievement 1\n- Achievement 2"}

## Skills
${data.skills || "Skill 1, Skill 2, Skill 3"}

## Education
${data.education || "**Degree**\n*University | Year*"}

${data.certifications ? `## Certifications\n${data.certifications}` : ""}
      `;
      
      setResumeContent(formattedResume);
      
      // Analyze for ATS score
      const analysis = analyzeResumeForATS(formattedResume, data.jobDescription || "");
      setAtsScore(analysis.score);
      setKeywordMatches(analysis.keywordMatches);
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

      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Resume
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            Create New Resume
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="animate-fade-in space-y-6">
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
                  onClick={(e) => {
                    // Reset the value to allow reuploading the same file
                    (e.target as HTMLInputElement).value = '';
                  }}
                />
                <Button variant="secondary" size="sm">
                  <FileUp className="mr-2 h-4 w-4" /> Browse Files
                </Button>
              </div>
              
              <div className="mt-8 text-sm text-muted-foreground">
                <p>Or enter the job description to optimize for:</p>
                <Textarea 
                  className="mt-2 max-w-md mx-auto"
                  placeholder="Paste job description here to optimize your resume..."
                  {...form.register("jobDescription")}
                />
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
              
              <div className="py-4">
                <p className="text-sm mb-2">Select Resume Template:</p>
                <div className="grid grid-cols-2 gap-2">
                  {resumeTemplates.map(template => (
                    <div 
                      key={template.id}
                      className={cn(
                        "border rounded-md p-3 cursor-pointer transition-all text-center text-sm",
                        selectedTemplate === template.id 
                          ? "border-primary bg-primary/5" 
                          : "hover:border-primary/50"
                      )}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      {template.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create" className="animate-fade-in">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Your full name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="your.email@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="(123) 456-7890"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="linkedin.com/in/yourprofile"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a brief summary of your professional experience and goals..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="workExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Company Name | Position | Dates
- Achievement 1
- Achievement 2
- Achievement 3"
                        className="min-h-[120px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Use the format shown above. Add multiple positions separated by blank lines.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Degree | University | Year"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Skills</FormLabel>
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
              
              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., AWS Certified Solutions Architect, 2022"
                        className="min-h-[60px]"
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
                    <FormLabel>Target Job Description (Optional)</FormLabel>
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
              
              <div className="py-4">
                <p className="text-sm mb-2">Select Resume Template:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {resumeTemplates.map(template => (
                    <div 
                      key={template.id}
                      className={cn(
                        "border rounded-md p-3 cursor-pointer transition-all text-center text-sm",
                        selectedTemplate === template.id 
                          ? "border-primary bg-primary/5" 
                          : "hover:border-primary/50"
                      )}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      {template.name}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="submit">
                  Generate Resume
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      {/* Chat Assistant Button */}
      <div 
        className={cn(
          "fixed bottom-6 right-6 shadow-lg rounded-full transition-all duration-300 z-50",
          chatOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full"
          onClick={() => setChatOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-[400px] p-0" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="px-4 py-2 border-b">
            <DialogTitle>Resume Assistant</DialogTitle>
            <DialogDescription>
              Ask me anything about resume optimization
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-4 py-4 h-[300px] overflow-y-auto space-y-4">
            {chatMessages.map((message, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div 
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-75"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask about resume optimization..."
                className="flex-1 px-3 py-2 text-sm border rounded-md"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage();
                  }
                }}
              />
              <Button 
                size="icon" 
                onClick={sendChatMessage}
                disabled={chatLoading}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
              
              <Button size="sm" onClick={handleDownloadResume}>
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
                
                {keywordMatches && keywordMatches.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Top matching keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {keywordMatches.map((match, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-primary/10 text-xs rounded-full">
                          {match.keyword} ({match.count})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
            
            <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <h5 className="font-medium mb-2 flex items-center text-blue-700 dark:text-blue-300">
                <Lightbulb className="h-4 w-4 mr-2" />
                AI Suggestions
              </h5>
              <ul className="space-y-2">
                <li className="text-sm flex items-start">
                  <ArrowRight className="h-3 w-3 text-blue-500 mr-1 mt-1" />
                  <span>Consider adding a skills summary section at the top of your resume for better ATS matching.</span>
                </li>
                <li className="text-sm flex items-start">
                  <ArrowRight className="h-3 w-3 text-blue-500 mr-1 mt-1" />
                  <span>Use action verbs at the beginning of each bullet point to highlight your achievements.</span>
                </li>
                <li className="text-sm flex items-start">
                  <ArrowRight className="h-3 w-3 text-blue-500 mr-1 mt-1" />
                  <span>Keep your resume to 1-2 pages maximum, focusing on the most relevant experience.</span>
                </li>
              </ul>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setChatOpen(true)}>
                <MessageSquare className="h-3 w-3 mr-1" /> Get personalized advice
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ResumeGenerator;
