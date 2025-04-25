export interface Plugin {
  id: string;
  name: string;
  description: string;
  type: 'checklist' | 'workflow';
  installed: boolean;
  icon: string;
}

export interface Checklist {
  id: string;
  title: string;
  items: {
    id: string;
    text: string;
    checked: boolean;
  }[];
  createdAt: string;
}

export interface Workflow {
  id: string;
  title: string;
  tasks: {
    id: string;
    text: string;
    status: 'todo' | 'doing' | 'done';
  }[];
  createdAt: string;
} 