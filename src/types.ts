export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  skills: string;
  status: string;
  price_per_month: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  icon: string;
}

export interface Order {
  id: string;
  user_id: string;
  item_id: string;
  item_type: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  performance_score: number;
  learning_path: string;
  last_active: string;
}

export interface Stats {
  totalStudents: { count: number };
  activeAgents: { count: number };
  tasksCompleted: number;
  retentionRate: string;
  balance: number;
  quota: number;
  hiredCount: number;
}
