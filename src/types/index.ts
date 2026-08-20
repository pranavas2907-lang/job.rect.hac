export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  companyLogo: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  category: string;
  experience: 'Fresher' | '1-3 years' | '3-5 years' | '5-8 years' | '8+ years';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  postedDays: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  applicants: number;
  featured?: boolean;
  remote: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  location: string;
  founded: number;
  rating: number;
  reviews: number;
  openJobs: number;
  about: string;
  website: string;
  followers: string;
}

export interface Application {
  jobId: string;
  appliedAt: string;
  status: 'Applied' | 'In Review' | 'Shortlisted' | 'Interview' | 'Rejected' | 'Offer';
  resumeName?: string;
}

export interface Candidate {
  fullName: string;
  email: string;
  phone: string;
  headline: string;
  location: string;
  about: string;
  skills: string[];
  experience: { title: string; company: string; period: string; description: string }[];
  education: { degree: string; school: string; year: string }[];
  resumeName?: string;
  resumeData?: string; // base64 for local demo
}
