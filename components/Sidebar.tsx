import Link from "next/link";
import { Trash2, Plus, Home, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SideBar() {
    interface Note {
      id: string;
      title: string;
    }

    const [notes, setNotes] = useState<Note[]>([]);
    const router = useRouter();

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

    // Função para acessar uma nota (redirecionar para o editor)
    const handleNoteClick = (id: string) => {
      router.push(`/note/${id}`);
    };

    return (
      <div className="bg-neutral-950 text-white w-64 h-screen border-r border-zinc-900 md:flex md:flex-col hidden">
        {/* Sidebar - Será oculta em dispositivos móveis */}
        <header className="p-4">
          <h1 className="text-3xl font-bold">Notes</h1>
        </header>

        <section className="pt-8 p-3 space-y-2 flex flex-col border-t border-zinc-900">
          <Link href={'/'} className="flex justify-between items-center p-1 px-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-neutral-800 hover:border-neutral-500 text-zinc-400">
            Go Home
            <Home size={30} className="p-1 rounded-md hover:bg-neutral-900 hover:text-white transition" />
          </Link>

          <Link href={'/NewNote'} className="flex justify-between items-center p-1 px-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-neutral-800 hover:border-neutral-500 text-zinc-400">
            New Note
            <Plus size={30} className="p-1 rounded-md hover:bg-neutral-900 hover:text-white transition" />
          </Link>

          <Link href={'/explorer'} className="flex justify-between items-center p-1 px-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-neutral-800 hover:border-neutral-500 text-zinc-400">
            Explorer
            <Search size={30} className="p-1 rounded-md hover:bg-neutral-900 hover:text-white transition" />
          </Link>

          {/* Lista de notas */}
          <div className="border border-neutral-900 rounded-lg space-y-2">
            <p className="text-slate-200 font-semibold border-b p-2 border-neutral-900">Your notes:</p>
            <ul className="space-y-2 p-2 pt-0 h-70 overflow-scroll">
              {notes.length > 0 ? (
                notes.map(note => (
                  <li
                    onClick={() => handleNoteClick(note.id)}
                    key={note.id}
                    className="flex flex-row justify-between items-center transition shadow-md shadow-blackbg-neutral-950 hover:bg-zinc-800 rounded-lg hover:border-neutral-600 cursor-pointer border border-neutral-800"
                    role="listitem"
                  >
                    <span className="font-normal text-zinc-400 p-2 truncate" style={{ maxWidth: "calc(100% - 70px)" }}>
                      {note.title || "Untitled"}
                    </span>

                    <Trash2
                      color="white" size={36} className="hover:bg-red-600 transition hover:border-transparent rounded-md m-1 p-2 border border-zinc-800"
                      onClick={() => handleDelete(note.id)}
                    />
                  </li>
                ))
              ) : ( 
                <p className="text-zinc-400">No note found.</p>
              )}
            </ul>
          </div>
        </section>
      </div>
    );
}
