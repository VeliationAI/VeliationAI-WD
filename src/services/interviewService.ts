
import { QuestionType } from "@/lib/interview-data";

interface FeedbackType {
  strengths: string[];
  improvements: string[];
  score: number;
}

// In a real app, this would call a backend API
export const generateInterviewFeedback = async (
  question: QuestionType,
  answer: string
): Promise<FeedbackType> => {
  // This is a mock implementation - simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate contextual feedback based on question category
  const feedbackByCategory: Record<string, FeedbackType> = {
    'System Design': {
      strengths: [
        "Good understanding of distributed systems principles",
        "Clear explanation of scalability considerations",
        "Thorough analysis of trade-offs"
      ],
      improvements: [
        "Could elaborate more on database sharding strategies",
        "Consider discussing more about data consistency models",
        "Include more specific examples of similar systems"
      ],
      score: Math.floor(Math.random() * 15) + 80 // 80-95
    },
    'Algorithms': {
      strengths: [
        "Correct identification of algorithm complexity",
        "Efficient solution with optimal time complexity", 
        "Well-structured explanation of approach"
      ],
      improvements: [
        "Consider discussing alternative approaches",
        "Could optimize space complexity further",
        "Elaborate on edge case handling"
      ],
      score: Math.floor(Math.random() * 20) + 75 // 75-95
    },
    'Behavioral': {
      strengths: [
        "Structured response using STAR method",
        "Provided specific, measurable achievements",
        "Demonstrated effective collaboration skills"
      ],
      improvements: [
        "Include more details about your specific contributions",
        "Quantify your impact with metrics when possible",
        "Connect the experience more directly to the job requirements"
      ],
      score: Math.floor(Math.random() * 25) + 70 // 70-95
    },
    'Frontend': {
      strengths: [
        "Strong understanding of React principles",
        "Clear explanation of component lifecycle",
        "Good knowledge of rendering optimization"
      ],
      improvements: [
        "Consider discussing state management approaches in more detail",
        "Elaborate on accessibility considerations",
        "Include examples of performance debugging techniques"
      ],
      score: Math.floor(Math.random() * 20) + 75 // 75-95
    }
  };
  
  // Default feedback if category doesn't match
  const defaultFeedback: FeedbackType = {
    strengths: [
      "Good understanding of core concepts",
      "Clear and structured response",
      "Logical reasoning and problem-solving approach"
    ],
    improvements: [
      "Could provide more specific examples",
      "Consider discussing alternative approaches",
      "Elaborate on implementation details"
    ],
    score: Math.floor(Math.random() * 30) + 70 // 70-100
  };
  
  return feedbackByCategory[question.category] || defaultFeedback;
};
