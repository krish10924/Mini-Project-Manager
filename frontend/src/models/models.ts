export interface UserRegisterDto {
  username: string;
  password: string;
}

export interface UserLoginDto {
  username: string;
  password: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  userId: number;
  tasks?: TaskItem[];
}

export interface TaskItem {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  projectId: number;
}
