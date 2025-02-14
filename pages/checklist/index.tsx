import React from 'react';
import { CheckSquare, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  createdAt: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function ChecklistPlugin() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');

  useEffect(() => {
    const savedChecklists = localStorage.getItem('checklists');
    if (savedChecklists) {
      setChecklists(JSON.parse(savedChecklists));
    }
  }, []);

  const handleCreateChecklist = () => {
    if (!newChecklistTitle.trim()) return;

    const newChecklist: Checklist = {
      id: uuidv4(),
      title: newChecklistTitle,
      items: [],
      createdAt: new Date().toISOString()
    };

    const updatedChecklists = [...checklists, newChecklist];
    setChecklists(updatedChecklists);
    localStorage.setItem('checklists', JSON.stringify(updatedChecklists));
    setNewChecklistTitle('');
    setIsCreateModalOpen(false);
  };

  const getCompletionPercentage = (items: ChecklistItem[]) => {
    if (items.length === 0) return 0;
    const completedItems = items.filter(item => item.completed).length;
    return Math.round((completedItems / items.length) * 100);       
  };

  return (
    <div className="w-full h-screen flex flex-col p-5 overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <CheckSquare className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Seus Checklists</h1>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition flex items-center gap-2"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Modal de criação */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-950 p-6 rounded-lg w-96 border border-neutral-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Criar Novo Checklist</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-neutral-900 rounded-md transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              value={newChecklistTitle}
              onChange={(e) => setNewChecklistTitle(e.target.value)}
              placeholder="Título do checklist"
              className="w-full bg-neutral-900 p-3 rounded-md border border-neutral-800 mb-4"
            />
            <button
              onClick={handleCreateChecklist}
              className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 transition"
            >
              Criar Checklist
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {checklists.map(checklist => (
              <Link
                href={`/checklist/${checklist.id}`}
                key={checklist.id}
                className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <CheckSquare className="w-12 h-12 text-purple-500" />
                  <div>
                    <h2 className="text-xl font-semibold">{checklist.title}</h2>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-neutral-900 h-2 rounded-full">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${getCompletionPercentage(checklist.items)}%` }}
                        />
                      </div>
                      <span className="text-neutral-400 text-sm">
                        {getCompletionPercentage(checklist.items)}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-neutral-500 text-sm">
                  Criado em {new Date(checklist.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>

          {checklists.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-zinc-400 text-xl">Nenhum checklist encontrado</p>
                <p className="text-zinc-600 mt-2">Crie um novo checklist para começar!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 