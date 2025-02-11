import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { useOrgs } from "@/contexts/OrgsContext";

interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function NoteEditor() {
  const { notes, updateNotes } = useOrgs();
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isMessage, setIsMessage] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");

  // Carregar a nota pelo ID
  useEffect(() => {
    if (id) {
      const note = notes.find((note) => note.id === id);
      if (note) {
        setTitle(note.title);
        setDescription(note.description || "");
      }
    }
  }, [id, notes]);

  // Função para salvar alterações
  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      setColor("red");
      setMessage("Title and description are required!");
      setIsMessage(true);
      return;
    }

    const updatedNotes = notes.map((note) =>
      note.id === id 
        ? { ...note, title, description } 
        : note
    );

    updateNotes(updatedNotes);
    setColor("green");
    setMessage("Note updated successfully!");
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
    <div className="flex flex-col h-screen text-center p-5 md:justify-center items-center md:animaMini anima">
      {isMessage && <MessageContent message={message} color={color} />}
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-neutral-950 p-3 text-3xl outline-none border rounded-md border-neutral-900 hover:border-neutral-600 transition"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-neutral-950 mt-3 p-3 resize-none border outline-none text-2xl h-4/6 rounded-md border-neutral-900 hover:border-neutral-600 transition"
      />

      <button
        className="self-start mt-4 bg-zinc-900 border border-neutral-800 p-2 rounded-md text-xl hover:border-neutral-500 hover:bg-zinc-800 transition"
        onClick={handleSave}
      >
        <Save className="inline-block mr-2" /> Save Note
      </button>
    </div>
  );
}
