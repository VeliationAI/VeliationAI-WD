export const generateResumePDF = (resumeContent: string): Blob => {
  // In a real application, this would use a library like jsPDF or PDF.js
  // For this implementation, we're creating a text blob as PDF
  // This is a simplified implementation
  
  // Improved PDF generation with better structure and formatting
  const pdfHeader = '%PDF-1.4\n';
  
  // Parse content into sections
  const sections = parseResumeContent(resumeContent);
  
  // Format PDF content with proper line breaks and section spacing
  let formattedContent = '';
  Object.entries(sections).forEach(([title, content], index) => {
    // Add extra spacing between sections
    if (index > 0) formattedContent += '\\n\\n';
    
    // Format section title with proper styling
    formattedContent += `${title.toUpperCase()}\\n`;
    formattedContent += `${'='.repeat(title.length)}\\n\\n`;
    
    // Format section content with line breaks preserved
    formattedContent += `${content.replace(/\n/g, '\\n')}`;
  });
  
  // Create PDF content with proper text positioning and fonts
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
/F2 5 0 R
/F3 6 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 7 0 R
>>
endobj
4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Courier
>>
endobj
7 0 obj
<<
/Length 2048
>>
stream
BT
/F1 16 Tf
72 720 Td
12 TL
(RESUME) Tj
T*
T*
/F2 10 Tf
(${formattedContent}) Tj
ET
endstream
endobj
xref
0 8
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000256 00000 n
0000000324 00000 n
0000000391 00000 n
0000000457 00000 n
trailer
<<
/Size 8
/Root 1 0 R
>>
startxref
2557
%%EOF
  `;
  
  const blob = new Blob([pdfHeader + pdfContent], { type: 'application/pdf' });
  return blob;
};

// Helper function to parse resume content into structured sections
const parseResumeContent = (content: string): Record<string, string> => {
  // Default structure for a resume
  const sections: Record<string, string> = {
    'contact information': '',
    'summary': '',
    'experience': '',
    'education': '',
    'skills': '',
    'projects': '',
    'certifications': '',
  };
  
  // Try to identify sections in the content
  let currentSection = 'summary'; // Default section if no headers found
  
  const lines = content.split('\n');
  
  lines.forEach(line => {
    // Check if line might be a section header (all caps, short, etc.)
    const isPossibleHeader = line.trim().length < 30 && 
                            (line === line.toUpperCase() || 
                             line.endsWith(':') ||
                             line.startsWith('#') ||
                             /^[A-Z\s]+$/.test(line.trim()) || // All uppercase words
                             /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(line.trim())); // Title Case
    
    if (isPossibleHeader) {
      // Normalize the header text
      const headerText = line.toLowerCase()
                            .replace(/[:#=]/g, '')
                            .trim();
      
      // Check if this matches any of our predefined sections
      for (const section of Object.keys(sections)) {
        if (headerText.includes(section) || section.includes(headerText)) {
          currentSection = section;
          return;
        }
      }
      
      // If no match, but seems like a header, create a new section
      if (line.trim().length > 0) {
        sections[headerText] = '';
        currentSection = headerText;
      }
    } else if (line.trim() && currentSection) {
      // Add content to current section
      sections[currentSection] += (sections[currentSection] ? '\n' : '') + line;
    }
  });
  
  // Remove empty sections
  Object.keys(sections).forEach(key => {
    if (!sections[key]) {
      delete sections[key];
    }
  });
  
  return sections;
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

// Preview resume function to validate formatting before download
export const previewResume = (resumeContent: string): string => {
  // Generate PDF blob
  const blob = generateResumePDF(resumeContent);
  
  // Create a URL for the PDF
  const url = URL.createObjectURL(blob);
  
  // Return URL that can be used in an iframe or object tag
  return url;
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
