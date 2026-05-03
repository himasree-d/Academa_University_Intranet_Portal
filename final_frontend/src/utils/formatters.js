// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Format percentage
  export const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
  };
  
  // Format grade (10-point scale)
  export const formatGrade = (score) => {
    const grades = [
      { min: 90, grade: 'A+', points: 10 },
      { min: 80, grade: 'A', points: 9 },
      { min: 70, grade: 'B+', points: 8 },
      { min: 60, grade: 'B', points: 7 },
      { min: 50, grade: 'C+', points: 6 },
      { min: 40, grade: 'C', points: 5 },
      { min: 35, grade: 'D', points: 4 },
      { min: 0, grade: 'F', points: 0 }
    ];
    
    const grade = grades.find(g => score >= g.min);
    return {
      letter: grade.grade,
      points: grade.points
    };
  };
  
  // Format roll number
  export const formatRollNumber = (enrollment) => {
    if (!enrollment) return '';
    const year = enrollment.substring(0, 4);
    const dept = enrollment.substring(4, 6);
    const num = enrollment.substring(6, 9);
    return `${year}-${dept}-${num}`;
  };
  
  // Format phone number (XXX-XXX-XXXX)
  export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
  };
  
  // Format file name (shorten if too long)
  export const formatFileName = (filename, maxLength = 20) => {
    if (!filename) return '';
    if (filename.length <= maxLength) return filename;
    
    const ext = filename.split('.').pop();
    const name = filename.substring(0, filename.lastIndexOf('.'));
    const shortenedName = name.substring(0, maxLength - ext.length - 3);
    return `${shortenedName}...${ext}`;
  };
  
  // Format duration (minutes to hours/minutes)
  export const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };
  
  // Format list with commas and 'and'
  export const formatList = (items) => {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    
    const last = items[items.length - 1];
    const rest = items.slice(0, -1).join(', ');
    return `${rest}, and ${last}`;
  };