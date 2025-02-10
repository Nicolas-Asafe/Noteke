import Link from "next/link";
import { Trash2, Plus, Home, Plug, Table } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";


export default function SideBar() {
    interface Note {
      id: string;
      title: string;
    }

    interface Table {
      id: string;
      title: string;
      createdAt: string;
    }

    const [notes, setNotes] = useState<Note[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const router = useRouter();

    // Carregar notas e tabelas do localStorage ao iniciar
    useEffect(() => {
      const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
      const savedTables = JSON.parse(localStorage.getItem("tables") || "[]");
      if (Array.isArray(savedNotes)) {
        setNotes(savedNotes);
      }
      if (Array.isArray(savedTables)) {
        setTables(savedTables);
      }
    }, []);

    // Função para excluir uma nota ou uma tabela
    const handleDelete = (id: string, type: 'note' | 'table') => {
      if (type === 'note') {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
      } else {
        const updatedTables = tables.filter(table => table.id !== id);
        setTables(updatedTables);
        localStorage.setItem("tables", JSON.stringify(updatedTables));
      }
    };

    // Função para acessar uma nota ou uma tabela (redirecionar para o editor ou para a criação de uma nova tabela)
    const handleItemClick = (id: string, type: 'note' | 'table') => {
      if (type === 'note') {
        router.push(`/note/${id}`);
      } else {
        router.push(`/NewTable?id=${id}`);
      }
    };

    return (
      <div className="bg-neutral-950 text-white w-64 h-screen border-r border-zinc-900 md:flex md:flex-col hidden">
        {/* Sidebar - Será oculta em dispositivos móveis */}
        <header className="p-4">
          <h1 className="text-3xl font-bold">Noteke</h1>
        </header>

        <section className="pt-8 p-3 flex flex-col border-t border-zinc-900">
          <div className="space-y-2 overflow-y-auto h-48 ">
          <Link href={'/'} className="flex justify-between items-center p-1 px-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-neutral-800 hover:border-neutral-500 text-zinc-400">
            Go Home
            <Home size={30} className="p-1 rounded-md hover:bg-neutral-900 hover:text-white transition" />
          </Link>
          <Link href={'/plugins'} className="flex justify-between items-center p-1 px-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-neutral-800 hover:border-neutral-500 text-zinc-400">
            Plugins
            <Plug size={30} className="p-1 rounded-md hover:bg-neutral-900 hover:text-white transition" />
          </Link>

          <Link href={'/NewNote'} className="flex justify-between items-center p-1 px-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-neutral-800 hover:border-neutral-500 text-zinc-400">
            New Note
            <Plus size={30} className="p-1 rounded-md hover:bg-neutral-900 hover:text-white transition" />
          </Link>

          <Link href={'/NewTable'} className="flex justify-between items-center p-1 px-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-neutral-800 hover:border-neutral-500 text-zinc-400">
            New table
            <Table size={30} className="p-1 rounded-md hover:bg-neutral-900 hover:text-white transition" />
          </Link>

          </div>



          {/* Lista unificada de organizadores */}
          <div className="border border-neutral-900 rounded-lg space-y-2">
            <p className="text-slate-200 font-semibold border-b p-2 border-neutral-900">Your Orgs:</p>
            <ul className="space-y-2 p-2 pt-0 h-40 overflow-scroll">
              {[...notes, ...tables].sort((a, b) => {
                const dateA = (b as any).createdAt || new Date().toISOString();
                const dateB = (a as any).createdAt || new Date().toISOString();
                return new Date(dateA).getTime() - new Date(dateB).getTime();
              }).map(item => (
                <li
                  onClick={() => handleItemClick(item.id, 'description' in item ? 'note' : 'table')}
                  key={item.id}
                  className="flex flex-row justify-between items-center transition shadow-md shadow-blackbg-neutral-950 hover:bg-zinc-800 rounded-lg hover:border-neutral-600 cursor-pointer border border-neutral-800"
                >
                  <span className="font-normal text-zinc-400 p-2 truncate" style={{ maxWidth: "calc(100% - 70px)" }}>
                    {item.title || "Untitled"}
                    <span className="text-xs ml-2 text-neutral-500">
                      {'description' in item ? '(Note)' : '(Table)'}
                    </span>
                  </span>
                  <Trash2
                    color="white" size={36} 
                    className="hover:bg-red-600 transition hover:border-transparent rounded-md m-1 p-2 border border-zinc-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id, 'description' in item ? 'note' : 'table');
                    }}
                  />
                </li>
              ))}
              {notes.length === 0 && tables.length === 0 && (
                <p className="text-zinc-400">No orgs found.</p>
              )}
            </ul>
          </div>
        </section>
      </div>
    );
}
