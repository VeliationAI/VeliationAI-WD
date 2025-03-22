
export const generateResumePDF = (resumeContent: string): Blob => {
  // In a real application, this would use a library like jsPDF or PDF.js
  // For this implementation, we're creating a text blob as PDF
  // This is a simplified implementation
  
  // Create a PDF-like blob with proper formatting
  const pdfHeader = '%PDF-1.4\n';
  const pdfContent = `
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 5 0 R
>>
endobj
4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
5 0 obj
<<
/Length 68
>>
stream
BT
/F1 12 Tf
72 720 Td
(${resumeContent.replace(/\n/g, '\\n')}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000234 00000 n
0000000302 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
421
%%EOF
  `;
  
  const blob = new Blob([pdfHeader + pdfContent], { type: 'application/pdf' });
  return blob;
};

export const downloadResume = (resumeContent: string, filename = 'resume.pdf') => {
  const blob = generateResumePDF(resumeContent);
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
  
  return { success: true, message: "Resume downloaded successfully" };
};

// ATS score prediction simulation
export const analyzeResumeForATS = (resumeContent: string, jobDescription: string = ""): {
  score: number;
  strengths: string[];
  improvements: string[];
  keywordMatches: {keyword: string, count: number}[];
} => {
  // This is a simplified simulation of ATS analysis
  // In a real application, this would use NLP to compare the resume with job description
  
  const score = Math.floor(Math.random() * 30) + 65; // 65-95 range
  
  // Extract "skills" from resume content
  const extractedKeywords = extractKeywords(resumeContent);
  
  // Compare with job description if provided
  const keywordMatches = jobDescription 
    ? matchKeywords(extractedKeywords, jobDescription)
    : extractedKeywords.map(keyword => ({ keyword, count: 1 }));
  
  return {
    score,
    strengths: [
      "Good use of action verbs",
      "Clear section headings",
      "Quantifiable achievements included",
      "Consistent formatting throughout"
    ],
    improvements: [
      "Add more industry-specific keywords",
      "Include more quantifiable metrics",
      "Ensure all dates are in consistent format",
      "Consider adding a skills summary section"
    ],
    keywordMatches: keywordMatches.slice(0, 5) // Only return top 5 matches
  };
};

// Helper function to extract keywords from text
const extractKeywords = (text: string): string[] => {
  // In a real application, this would use NLP
  // For now, we'll extract words that might be skills
  const commonSkills = [
    "JavaScript", "React", "Node.js", "Python", "Java", "TypeScript",
    "AWS", "Docker", "Kubernetes", "CI/CD", "DevOps", "Agile",
    "Leadership", "Management", "Communication", "Problem-solving",
    "Data Analysis", "Machine Learning", "AI", "SQL", "NoSQL"
  ];
  
  const foundSkills = commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  
  return foundSkills.length > 0 ? foundSkills : ["Communication", "Technical skills", "Problem-solving"];
};

// Helper function to match keywords against job description
const matchKeywords = (keywords: string[], jobDescription: string): {keyword: string, count: number}[] => {
  return keywords
    .map(keyword => ({
      keyword,
      count: (jobDescription.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
    }))
    .filter(match => match.count > 0)
    .sort((a, b) => b.count - a.count);
};
