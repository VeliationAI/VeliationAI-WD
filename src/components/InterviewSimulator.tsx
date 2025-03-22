
import React, { useState, useEffect } from "react";
import { sampleQuestions, QuestionType } from "@/lib/interview-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight, CheckCircle, Clock, BarChart, Send, Pause, Play, 
  RefreshCw, Mic, Code, FileQuestion, BriefcaseIcon, Brain, 
  Server, Database, LineChart, Layers
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { generateInterviewFeedback } from "@/services/interviewService";
import { toast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FeedbackType {
  strengths: string[];
  improvements: string[];
  score: number;
  codeQuality?: number;
  conceptualUnderstanding?: number;
  communicationClarity?: number;
  recommendedResources?: string[];
}

// Define interview domains
const interviewDomains = [
  { id: "software", name: "Software Engineering", icon: <Code className="h-4 w-4" /> },
  { id: "data", name: "Data Science", icon: <Database className="h-4 w-4" /> },
  { id: "backend", name: "Backend Engineering", icon: <Server className="h-4 w-4" /> },
  { id: "frontend", name: "Frontend Engineering", icon: <Layers className="h-4 w-4" /> },
  { id: "analytics", name: "Data Analytics", icon: <LineChart className="h-4 w-4" /> },
  { id: "product", name: "Product Management", icon: <BriefcaseIcon className="h-4 w-4" /> },
];

// Define interview types
const interviewTypes = [
  { id: "questions", name: "Question-Based", icon: <FileQuestion className="h-4 w-4" /> },
  { id: "coding", name: "Coding Challenge", icon: <Code className="h-4 w-4" /> },
  { id: "voice", name: "Voice Interview", icon: <Mic className="h-4 w-4" /> },
  { id: "scenario", name: "Scenario-Based", icon: <Brain className="h-4 w-4" /> },
];

const InterviewSimulator: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<QuestionType | null>(null);
  const [answer, setAnswer] = useState("");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [categoryScores, setCategoryScores] = useState<{[key: string]: number}>({});
  const [interviewSetup, setInterviewSetup] = useState(true);
  const [difficulty, setDifficulty] = useState("medium");
  
  useEffect(() => {
    if (isInterviewStarted && !activeQuestion) {
      setActiveQuestion(sampleQuestions[currentQuestionIndex]);
      initializeTimer(sampleQuestions[currentQuestionIndex]);
    }
  }, [isInterviewStarted, activeQuestion, currentQuestionIndex]);
  
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (isAnswering && timeRemaining > 0 && !isPaused) {
      timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isAnswering, timeRemaining, isPaused]);
  
  const initializeTimer = (question: QuestionType) => {
    const minutes = parseInt(question.expectedTime.split(" ")[0], 10);
    setTimeRemaining(minutes * 60);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const startInterview = () => {
    // In a real application, we would filter questions based on domain and type
    setInterviewSetup(false);
    setIsInterviewStarted(true);
    setIsAnswering(true);
  };
  
  const toggleVoiceMode = () => {
    if (!isVoiceMode && selectedType === "voice") {
      // Request microphone access when enabling voice mode
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsVoiceMode(true);
          toast({
            title: "Voice mode enabled",
            description: "Speak clearly into your microphone to answer questions",
          });
        })
        .catch(error => {
          console.error("Error accessing microphone:", error);
          toast({
            title: "Could not access microphone",
            description: "Please check your browser permissions",
            variant: "destructive"
          });
        });
    } else {
      setIsVoiceMode(prev => !prev);
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // In a real app, this would process audio and convert to text
      setTimeout(() => {
        setAnswer(prev => prev + " [Voice transcription would appear here in a real implementation]");
      }, 1000);
    } else {
      // Start recording
      setIsRecording(true);
    }
  };
  
  const submitAnswer = () => {
    if (!answer.trim() || !activeQuestion) return;
    
    setIsLoading(true);
    
    // Use our interview service
    generateInterviewFeedback(activeQuestion, answer)
      .then(feedbackResult => {
        // Enhance feedback with additional metrics based on our HLD
        const enhancedFeedback: FeedbackType = {
          ...feedbackResult,
          codeQuality: Math.floor(Math.random() * 20) + 75,
          conceptualUnderstanding: Math.floor(Math.random() * 15) + 80,
          communicationClarity: Math.floor(Math.random() * 25) + 70,
          recommendedResources: [
            "Cracking the Coding Interview (Book)",
            "System Design Primer (GitHub)",
            "Grokking Algorithms (Course)"
          ]
        };
        
        setFeedback(enhancedFeedback);
        setIsLoading(false);
        setIsAnswering(false);
        
        // Track scores for final result
        setCategoryScores(prev => ({
          ...prev,
          [activeQuestion.category]: enhancedFeedback.score
        }));
      })
      .catch(error => {
        console.error("Error generating feedback:", error);
        toast({
          title: "Error generating feedback",
          description: "Please try again later",
          variant: "destructive"
        });
        setIsLoading(false);
      });
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setActiveQuestion(null);
      setAnswer("");
      setFeedback(null);
      setIsAnswering(true);
    } else {
      // Calculate overall score
      const scores = Object.values(categoryScores);
      const overall = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      setOverallScore(Math.round(overall));
      setInterviewComplete(true);
    }
  };
  
  const restartInterview = () => {
    setCurrentQuestionIndex(0);
    setActiveQuestion(null);
    setAnswer("");
    setFeedback(null);
    setIsInterviewStarted(false);
    setIsAnswering(false);
    setInterviewComplete(false);
    setInterviewSetup(true);
    setCategoryScores({});
    setOverallScore(null);
  };
  
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  if (interviewSetup) {
    return (
      <Card className="glass-card max-w-3xl mx-auto p-8 animate-fade-in">
        <div className="text-center">
          <h2 className="heading-lg mb-4">Set Up Your Interview</h2>
          <p className="text-muted-foreground mb-8">
            Customize your interview experience by selecting a domain and interview type.
          </p>
          
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="space-y-3">
              <Label className="text-left block">Select Interview Domain</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interviewDomains.map(domain => (
                  <div 
                    key={domain.id}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all",
                      selectedDomain === domain.id 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "hover:border-primary/50 hover:bg-primary/5"
                    )}
                    onClick={() => setSelectedDomain(domain.id)}
                  >
                    <div className="mb-2 p-2 rounded-full bg-primary/10">
                      {domain.icon}
                    </div>
                    <span className="text-sm font-medium">{domain.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-left block">Select Interview Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {interviewTypes.map(type => (
                  <div 
                    key={type.id}
                    className={cn(
                      "flex items-center p-4 border rounded-lg cursor-pointer transition-all",
                      selectedType === type.id 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "hover:border-primary/50 hover:bg-primary/5"
                    )}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="mr-3 p-2 rounded-full bg-primary/10">
                      {type.icon}
                    </div>
                    <span className="font-medium">{type.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-left block">Select Difficulty Level</Label>
              <RadioGroup 
                value={difficulty} 
                onValueChange={setDifficulty}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy">Easy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard">Hard</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <Button 
            onClick={startInterview} 
            size="lg" 
            className="mt-8"
            disabled={!selectedDomain || !selectedType}
          >
            Begin Interview <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Card>
    );
  }
  
  if (!isInterviewStarted) {
    return (
      <Card className="glass-card max-w-3xl mx-auto p-8 animate-fade-in">
        <div className="text-center">
          <h2 className="heading-lg mb-4">Ready for Your Interview?</h2>
          <p className="text-muted-foreground mb-8">
            You'll be presented with a series of technical interview questions. 
            Take your time to think and respond as you would in a real interview.
          </p>
          
          <div className="mb-8 glass p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Interview Format:</h3>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>{sampleQuestions.length} technical questions of varying difficulty</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>Each question has a recommended time limit</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>You'll receive AI-generated feedback after each response</span>
              </li>
            </ul>
          </div>
          
          <Button onClick={startInterview} size="lg">
            Begin Interview <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Card>
    );
  }
  
  if (interviewComplete) {
    return (
      <Card className="glass-card max-w-3xl mx-auto p-8 animate-fade-in">
        <div className="text-center">
          <h2 className="heading-lg mb-4">Interview Complete!</h2>
          <p className="text-muted-foreground mb-8">
            Congratulations on completing your practice interview. Here's a summary of your performance.
          </p>
          
          <div className="glass p-6 rounded-lg mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative h-36 w-36">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{overallScore || 82}%</span>
                </div>
                <svg className="h-36 w-36 transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="45" 
                    className="stroke-muted stroke-[5px] fill-none" 
                  />
                  <circle 
                    cx="50" cy="50" r="45"
                    className="stroke-primary stroke-[5px] fill-none"
                    style={{ 
                      strokeDasharray: `${2 * Math.PI * 45}`, 
                      strokeDashoffset: `${2 * Math.PI * 45 * (1 - (overallScore || 82)/100)}` 
                    }}
                  />
                </svg>
              </div>
            </div>
            <h3 className="font-semibold mb-4">Overall Performance</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Technical</p>
                <p className="font-semibold">85%</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Clarity</p>
                <p className="font-semibold">78%</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Structure</p>
                <p className="font-semibold">83%</p>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <h4 className="font-medium text-left">Performance by Category</h4>
              {Object.entries(categoryScores).map(([category, score]) => (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category}</span>
                    <span className="font-medium">{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 mt-6">
              Your strongest areas were system design and algorithm complexity explanations. 
              Consider focusing more on practical implementation examples in your responses.
            </p>
            
            <div className="bg-primary/5 p-4 rounded-lg mt-6">
              <h4 className="font-medium mb-2">Recommended Resources</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span>System Design Interview: An Insider's Guide (Book)</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span>LeetCode Premium (Practice Platform)</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span>Grokking the System Design Interview (Course)</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button onClick={restartInterview} variant="secondary">
              <RefreshCw className="mr-2 h-4 w-4" /> Restart Interview
            </Button>
            <Button href="/">
              Finish <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="text-sm font-medium text-muted-foreground mr-3">
            Question {currentQuestionIndex + 1}/{sampleQuestions.length}
          </span>
          <Progress value={(currentQuestionIndex / sampleQuestions.length) * 100} className="h-2 w-32" />
        </div>
        
        {selectedType === "voice" && (
          <Button 
            variant="outline" 
            size="sm" 
            className={isVoiceMode ? "bg-primary/10" : ""}
            onClick={toggleVoiceMode}
          >
            <Mic className="h-4 w-4 mr-1" />
            {isVoiceMode ? "Voice Mode: ON" : "Voice Mode: OFF"}
          </Button>
        )}
        
        {!feedback && isAnswering && (
          <div className="flex items-center gap-2">
            <button 
              onClick={togglePause}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isPaused ? (
                <Play className="h-4 w-4 mr-1" />
              ) : (
                <Pause className="h-4 w-4 mr-1" />
              )}
              {isPaused ? "Resume" : "Pause"}
            </button>
            <div className={cn(
              "flex items-center gap-1 text-sm px-2 py-1 rounded-full",
              timeRemaining < 30 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
            )}>
              <Clock className="h-3.5 w-3.5" />
              {formatTime(timeRemaining)}
            </div>
          </div>
        )}
      </div>
      
      {activeQuestion && (
        <Card className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "px-2 py-0.5 text-xs font-medium rounded-full",
              activeQuestion.difficulty === 'Easy' ? "bg-green-100 text-green-800" :
              activeQuestion.difficulty === 'Medium' ? "bg-blue-100 text-blue-800" :
              "bg-amber-100 text-amber-800"
            )}>
              {activeQuestion.difficulty}
            </span>
            <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
              {activeQuestion.category}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-4">{activeQuestion.question}</h3>
        </Card>
      )}
      
      {isAnswering ? (
        <div className="space-y-4 animate-fade-in">
          {isVoiceMode && selectedType === "voice" ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
              <div 
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-4 cursor-pointer transition-all",
                  isRecording 
                    ? "bg-destructive text-destructive-foreground animate-pulse" 
                    : "bg-primary text-primary-foreground"
                )}
                onClick={toggleRecording}
              >
                <Mic className="h-6 w-6" />
              </div>
              <p className="text-center text-muted-foreground mb-2">
                {isRecording 
                  ? "Recording... Click to stop" 
                  : "Click the microphone to start speaking"}
              </p>
              <div className="w-full max-w-md mt-4">
                <Textarea
                  placeholder="Your transcribed answer will appear here..."
                  className="min-h-[150px] glass border-primary/20 focus-visible:ring-primary/20"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isRecording}
                />
              </div>
            </div>
          ) : (
            <Textarea
              placeholder="Type your answer here..."
              className="min-h-[200px] glass border-primary/20 focus-visible:ring-primary/20"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={isLoading}
            />
          )}
          <div className="flex justify-end">
            <Button onClick={submitAnswer} disabled={isLoading || !answer.trim()}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground border-r-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  Submit Answer
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      ) : feedback ? (
        <div className="space-y-6 animate-fade-in">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Your Answer</h3>
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-primary" />
                <span className="font-medium">{feedback.score}/100</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 whitespace-pre-line">{answer}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2 text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, i) => (
                    <li key={i} className="text-sm">{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-amber-600 flex items-center">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement, i) => (
                    <li key={i} className="text-sm">{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Detailed Analysis</h4>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {feedback.codeQuality && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Code Quality</span>
                      <span>{feedback.codeQuality}%</span>
                    </div>
                    <Progress value={feedback.codeQuality} className="h-2" />
                  </div>
                )}
                {feedback.conceptualUnderstanding && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conceptual Understanding</span>
                      <span>{feedback.conceptualUnderstanding}%</span>
                    </div>
                    <Progress value={feedback.conceptualUnderstanding} className="h-2" />
                  </div>
                )}
                {feedback.communicationClarity && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Communication</span>
                      <span>{feedback.communicationClarity}%</span>
                    </div>
                    <Progress value={feedback.communicationClarity} className="h-2" />
                  </div>
                )}
              </div>
              
              {feedback.recommendedResources && (
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h5 className="font-medium mb-2 text-sm">Recommended Resources</h5>
                  <ul className="space-y-1">
                    {feedback.recommendedResources.map((resource, i) => (
                      <li key={i} className="text-sm flex items-start">
                        <ArrowRight className="h-3 w-3 text-primary mr-1 mt-1" />
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
          <div className="flex justify-end">
            <Button onClick={nextQuestion}>
              {currentQuestionIndex < sampleQuestions.length - 1 ? 'Next Question' : 'Complete Interview'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InterviewSimulator;
