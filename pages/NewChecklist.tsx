import { useState } from 'react';
import { Save, Plus, X, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useOrgs } from '@/contexts/OrgsContext';
import { OrgItem } from '@/contexts/OrgsContext';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export default function NewChecklist() {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [message, setMessage] = useState('');
  const [isMessage, setIsMessage] = useState(false);
  const [color, setColor] = useState('');

  const { notes, updateNotes } = useOrgs();

  const handleAddItem = () => {
    if (!newItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: uuidv4(),
      text: newItemText,
      checked: false
    };

    setItems([...items, newItem]);
    setNewItemText('');
  };

  const handleToggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) {
      setColor('red');
      setMessage('Title is required!');
      setIsMessage(true);
      return;
    }

    const newChecklist = {
      id: uuidv4(),
      title,
      type: 'checklist',
      items,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newChecklist];
    updateNotes(updatedNotes as OrgItem[]);

    setTitle('');
    setItems([]);
    setColor('green');
    setMessage('Checklist saved successfully!');
    setIsMessage(true);
  };

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

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen p-5 animaMini">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex md:flex-row flex-col justify-between items-start gap-2 md:items-center">
          <h1 className="font-semibold text-2xl">Create a new checklist</h1>
        
        </div>

        <input
          type="text"
          placeholder="Checklist Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-neutral-950 p-3 text-xl outline-none border rounded-md border-neutral-900 hover:border-neutral-600 transition"
        />
      </div>

      {isMessage && <MessageContent message={message} color={color} />}

      <div className="flex gap-2 border-b border-neutral-800 pb-4">
        <input
          type="text"
          placeholder="New item"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          className="flex-1 bg-neutral-950 p-2 text-lg outline-none border rounded-md border-neutral-900 hover:border-neutral-600 transition"
        />
        <button
          onClick={handleAddItem}
          className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition"
        >
          <Plus />
        </button>
        <button
            onClick={handleSave}
            className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition"
          >
            <Save />
          </button>
      </div>

      <div className="flex-1 overflow-auto mb-10">
        <div className="space-y-2"> 
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 bg-neutral-950 border border-neutral-800 rounded-md group"
            >
              <button
                onClick={() => handleToggleItem(item.id)}
                className={`p-2 rounded-md transition ${
                  item.checked ? 'bg-green-600' : 'bg-zinc-800'
                }`}
              >
                <Check size={20} className={item.checked ? 'text-white' : 'text-neutral-500'} />
              </button>
              <span className={`flex-1 ${item.checked ? 'line-through text-neutral-500' : ''}`}>
                {item.text}
              </span>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-950 rounded-md transition"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 