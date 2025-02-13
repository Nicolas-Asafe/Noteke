import Link from "next/link";
import { Home, Plug, Settings, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useOrgs } from "@/contexts/OrgsContext";
import { OrgItem } from "@/contexts/OrgsContext";

export default function SideBar() {
  const { notes, tables, updateNotes, updateTables } = useOrgs();
  const router = useRouter();

  // Função para excluir uma nota ou uma tabela
  const handleDelete = (item: OrgItem) => {
    if ('data' in item) {
      const updatedTables = tables.filter(table => table.id !== item.id);
      updateTables(updatedTables);
    } else {
      const updatedNotes = notes.filter(note => note.id !== item.id);
      updateNotes(updatedNotes);
    }
  };

  // Função para acessar um item
  const handleItemClick = (item: OrgItem) => {
    switch (item.type) {
      case 'workflow':
        router.push(`/workflow/${item.id}`);
        break;
      case 'checklist':
        router.push(`/checklist/${item.id}`);
        break;
      case 'table':
        router.push(`/NewTable?id=${item.id}`);
        break;
      default:
        router.push(`/note/${item.id}`);
    }
  };

  // Função para determinar o tipo do item
  const getItemType = (item: OrgItem): string => {
    if ('data' in item) return 'Table'; 
    return item.type || 'Note';
  };

  return (
    <div className="bg-neutral-950 text-white w-64 h-screen border-r border-zinc-900 md:flex md:flex-col hidden">
      <header className="p-4">
        <h1 className="text-3xl font-bold">Noteke</h1>
      </header>

      <section className="pt-8 p-3 flex flex-col border-t border-zinc-900">
        <div className="space-y-2 overflow-y-auto mb-4">
          <Link href={'/'} className="flex justify-between items-center p-1 px-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-neutral-800 hover:border-neutral-500 text-zinc-400">
            Go Home
            <Home size={30} className="p-1 rounded-md hover:bg-neutral-900 hover:text-white transition" />
          </Link>
          <Link href={'/plugins'} className="flex justify-between items-center p-1 px-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-neutral-800 hover:border-neutral-500 text-zinc-400">
            Plugins
            <Plug size={30} className="p-1 rounded-md hover:bg-neutral-900 hover:text-white transition" />
          </Link>
          <Link href={'/settings'} className="flex justify-between items-center p-1 px-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-neutral-800 hover:border-neutral-500 text-zinc-400">
            Settings
            <Settings size={30} className="p-1 rounded-md hover:bg-neutral-900 hover:text-white transition" />
          </Link>
        </div>

        {/* Lista unificada de organizadores */}
        <div className="border border-neutral-900 rounded-lg space-y-2">
          <p className="text-slate-200 font-semibold border-b p-2 border-neutral-900">Your Orgs:</p>
          <ul className="space-y-2 p-2 pt-0 h-40 overflow-scroll">
            {[...notes, ...tables].sort((a, b) => {
              const dateA = b.createdAt || new Date().toISOString();
              const dateB = a.createdAt || new Date().toISOString();
              return new Date(dateA).getTime() - new Date(dateB).getTime();
            }).map(item => (
              <li
                onClick={() => handleItemClick(item)}
                key={item.id}
                className="flex flex-row justify-between items-center transition shadow-md shadow-blackbg-neutral-950 hover:bg-zinc-800 rounded-lg hover:border-neutral-600 cursor-pointer border border-neutral-800"
              >
                <span className="font-normal text-zinc-400 p-2 truncate" style={{ maxWidth: "calc(100% - 70px)" }}>
                  {item.title || "Untitled"}
                  <span className="text-xs ml-2 text-neutral-500">
                    ({getItemType(item)})
                  </span>
                </span>
                <Trash2
                  color="white" 
                  size={36} 
                  className="hover:bg-red-600 transition hover:border-transparent rounded-md m-1 p-2 border border-zinc-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item);
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

      <p className="text-zinc-400 text-sm hidden md:block absolute bottom-2 left-2">
        Made by <Link href="https://github.com/Nicolas-Asafe" className="text-zinc-400 hover:text-white">Nicolas Asafe</Link>
      </p>
    </div>
  );
}
