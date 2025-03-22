
export const generateResumePDF = (resumeContent: string): Blob => {
  // In a real application, this would use a library like jsPDF or PDF.js
  // This is a placeholder function that generates a text blob for demonstration
  const blob = new Blob([resumeContent], { type: 'application/pdf' });
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
};
