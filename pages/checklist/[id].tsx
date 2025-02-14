import React from 'react';
import { CheckSquare, Save, Plus, X, Trash2, Square } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  createdAt: string;
}

export default function ChecklistEditor() {
  const router = useRouter();
  const { id } = router.query;
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [message, setMessage] = useState<string>("");
  const [isMessage, setIsMessage] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    if (id) {
      const savedChecklists = localStorage.getItem('checklists');
      if (savedChecklists) {
        const checklists = JSON.parse(savedChecklists);
        const foundChecklist = checklists.find((c: Checklist) => c.id === id);
        if (foundChecklist) {
          setChecklist(foundChecklist);
        }
      }
    }
  }, [id]);

  function CloseMessage() {
    setIsMessage(false);
  }

  function MessageContent({message, color}: {message: string, color: string}) {
    const colorClasses = {
      red: "text-red-500",
      green: "text-green-500",
      amber: "text-amber-400",
    };

    return (
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
        <div className="md:ml-32 pointer-events-auto">
          <p className={`animaMini ${colorClasses[color as keyof typeof colorClasses]} border border-neutral-900 bg-black p-2 rounded-md font-semibold cursor-pointer transition flex flex-row gap-4 items-center`}>
            {message}
            <X onClick={CloseMessage} className="border border-neutral-900 rounded-md cursor-pointer" />
          </p>
        </div>
      </div>
    );
  }

  const handleCreateItem = () => {
    if (!newItemText.trim() || !checklist) return;

    const newItem: ChecklistItem = {
      id: uuidv4(),
      text: newItemText,
      completed: false
    };

    const updatedChecklist = {
      ...checklist,
      items: [...checklist.items, newItem]
    };

    setChecklist(updatedChecklist);
    updateChecklistInStorage(updatedChecklist);
    setNewItemText('');
    setIsCreateModalOpen(false);

    setColor("green");
    setMessage("Item criado com sucesso!");
    setIsMessage(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!checklist) return;

    const updatedChecklist = {
      ...checklist,
      items: checklist.items.filter(item => item.id !== itemId)
    };

    setChecklist(updatedChecklist);
    updateChecklistInStorage(updatedChecklist);

    setColor("red");
    setMessage("Item excluído com sucesso!");
    setIsMessage(true);
  };

  const handleToggleItem = (itemId: string) => {
    if (!checklist) return;

    const updatedChecklist = {
      ...checklist,
      items: checklist.items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    };

    setChecklist(updatedChecklist);
    updateChecklistInStorage(updatedChecklist);
  };

  const updateChecklistInStorage = (updatedChecklist: Checklist) => {
    const savedChecklists = localStorage.getItem('checklists');
    if (savedChecklists) {
      const checklists = JSON.parse(savedChecklists);
      const updatedChecklists = checklists.map((c: Checklist) =>
        c.id === updatedChecklist.id ? updatedChecklist : c
      );
      localStorage.setItem('checklists', JSON.stringify(updatedChecklists));
    }
  };

  const getCompletionPercentage = () => {
    if (!checklist || checklist.items.length === 0) return 0;
    const completedItems = checklist.items.filter(item => item.completed).length;
    return Math.round((completedItems / checklist.items.length) * 100);
  };

  if (!checklist) return <div>Carregando...</div>;

  return (
    <div className="w-full min-h-screen flex flex-col p-4 md:p-5">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <CheckSquare className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold truncate">{checklist?.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 md:w-32 bg-neutral-900 h-2 rounded-full">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
              <span className="text-neutral-400 text-xs md:text-sm">
                {getCompletionPercentage()}% complete
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition flex items-center gap-2"
        >
          <Plus size={24} />
        </button>
      </div>

      {isMessage && <MessageContent message={message} color={color} />}

      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            className="bg-neutral-950 p-4 md:p-6 rounded-lg w-full max-w-md border border-neutral-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold">Add New Item</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-neutral-900 rounded-md transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Item text"
              className="w-full bg-neutral-900 p-3 rounded-md border border-neutral-800 mb-4 outline-none focus:border-purple-500"
            />
            <button
              onClick={handleCreateItem}
              className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 transition"
            >
              Add Item
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto -mx-4 md:mx-0 px-4 md:px-0">
        <div className="space-y-2 md:space-y-3">
          {checklist?.items.map(item => (
            <div
              key={item.id}
              className={`bg-neutral-950 border border-neutral-800 rounded-lg p-3 md:p-4 hover:border-neutral-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 ${
                item.completed ? 'bg-opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => handleToggleItem(item.id)}
                  className={`p-2 rounded-md border transition-colors ${
                    item.completed ? 'text-purple-500 border-purple-500' : 'text-neutral-500 border-neutral-500'
                  }`}
                >
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <Square className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </button>
                <span className={`text-sm md:text-lg flex-1 md:flex-initial ${item.completed ? 'line-through text-neutral-500' : ''}`}>
                  {item.text}
                </span>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-2 hover:bg-red-500/20 rounded-md transition ml-auto"
              >
                <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
              </button>
            </div>
          ))}

          {(!checklist?.items || checklist.items.length === 0) && (
            <div className="flex items-center justify-center min-h-[200px]">
              <p className="text-neutral-500 text-sm md:text-base">No items added yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 