export interface SafeProfile {
  _id: any;
  authUserId: string;
  email: string;
  name?: string;
  role?: "admin" | "instructor" | "student" | string;
  onboardingCompleted?: boolean;
}

export interface Course {
  _id: any;
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  categoryId?: string;
  isPublished?: boolean;
  createdAt?: number;
  price?: number;
  chapters?: any[];
}

export interface Category {
  _id: any;
  id?: string;
  name: string;
}

export interface CourseWithProgressWithCategory extends Course {
  progress?: number;
  category?: Category;
}

