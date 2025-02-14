import Link from "next/link";
import { Trash2, Plus, Home, Plug, Table, Settings, Book, GitBranch, CheckSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Note {
  id: string;
  title: string;
}

interface Table {
  id: string;
  title: string;
  createdAt: string;
}

interface Book {
  id: string;
  title: string;
  chapters: any[];
  createdAt: string;
}

interface Workflow {
  id: string;
  title: string;
  steps: any[];
  createdAt: string;
}

interface Checklist {
  id: string;
  title: string;
  items: any[];
  createdAt: string;
}

export default function SideBar() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const savedTables = JSON.parse(localStorage.getItem("tables") || "[]");
    const savedBooks = JSON.parse(localStorage.getItem("books") || "[]");
    const savedWorkflows = JSON.parse(localStorage.getItem("workflows") || "[]");
    const savedChecklists = JSON.parse(localStorage.getItem("checklists") || "[]");

    if (Array.isArray(savedNotes)) setNotes(savedNotes);
    if (Array.isArray(savedTables)) setTables(savedTables);
    if (Array.isArray(savedBooks)) setBooks(savedBooks);
    if (Array.isArray(savedWorkflows)) setWorkflows(savedWorkflows);
    if (Array.isArray(savedChecklists)) setChecklists(savedChecklists);
  }, []);

  const handleDelete = (id: string, type: 'note' | 'table' | 'book' | 'workflow' | 'checklist') => {
    switch (type) {
      case 'note':
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        break;
      case 'table':
        const updatedTables = tables.filter(table => table.id !== id);
        setTables(updatedTables);
        localStorage.setItem("tables", JSON.stringify(updatedTables));
        break;
      case 'book':
        const updatedBooks = books.filter(book => book.id !== id);
        setBooks(updatedBooks);
        localStorage.setItem("books", JSON.stringify(updatedBooks));
        break;
      case 'workflow':
        const updatedWorkflows = workflows.filter(workflow => workflow.id !== id);
        setWorkflows(updatedWorkflows);
        localStorage.setItem("workflows", JSON.stringify(updatedWorkflows));
        break;
      case 'checklist':
        const updatedChecklists = checklists.filter(checklist => checklist.id !== id);
        setChecklists(updatedChecklists);
        localStorage.setItem("checklists", JSON.stringify(updatedChecklists));
        break;
    }
  };

  const handleItemClick = (id: string, type: 'note' | 'table' | 'book' | 'workflow' | 'checklist') => {
    switch (type) {
      case 'note':
        router.push(`/note/${id}`);
        break;
      case 'table':
        router.push(`/table/${id}`);
        break;
      case 'book':
        router.push(`/book/${id}`);
        break;
      case 'workflow':
        router.push(`/workflow/${id}`);
        break;
      case 'checklist':
        router.push(`/checklist/${id}`);
        break;
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <Book className="w-4 h-4 text-blue-500" />;
      case 'workflow':
        return <GitBranch className="w-4 h-4 text-green-500" />;
      case 'checklist':
        return <CheckSquare className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const allItems = [
    ...notes.map(note => ({ ...note, type: 'note' })),
    ...tables.map(table => ({ ...table, type: 'table' })),
    ...books.map(book => ({ ...book, type: 'book' })),
    ...workflows.map(workflow => ({ ...workflow, type: 'workflow' })),
    ...checklists.map(checklist => ({ ...checklist, type: 'checklist' }))
  ].sort((a, b) => {
    const dateA = (a as any).createdAt || new Date().toISOString();
    const dateB = (b as any).createdAt || new Date().toISOString();
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

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
          <Link href={'/plugins'} className="flex justify-between items-center p-1 px-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-neutral-800 hover:border-neutral-500 text-zinc-400">
            Settings
            <Settings size={30} className="p-1 rounded-md hover:bg-neutral-900 hover:text-white transition" />
          </Link>
        </div>

        <div className="border border-neutral-900 rounded-lg space-y-2">
          <p className="text-slate-200 font-semibold border-b p-2 border-neutral-900">Your Orgs:</p>
          <ul className="space-y-2 p-2 pt-0 h-40 overflow-scroll">
            {allItems.map(item => (
              <li
                onClick={() => handleItemClick(item.id, item.type as any)}
                key={item.id}
                className="flex flex-row justify-between items-center transition shadow-md shadow-blackbg-neutral-950 hover:bg-zinc-800 rounded-lg hover:border-neutral-600 cursor-pointer border border-neutral-800"
              >
                <span className="font-normal text-zinc-400 p-2 truncate flex items-center gap-2" style={{ maxWidth: "calc(100% - 70px)" }}>
                  {getItemIcon(item.type)}
                  {item.title || "Untitled"}
                  <span className="text-xs ml-2 text-neutral-500">
                    ({item.type.charAt(0).toUpperCase() + item.type.slice(1)})
                  </span>
                </span>
                <Trash2
                  color="white" size={36} 
                  className="hover:bg-red-600 transition hover:border-transparent rounded-md m-1 p-2 border border-zinc-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id, item.type as any);
                  }}
                />
              </li>
            ))}
            {allItems.length === 0 && (
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
