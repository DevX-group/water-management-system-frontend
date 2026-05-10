export interface BlogPost {
  id: string;
  title: string;
  category: string;
  image: string;
  content: string;
  author?: string;
  createdAt?: string;
}

export interface BlogFormData {
  title: string;
  category: string;
  image: string;
  content: string;
}
