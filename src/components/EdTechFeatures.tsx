
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  FileTextIcon, 
  LinkedinIcon, 
  SearchIcon, 
  TrendingUpIcon, 
  CodeIcon,
  LightbulbIcon, 
  InfoIcon 
} from "lucide-react";

const EdTechFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState("cover-letter");
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [technology, setTechnology] = useState("");
  const [location, setLocation] = useState("");
  const [salaryPrediction, setSalaryPrediction] = useState<null | { min: number, max: number, currency: string }>(null);

  const handleGenerate = (type: string) => {
    setLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      if (type === "cover-letter") {
        setGeneratedContent(`Dear Hiring Manager at ${company},

I am writing to express my interest in the ${jobTitle} position at ${company}. With my background in ${skills} and ${experience} years of experience, I believe I would be a valuable addition to your team.

During my career, I've successfully implemented several projects that align with your company's mission. My technical expertise in ${skills} would allow me to hit the ground running and make immediate contributions to your team.

I'm particularly drawn to ${company} because of your innovative approach to technology solutions and strong company culture. I am excited about the possibility of bringing my unique skills and perspective to your organization.

I look forward to discussing how my background, skills, and experience would be an ideal fit for this position during an interview. Thank you for your time and consideration.

Sincerely,
[Your Name]`);
      } else if (type === "salary") {
        const minSalary = 80000 + (Math.random() * 20000);
        const maxSalary = minSalary + (Math.random() * 30000);
        setSalaryPrediction({
          min: Math.round(minSalary / 1000) * 1000,
          max: Math.round(maxSalary / 1000) * 1000,
          currency: "USD"
        });
      } else if (type === "job-search") {
        setGeneratedContent(`Based on your skills in ${skills}, we found 5 matching positions:

1. Senior ${technology} Developer at TechCorp
   Location: ${location}
   Salary: $110,000 - $130,000
   Required Skills: ${skills}
   
2. ${technology} Solutions Architect at InnovateAI
   Location: ${location}
   Salary: $125,000 - $145,000
   Required Skills: ${skills}, System Design
   
3. Lead ${technology} Engineer at DataFusion
   Location: ${location}
   Salary: $115,000 - $135,000
   Required Skills: ${skills}, CI/CD
   
4. ${technology} Consultant at ConsultTech
   Location: Remote
   Salary: $105,000 - $125,000
   Required Skills: ${skills}, Communication
   
5. Principal ${technology} Developer at StartupX
   Location: ${location}
   Salary: $130,000 - $150,000
   Required Skills: ${skills}, Leadership
`);
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs 
        defaultValue="cover-letter" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
          <TabsTrigger value="cover-letter" className="flex items-center gap-2">
            <FileTextIcon className="h-4 w-4" />
            <span className="hidden md:inline">Cover Letter</span>
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="flex items-center gap-2">
            <LinkedinIcon className="h-4 w-4" />
            <span className="hidden md:inline">LinkedIn</span>
          </TabsTrigger>
          <TabsTrigger value="job-search" className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4" />
            <span className="hidden md:inline">Job Search</span>
          </TabsTrigger>
          <TabsTrigger value="salary" className="flex items-center gap-2">
            <TrendingUpIcon className="h-4 w-4" />
            <span className="hidden md:inline">Salary</span>
          </TabsTrigger>
          <TabsTrigger value="open-source" className="flex items-center gap-2">
            <CodeIcon className="h-4 w-4" />
            <span className="hidden md:inline">Projects</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <LightbulbIcon className="h-4 w-4" />
            <span className="hidden md:inline">Resources</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Cover Letter Generator */}
        <TabsContent value="cover-letter">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">AI Cover Letter Generator</h2>
            <p className="text-muted-foreground mb-6">Create a personalized cover letter for your job applications in seconds.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Job Title</label>
                <Input 
                  placeholder="e.g., Senior React Developer" 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <Input 
                  placeholder="e.g., Google" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Key Skills</label>
                <Input 
                  placeholder="e.g., React, TypeScript, Node.js" 
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Years of Experience</label>
                <Input 
                  placeholder="e.g., 5" 
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              onClick={() => handleGenerate("cover-letter")} 
              disabled={!jobTitle || !company || !skills || !experience || loading}
              className="w-full mb-6"
            >
              {loading ? "Generating..." : "Generate Cover Letter"}
            </Button>
            
            {generatedContent && activeTab === "cover-letter" && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Your Cover Letter</h3>
                <div className="bg-muted p-4 rounded-md">
                  <Textarea 
                    className="min-h-[300px] w-full" 
                    value={generatedContent} 
                    readOnly 
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent);
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
        
        {/* LinkedIn Auto-Apply */}
        <TabsContent value="linkedin">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">LinkedIn Auto-Apply Assistant</h2>
            <p className="text-muted-foreground mb-6">Automate your job application process on LinkedIn.</p>
            
            <Alert className="mb-6">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Coming Soon</AlertTitle>
              <AlertDescription>
                We're working on integrating with LinkedIn's API to help you automatically apply to jobs matching your profile. Stay tuned for updates!
              </AlertDescription>
            </Alert>
            
            <div className="text-center py-10">
              <LinkedinIcon className="h-16 w-16 mx-auto text-primary/50 mb-4" />
              <h3 className="text-xl font-medium mb-2">LinkedIn Integration</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Our AI will scan your profile, match it with suitable job openings, and help you apply with customized applications.
              </p>
            </div>
          </Card>
        </TabsContent>
        
        {/* AI Job Search */}
        <TabsContent value="job-search">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">AI Job Search Portal</h2>
            <p className="text-muted-foreground mb-6">Find the perfect job opportunities matched to your skills.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Technology/Domain</label>
                <Input 
                  placeholder="e.g., React, Machine Learning, DevOps" 
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Skills</label>
                <Input 
                  placeholder="e.g., React, TypeScript, Node.js" 
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input 
                  placeholder="e.g., Remote, San Francisco, London" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              onClick={() => handleGenerate("job-search")} 
              disabled={!technology || !skills || !location || loading}
              className="w-full mb-6"
            >
              {loading ? "Searching..." : "Find Matching Jobs"}
            </Button>
            
            {generatedContent && activeTab === "job-search" && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Job Matches</h3>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
        
        {/* Salary Prediction */}
        <TabsContent value="salary">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Market Salary Prediction</h2>
            <p className="text-muted-foreground mb-6">Get AI-powered salary forecasts based on your technology stack and skills.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Technology/Domain</label>
                <Input 
                  placeholder="e.g., React, Machine Learning, DevOps" 
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Skills</label>
                <Input 
                  placeholder="e.g., React, TypeScript, Node.js" 
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input 
                  placeholder="e.g., Remote, San Francisco, London" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Years of Experience</label>
                <Input 
                  placeholder="e.g., 5" 
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              onClick={() => handleGenerate("salary")} 
              disabled={!technology || !skills || !location || !experience || loading}
              className="w-full mb-6"
            >
              {loading ? "Calculating..." : "Predict Salary Range"}
            </Button>
            
            {salaryPrediction && activeTab === "salary" && (
              <div className="mt-6">
                <div className="bg-muted p-6 rounded-md text-center">
                  <h3 className="text-lg font-medium mb-4">Estimated Salary Range</h3>
                  <div className="text-4xl font-bold text-primary mb-2">
                    ${salaryPrediction.min.toLocaleString()} - ${salaryPrediction.max.toLocaleString()}
                  </div>
                  <p className="text-muted-foreground">
                    Based on {experience} years of experience with {technology} in {location}
                  </p>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>This prediction is based on current market trends and data from similar job postings.</p>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
        
        {/* Open Source Projects */}
        <TabsContent value="open-source">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Open-Source Projects for Students</h2>
            <p className="text-muted-foreground mb-6">Explore curated projects to enhance your skills and portfolio.</p>
            
            <div className="grid gap-4 mb-6">
              <Card className="p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-1">React Component Library</h3>
                <p className="text-sm text-muted-foreground mb-2">Build a reusable UI component library with React and TypeScript.</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">React</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">TypeScript</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">UI/UX</span>
                </div>
                <p className="text-xs text-muted-foreground">Difficulty: Intermediate • Contributors: 24</p>
              </Card>
              
              <Card className="p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-1">AI-Powered Chatbot</h3>
                <p className="text-sm text-muted-foreground mb-2">Develop a chatbot using NLP and machine learning techniques.</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Python</span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">NLP</span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Machine Learning</span>
                </div>
                <p className="text-xs text-muted-foreground">Difficulty: Advanced • Contributors: 12</p>
              </Card>
              
              <Card className="p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-1">Task Management API</h3>
                <p className="text-sm text-muted-foreground mb-2">Create a RESTful API for task management applications.</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Node.js</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Express</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">MongoDB</span>
                </div>
                <p className="text-xs text-muted-foreground">Difficulty: Beginner • Contributors: 31</p>
              </Card>
            </div>
            
            <div className="text-center">
              <Button>Explore More Projects</Button>
            </div>
          </Card>
        </TabsContent>
        
        {/* Content Generation */}
        <TabsContent value="content">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">AI-Generated Learning Resources</h2>
            <p className="text-muted-foreground mb-6">Access free infographics, blog posts, quizzes, and webinars to enhance your learning.</p>
            
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <Card className="p-4 hover:shadow-md transition-shadow flex flex-col">
                <h3 className="font-semibold text-lg mb-1">Top 10 React Hooks Patterns</h3>
                <p className="text-sm text-muted-foreground mb-3">Learn the most effective patterns for using React Hooks in your projects.</p>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded w-fit mb-auto">Infographic</span>
                <Button variant="outline" className="mt-4">Download</Button>
              </Card>
              
              <Card className="p-4 hover:shadow-md transition-shadow flex flex-col">
                <h3 className="font-semibold text-lg mb-1">Mastering TypeScript Generics</h3>
                <p className="text-sm text-muted-foreground mb-3">A comprehensive guide to using generics for type-safe code.</p>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded w-fit mb-auto">Blog Post</span>
                <Button variant="outline" className="mt-4">Read Now</Button>
              </Card>
              
              <Card className="p-4 hover:shadow-md transition-shadow flex flex-col">
                <h3 className="font-semibold text-lg mb-1">Data Structures Quiz</h3>
                <p className="text-sm text-muted-foreground mb-3">Test your knowledge of common data structures and algorithms.</p>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded w-fit mb-auto">Quiz</span>
                <Button variant="outline" className="mt-4">Take Quiz</Button>
              </Card>
              
              <Card className="p-4 hover:shadow-md transition-shadow flex flex-col">
                <h3 className="font-semibold text-lg mb-1">Introduction to AI in EdTech</h3>
                <p className="text-sm text-muted-foreground mb-3">Join our free webinar on how AI is transforming education technology.</p>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded w-fit mb-auto">Webinar</span>
                <Button variant="outline" className="mt-4">Register</Button>
              </Card>
            </div>
            
            <div className="flex justify-center">
              <Button>View All Resources</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EdTechFeatures;
