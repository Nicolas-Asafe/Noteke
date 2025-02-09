import { Trash2, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  interface Note {
    id: string;
    title: string;
    description: string;
  }

  const router = useRouter();
  const handleNoteClick = (id: string) => {
    router.push(`/note/${id}`);
  };
  const [notes, setNotes] = useState<Note[]>([]);

  // Carregar notas do localStorage ao iniciar
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    if (Array.isArray(savedNotes)) {
      setNotes(savedNotes);
    }
  }, []);

  // Função para excluir uma nota
  const handleDelete = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <div className="flex flex-col w-full h-screen text-center p-5 items-center overflow-scroll ">
      <h1 className="mb-4 font-semibold text-3xl self-start">Your Notes:</h1>

      {/* Lista de notas */}
      <div className="w-full max-w-2xl space-y-4">
        {notes.length > 0 ? (
          notes.map(note => (
            <div key={note.id} className="flex justify-between items-start p-4 bg-neutral-950 border border-neutral-800 rounded-lg shadow-md text-left">
              <div>
              <h2 className="text-2xl font-bold mb-2">{note.title || "Untitled"}</h2>
              <p className="text-lg text-zinc-400 mb-4">{note.description || "No description available."}</p>
              </div>
             <div className="flex flex-col gap-2">
             <button
                onClick={() => handleDelete(note.id)}
                className="flex items-center bg-red-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                <Trash2 className="mr-2" /> Delete
              </button>

              <button
                onClick={() => handleNoteClick(note.id)}
                className="flex items-center bg-green-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                <Edit className="mr-2" /> Edit
              </button>
              
             </div>
            </div>
          ))
        ) : (
          <>
            <Link href={'/NewNote'} className="text-white font-semibold text-2xl flex justify-between items-center p-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-neutral-800 hover:border-neutral-500 ">
            Criar uma
            <p className="text-zinc-400 sm:text-xl text-sm font-normal">Você não tem nenhuma nota</p> 
          </Link>
          </>
          
        )}
      </div>
    </div>
  );
} 
