
import React, { useState, useEffect } from "react";
import { sampleQuestions, QuestionType } from "@/lib/interview-data";
import { Card } from "@/components/ui/card";
import Button from "@/components/Button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle, Clock, BarChart, Send, Pause, Play, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FeedbackType {
  strengths: string[];
  improvements: string[];
  score: number;
}

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
    setIsInterviewStarted(true);
    setIsAnswering(true);
  };
  
  const submitAnswer = () => {
    if (!answer.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      generateFeedback();
      setIsLoading(false);
      setIsAnswering(false);
    }, 1500);
  };
  
  const generateFeedback = () => {
    // This is a mock implementation - in reality, you would call your backend API
    const mockFeedback: FeedbackType = {
      strengths: [
        "Good understanding of core concepts",
        "Clear explanation of technical details",
        "Well-structured response"
      ],
      improvements: [
        "Could provide more specific examples",
        "Consider mentioning alternative approaches",
        "Elaborate on scalability considerations"
      ],
      score: Math.floor(Math.random() * 30) + 70 // Random score between 70-100
    };
    
    setFeedback(mockFeedback);
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setActiveQuestion(null);
      setAnswer("");
      setFeedback(null);
      setIsAnswering(true);
    } else {
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
  };
  
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
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
                  <span className="text-3xl font-bold">82%</span>
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
                      strokeDashoffset: `${2 * Math.PI * 45 * (1 - 0.82)}` 
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
            <p className="text-sm text-muted-foreground mb-4">
              Your strongest areas were system design and algorithm complexity explanations. 
              Consider focusing more on practical implementation examples in your responses.
            </p>
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
          <Textarea
            placeholder="Type your answer here..."
            className="min-h-[200px] glass border-primary/20 focus-visible:ring-primary/20"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isLoading}
          />
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
