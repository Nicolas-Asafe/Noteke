import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { useOrgs } from "@/contexts/OrgsContext";
import { Note, OrgItem } from '@/contexts/OrgsContext';

export default function NoteEditor() {
  const router = useRouter();
  const { id } = router.query;
  const { notes, updateNotes } = useOrgs();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isMessage, setIsMessage] = useState(false);
  const [color, setColor] = useState('');

  useEffect(() => {
    if (id) {
      const note = notes.find(note => note.id === id);
      // Verifica se é uma nota (tem description)
      if (note && 'description' in note) {
        setTitle(note.title);
        setDescription(note.description);
      }
    }
  }, [id, notes]);

  const handleSave = () => {
    if (!title.trim()) {
      setColor('red');
      setMessage('Title is required!');
      setIsMessage(true);
      return;
    }

    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { 
            ...note, 
            title, 
            description,
            type: 'note' as const 
          }
        : note
    );

    updateNotes(updatedNotes as OrgItem[]);
    setColor('green');
    setMessage('Note updated successfully!');
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
    <div className="flex flex-col md:h-screen p-5 animao">
      <div className="flex flex-col gap-4">
        <div className="flex self-start w-full justify-between items-start gap-2 md:items-center">
          <h1 className="font-semibold text-2xl">Edit note</h1>
          <button
            onClick={handleSave}
            className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition"
          >
            <Save />
          </button>
        </div>
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
          className="w-full bg-neutral-950 p-3 text-xl outline-none border rounded-md border-neutral-900 hover:border-neutral-600 transition"
        />
        <div className="gap-2 border-b border-neutral-800 pb-4">
          <textarea
            placeholder="Note content..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-[59dvh] w-full resize-none bg-neutral-950 p-2 text-lg outline-none border rounded-md border-neutral-900 hover:border-neutral-600 transition min-h-[200px]"
          />
          
        </div>
      </div>

      {isMessage && <MessageContent message={message} color={color} />}
    </div>
  );
}
