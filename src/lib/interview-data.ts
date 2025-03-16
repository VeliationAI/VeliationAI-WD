
import { ArrowUpRight, Database, Cpu, Server, Code, Briefcase, MessageSquare, Brain, Lightbulb, Users, Eye, FileCheck, Zap } from 'lucide-react';

export interface QuestionType {
  id: string;
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedTime: string;
}

export interface FeatureType {
  icon: typeof ArrowUpRight;
  title: string;
  description: string;
}

export const sampleQuestions: QuestionType[] = [
  {
    id: '1',
    question: 'Explain the concept of RESTful APIs and their key principles.',
    category: 'Web Development',
    difficulty: 'Medium',
    expectedTime: '5 minutes',
  },
  {
    id: '2',
    question: 'What is the difference between CPU bound and I/O bound operations? Give examples of each.',
    category: 'Computer Science',
    difficulty: 'Medium',
    expectedTime: '4 minutes',
  },
  {
    id: '3',
    question: 'Explain how you would implement a caching strategy for a high-traffic website.',
    category: 'System Design',
    difficulty: 'Hard',
    expectedTime: '8 minutes',
  },
  {
    id: '4',
    question: 'What is dependency injection and what are its benefits?',
    category: 'Software Design',
    difficulty: 'Medium',
    expectedTime: '4 minutes',
  },
  {
    id: '5',
    question: 'Describe the differences between SQL and NoSQL databases, and when you would choose one over the other.',
    category: 'Databases',
    difficulty: 'Medium',
    expectedTime: '6 minutes',
  },
  {
    id: '6',
    question: 'Explain the concept of time complexity and analyze the time complexity of a simple algorithm.',
    category: 'Algorithms',
    difficulty: 'Hard',
    expectedTime: '7 minutes',
  }
];

export const features: FeatureType[] = [
  {
    icon: Brain,
    title: 'AI-Powered Interview Simulation',
    description: 'Experience realistic interviews with our advanced AI that adapts to your responses and provides natural conversational flow.'
  },
  {
    icon: MessageSquare,
    title: 'Real-time Feedback',
    description: 'Receive immediate analysis of your interview answers with specific suggestions for improvement and strengths recognition.'
  },
  {
    icon: Code,
    title: 'Technical Assessment',
    description: 'Practice coding, system design, and problem-solving with industry-relevant scenarios across multiple technology stacks.'
  },
  {
    icon: Briefcase,
    title: 'Industry Specialization',
    description: 'Customize your interview practice for specific roles, companies, and sectors with tailored question sets.'
  },
  {
    icon: Cpu,
    title: 'Semantic Analysis',
    description: 'Our AI evaluates not just keywords but the overall meaning and quality of your responses using advanced NLP techniques.'
  },
  {
    icon: Lightbulb,
    title: 'Personalized Learning Path',
    description: 'Get a custom improvement plan based on your performance that targets your specific areas for development.'
  },
  {
    icon: Users,
    title: 'Mock Peer Interviews',
    description: 'Simulate pair interviews where you can practice both answering and asking technical questions.'
  },
  {
    icon: Eye,
    title: 'Interview Recording & Playback',
    description: 'Review your interview sessions with timestamped feedback to see your improvement over time.'
  },
  {
    icon: FileCheck,
    title: 'Comprehensive Reports',
    description: 'Receive detailed performance analytics highlighting your strengths and areas for improvement across different skills.'
  },
  {
    icon: Database,
    title: 'Extensive Question Bank',
    description: 'Access thousands of real-world interview questions across all levels of difficulty and technical domains.'
  },
  {
    icon: Server,
    title: 'System Design Challenges',
    description: 'Practice architectural discussions with interactive system design scenarios and receive feedback on your approach.'
  },
  {
    icon: Zap,
    title: 'Stress Management Techniques',
    description: 'Learn methods to manage interview anxiety and perform at your best under pressure.'
  }
];
