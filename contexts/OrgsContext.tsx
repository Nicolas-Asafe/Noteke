import { createContext, useContext, useState, useEffect } from 'react';

export interface BaseItem {
  id: string;
  title: string;
  createdAt: string;
}

export interface Note extends BaseItem {
  type?: 'note';
  description: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Checklist extends BaseItem {
  type: 'checklist';
  items: ChecklistItem[];
}

export interface Task {
  id: string;
  text: string;
  status: 'todo' | 'doing' | 'done';
}

export interface Workflow extends BaseItem {
  type: 'workflow';
  tasks: Task[];
}

export interface Table extends BaseItem {
  type: 'table';
  data: any[][];
}

export type OrgItem = Note | Checklist | Workflow | Table;

interface OrgsContextType {
  notes: OrgItem[];
  tables: Table[];
  updateNotes: (newNotes: OrgItem[]) => void;
  updateTables: (newTables: Table[]) => void;
}

const OrgsContext = createContext<OrgsContextType | undefined>(undefined);

export function OrgsProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<OrgItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedTables = localStorage.getItem('tables');
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    if (savedTables) {
      setTables(JSON.parse(savedTables));
    }
  }, []);

  const updateNotes = (newNotes: OrgItem[]) => {
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };

  const updateTables = (newTables: Table[]) => {
    setTables(newTables);
    localStorage.setItem('tables', JSON.stringify(newTables));
  };

  return (
    <OrgsContext.Provider value={{ notes, tables, updateNotes, updateTables }}>
      {children}
    </OrgsContext.Provider>
  );
}

export function useOrgs() {
  const context = useContext(OrgsContext);
  if (context === undefined) {
    throw new Error('useOrgs must be used within a OrgsProvider');
  }
  return context;
} 