// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "TechNova Solutions",
    location: "San Francisco, CA (Remote)",
    type: "Full-time",
    salary: "$120K - $150K",
    posted: "2 days ago",
    description: "We're looking for a senior full stack developer with expertise in React, Node.js, and cloud technologies to join our growing team.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    matched: 95,
    applied: false,
    logo: "https://picsum.photos/seed/technova/200/200",
    companySize: "100-500 employees",
    linkedinEasyApply: true
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "AnalyticsMind Inc.",
    location: "New York, NY (Hybrid)",
    type: "Full-time",
    salary: "$110K - $140K",
    posted: "1 week ago",
    description: "Join our data science team to develop machine learning models and analytics solutions for our enterprise clients.",
    skills: ["Python", "TensorFlow", "PyTorch", "SQL", "Data Visualization"],
    matched: 87,
    applied: false,
    logo: "https://picsum.photos/seed/analytics/200/200",
    companySize: "50-100 employees",
    linkedinEasyApply: true
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "DesignFirst Creative",
    location: "Austin, TX (On-site)",
    type: "Contract",
    salary: "$90K - $120K",
    posted: "3 days ago",
    description: "We are seeking a talented UX/UI designer to create stunning, user-friendly interfaces for our clients in the healthcare sector.",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Wireframing"],
    matched: 78,
    applied: false,
    logo: "https://picsum.photos/seed/design/200/200",
    companySize: "10-50 employees",
    linkedinEasyApply: false
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudScale Technologies",
    location: "Boston, MA (Remote)",
    type: "Full-time",
    salary: "$115K - $145K",
    posted: "5 days ago",
    description: "Looking for a DevOps engineer to build and maintain our cloud infrastructure and CI/CD pipelines.",
    skills: ["Kubernetes", "AWS", "Terraform", "Jenkins", "Docker"],
    matched: 92,
    applied: false,
    logo: "https://picsum.photos/seed/cloudscale/200/200",
    companySize: "100-500 employees",
    linkedinEasyApply: true
  },
  {
    id: 5,
    title: "Machine Learning Engineer",
    company: "AI Innovations",
    location: "Seattle, WA (Remote)",
    type: "Full-time",
    salary: "$130K - $160K",
    posted: "1 day ago",
    description: "Join our team developing cutting-edge ML models for computer vision and natural language processing applications.",
    skills: ["Python", "PyTorch", "TensorFlow", "Computer Vision", "NLP"],
    matched: 91,
    applied: false,
    logo: "https://picsum.photos/seed/aiinnovations/200/200",
    companySize: "50-100 employees",
    linkedinEasyApply: true
  }
];

export const getJobRecommendations = async (userSkills = [], userLocation = "") => {
  // In a real app, this would call a backend API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a deeper copy of the mock data to prevent modification issues
  return JSON.parse(JSON.stringify(mockJobs));
};

export const submitJobApplication = async (jobId: number) => {
  // In a real app, this would call a backend API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { success: true, message: "Application submitted successfully" };
};

export const getAIRecommendations = async (resumeData = null) => {
  // In a real app, this would call a backend API that analyzes the resume
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return personalized recommendations (just mock data for now)
  return mockJobs.slice(0, 3).map(job => ({
    ...job,
    matched: Math.floor(Math.random() * 20) + 80, // 80-100 match score
    reasonsForMatch: [
      "Skills align with job requirements",
      "Experience level matches the role",
      "Location preference compatible"
    ]
  }));
};
