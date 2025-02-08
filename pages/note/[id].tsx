import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";

interface Note {
  id: string;
  title: string;
  description: string;
}

export default function NoteEditor() {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Carregar a nota pelo ID
  useEffect(() => {
    if (id) {
      const savedNotes: Note[] = JSON.parse(localStorage.getItem("notes") || "[]");
      const note = savedNotes.find((note) => note.id === id);

      if (note) {
        setTitle(note.title);
        setDescription(note.description);
      }
    }
  }, [id]);

  // Função para salvar alterações
  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      alert("Título e descrição são obrigatórios!");
      return;
    }

    const savedNotes: Note[] = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = savedNotes.map((note) =>
      note.id === id ? { ...note, title, description } : note
    );

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    alert("Nota atualizada com sucesso!");
  };

  return ( 
    <div className="flex flex-col h-screen text-center p-5 justify-center items-center anima ">
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
      ></textarea>

      <button
        className="self-start mt-4 bg-zinc-900 border border-neutral-800 p-2 rounded-md text-xl hover:border-neutral-500 hover:bg-zinc-800 transition"
        onClick={handleSave}
      >
        <Save className="inline-block mr-2" /> Save Note
      </button>
    </div>
  );
}
