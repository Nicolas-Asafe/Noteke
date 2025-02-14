import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Trash2, Plus, Plug, Table, Settings, Book, GitBranch, CheckSquare, Edit, SendHorizontal, Eye, X, Grid2X2Plus, FilePlus, Home as HomeIcon } from 'lucide-react';
import MessageContent from '../components/MessageContent';

  interface Note {
    id: string;
    title: string;
    description: string;
  createdAt: string;
  }

  interface Table {
    id: string;
    title: string;
  createdAt: string;
}

interface Book {
  id: string;
  title: string;
  chapters: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  createdAt: string;
}

interface Workflow {
  id: string;
  title: string;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
  }>;
  createdAt: string;
}

interface Checklist {
  id: string;
  title: string;
  items: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
    createdAt: string;
  }

interface Plugin {
  id: string;
  name: string;
  description: string;
  iconType: 'book' | 'workflow' | 'checklist';
  installed: boolean;
  icon: string;
  route: string;
}

interface BaseItem {
  id: string;
  title: string;
  createdAt: string;
  type: 'note' | 'table' | 'book' | 'workflow' | 'checklist';
  description?: string;
  chapters?: Book['chapters'];
  steps?: Workflow['steps'];
  items?: Checklist['items'];
}

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [isMessage, setIsMessage] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");   
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNoteClick = (id: string) => {
    router.push(`/note/${id}`);
  };

  function CloseMessage() {
    setIsMessage(false);
  }

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const savedTables = JSON.parse(localStorage.getItem("tables") || "[]");
    const savedPlugins = localStorage.getItem('plugins');
    const savedBooks = JSON.parse(localStorage.getItem("books") || "[]");
    const savedWorkflows = JSON.parse(localStorage.getItem("workflows") || "[]");
    const savedChecklists = JSON.parse(localStorage.getItem("checklists") || "[]");

    if (Array.isArray(savedNotes)) setNotes(savedNotes);
    if (Array.isArray(savedTables)) setTables(savedTables);
    if (Array.isArray(savedBooks)) setBooks(savedBooks);
    if (Array.isArray(savedWorkflows)) setWorkflows(savedWorkflows);
    if (Array.isArray(savedChecklists)) setChecklists(savedChecklists);
    if (savedPlugins) {
      const parsedPlugins = JSON.parse(savedPlugins);
      setPlugins(parsedPlugins);
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setColor("red");
    setMessage("Note deleted successfully!");
    setIsMessage(true);
  };

  const handleTableClick = (id: string) => {
    router.push(`/NewTable?id=${id}`);
  };

  const handleTableDelete = (id: string) => {
    const updatedTables = tables.filter(table => table.id !== id);
    setTables(updatedTables);
    localStorage.setItem("tables", JSON.stringify(updatedTables));
    setColor("red");
    setMessage("Table deleted successfully!");
    setIsMessage(true);
  };

  const handleShare = async (note: Note) => {
    try {
      const noteContent = {
        title: note.title,
        description: note.description
      };
      
      const encodedNote = encodeURIComponent(JSON.stringify(noteContent));
      const shareUrl = `${window.location.origin}/share?note=${encodedNote}`;
      
      // Verifica se o navegador suporta a API Web Share (comum em dispositivos móveis)
      if (navigator.share) {
        await navigator.share({
          title: note.title,
          text: 'Confira esta nota!',
          url: shareUrl
        });
        
        setColor("green");
        setMessage("Nota compartilhada com sucesso!");
        setIsMessage(true);
      } else {
        // Fallback para desktop - copia para área de transferência
        await navigator.clipboard.writeText(shareUrl);
        
        setColor("green");
        setMessage("Link copiado para área de transferência!");
        setIsMessage(true);
      }
    } catch (error) {
      setColor("red");
      setMessage("Erro ao compartilhar a nota");
      setIsMessage(true);
    }
  };

  const getPluginIcon = (iconType: string, className: string) => {
    switch (iconType) {
      case 'book':
        return <Book className={className} />;
      case 'workflow':
        return <GitBranch className={className} />;
      case 'checklist':
        return <CheckSquare className={className} />;
      default:
        return null;
    }
  };

  const handleBookClick = (id: string) => {
    router.push(`/book/${id}`);
  };

  const handleBookDelete = (id: string) => {
    const updatedBooks = books.filter(book => book.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
    setColor("red");
    setMessage("Livro excluído com sucesso!");
    setIsMessage(true);
  };

  const handleWorkflowClick = (id: string) => {
    router.push(`/workflow/${id}`);
  };

  const handleWorkflowDelete = (id: string) => {
    const updatedWorkflows = workflows.filter(workflow => workflow.id !== id);
    setWorkflows(updatedWorkflows);
    localStorage.setItem("workflows", JSON.stringify(updatedWorkflows));
    setColor("red");
    setMessage("Workflow excluído com sucesso!");
    setIsMessage(true);
  };

  const handleChecklistClick = (id: string) => {
    router.push(`/checklist/${id}`);
  };

  const handleChecklistDelete = (id: string) => {
    const updatedChecklists = checklists.filter(checklist => checklist.id !== id);
    setChecklists(updatedChecklists);
    localStorage.setItem("checklists", JSON.stringify(updatedChecklists));
    setColor("red");
    setMessage("Checklist excluído com sucesso!");
    setIsMessage(true);
  };

  const getCompletionPercentage = (items: any[]) => {
    if (items.length === 0) return 0;
    const completedItems = items.filter(item => item.completed).length;
    return Math.round((completedItems / items.length) * 100);
  };

  const allItems = [
    ...notes.map(note => ({ ...note, type: 'note' as const })),
    ...tables.map(table => ({ ...table, type: 'table' as const })),
    ...books.map(book => ({ ...book, type: 'book' as const })),
    ...workflows.map(workflow => ({ ...workflow, type: 'workflow' as const })),
    ...checklists.map(checklist => ({ ...checklist, type: 'checklist' as const }))
  ].sort((a, b) => {
    const dateA = a.createdAt || new Date().toISOString();
    const dateB = b.createdAt || new Date().toISOString();
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  }) as BaseItem[];

  const renderItem = (item: BaseItem) => {
    switch (item.type) {
      case 'note':
        return (
              <div key={item.id} className="md:flex-col md:items-start flex gap-2 items-center p-4 bg-neutral-950 border w-auto border-neutral-800 rounded-lg shadow-md text-left">
                <div className="flex flex-col w-10/12 md:w-full">
                 <h2 style={{ maxWidth: "calc(100% - 0px)", }} className="truncate text-2xl font-bold mb-2">{item.title || "Untitled"}</h2>
              <p style={{ maxWidth: "calc(100% - 0px)", }} className="h-28 md:h-auto pl-2 overflow-y-scroll p-1 border border-neutral-800 rounded-md text-lg text-zinc-400">{item.description || "No description available."}</p>
                </div> 
                <div className="flex flex-col md:flex-row gap-2 border border-neutral-800 rounded-md p-2 w-auto">
               <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center bg-red-600 text-white font-semibold p-2 rounded-md hover:bg-red-700 transition"
                >
                  <Trash2 className="" scale={36}/> 
                </button>
                <button
                  onClick={() => handleNoteClick(item.id)}
                  className="flex items-center bg-green-600 text-white font-semibold p-2 rounded-md hover:bg-green-700 transition"
                >
                  <Edit className="" scale={36}/> 
                </button>
                <button
                  onClick={() => handleShare(item as Note)}
                  className="flex items-center bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 transition"
                >
                  <SendHorizontal className="" scale={36}/> 
                </button>
               </div>
              </div>
        );
      case 'table':
        return (
              <div key={item.id} className="md:flex-col md:items-start flex gap-2 items-center p-4 bg-neutral-950 border w-auto border-neutral-800 rounded-lg shadow-md text-left">
                <div className="flex flex-col w-10/12 md:w-full">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-2xl font-bold">{item.title || "Untitled"}</h2>
                    <span className="text-sm text-neutral-500">(Table)</span>
                  </div>
                  <p className="text-zinc-400">Created: {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2 border border-neutral-800 rounded-md p-2 w-auto">
                  <button
                    onClick={() => handleTableDelete(item.id)}
                    className="flex items-center bg-red-600 text-white font-semibold p-2 rounded-md hover:bg-red-700 transition"
                  >
                    <Trash2 className="" scale={36}/> 
                  </button>
                  <button
                    onClick={() => handleTableClick(item.id)}
                    className="flex items-center bg-green-600 text-white font-semibold p-2 rounded-md hover:bg-green-700 transition"
                  >
                    <Edit className="" scale={36}/> 
                  </button>
                  <Link
                    href={`/table/${item.id}`}
                    className="flex items-center bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 transition"
                  >
                    <Eye className="" scale={36}/> 
                  </Link>
                </div>
              </div>
        );
      case 'book':
        return (
          <div key={item.id} className="md:flex-col md:items-start flex gap-2 items-center p-4 bg-neutral-950 border w-auto border-neutral-800 rounded-lg shadow-md text-left">
            <div className="flex flex-col w-10/12 md:w-full">
              <div className="flex items-center gap-2">
                <Book className="w-6 h-6 text-blue-500" />
                <h2 className="truncate text-2xl font-bold">{item.title || "Untitled"}</h2>
              </div>
              <p className="text-zinc-400">
                {item.chapters?.length || 0} {item.chapters?.length === 1 ? 'capítulo' : 'capítulos'}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 border border-neutral-800 rounded-md p-2 w-auto">
              <button
                onClick={() => handleBookDelete(item.id)}
                className="flex items-center bg-red-600 text-white font-semibold p-2 rounded-md hover:bg-red-700 transition"
              >
                <Trash2 className="" scale={36}/> 
              </button>
              <button
                onClick={() => handleBookClick(item.id)}
                className="flex items-center bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 transition"
              >
                <Edit className="" scale={36}/> 
              </button>
            </div>
          </div>
        );
      case 'workflow':
        return (
          <div key={item.id} className="md:flex-col md:items-start flex gap-2 items-center p-4 bg-neutral-950 border w-auto border-neutral-800 rounded-lg shadow-md text-left">
            <div className="flex flex-col w-10/12 md:w-full">
              <div className="flex items-center gap-2">
                <GitBranch className="w-6 h-6 text-green-500" />
                <h2 className="truncate text-2xl font-bold">{item.title || "Untitled"}</h2>
              </div>
              <p className="text-zinc-400">
                {item.steps?.length || 0} {item.steps?.length === 1 ? 'etapa' : 'etapas'}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 border border-neutral-800 rounded-md p-2 w-auto">
              <button
                onClick={() => handleWorkflowDelete(item.id)}
                className="flex items-center bg-red-600 text-white font-semibold p-2 rounded-md hover:bg-red-700 transition"
              >
                <Trash2 className="" scale={36}/> 
              </button>
              <button
                onClick={() => handleWorkflowClick(item.id)}
                className="flex items-center bg-green-600 text-white font-semibold p-2 rounded-md hover:bg-green-700 transition"
              >
                <Edit className="" scale={36}/> 
              </button>
            </div>
          </div>
        );
      case 'checklist':
        return (
          <div key={item.id} className="md:flex-col md:items-start flex gap-2 items-center p-4 bg-neutral-950 border w-auto border-neutral-800 rounded-lg shadow-md text-left">
            <div className="flex flex-col w-10/12 md:w-full">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-6 h-6 text-purple-500" />
                <h2 className="truncate text-2xl font-bold">{item.title || "Untitled"}</h2>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-full bg-neutral-900 h-2 rounded-full">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${getCompletionPercentage(item.items || [])}%` }}
                  />
                </div>
                <span className="text-neutral-400 text-sm">
                  {getCompletionPercentage(item.items || [])}%
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 border border-neutral-800 rounded-md p-2 w-auto">
              <button
                onClick={() => handleChecklistDelete(item.id)}
                className="flex items-center bg-red-600 text-white font-semibold p-2 rounded-md hover:bg-red-700 transition"
              >
                <Trash2 className="" scale={36}/> 
              </button>
              <button
                onClick={() => handleChecklistClick(item.id)}
                className="flex items-center bg-purple-600 text-white font-semibold p-2 rounded-md hover:bg-purple-700 transition"
              >
                <Edit className="" scale={36}/> 
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col p-5 overflow-hidden">
      {isMessage && (
        <MessageContent 
          message={message} 
          color={color} 
          onClose={CloseMessage} 
        />
      )}
      
      <div className="flex justify-between items-center w-full mb-4">
        <h1 className="font-semibold text-2xl md:text-3xl self-start">Your Orgs</h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition flex items-center gap-2"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Sidebar para criar orgs */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isSidebarOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        } z-40`} 
        onClick={() => setIsSidebarOpen(false)}
      >
        <div 
          className={`fixed inset-y-0 right-0 w-[90%] md:w-80 bg-neutral-950 shadow-xl border-l border-neutral-800 transition-transform duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-neutral-800">
              <h2 className="text-xl font-bold">Create New Org</h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-neutral-900 rounded-md transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <Link 
                href="/NewTable"
                className="w-full flex items-center gap-3 p-4 bg-zinc-900 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Grid2X2Plus className="w-6 h-6" />
                <span className="font-medium">New Table</span>
              </Link>

              <Link 
                href="/NewNote"
                className="w-full flex items-center gap-3 p-4 bg-zinc-900 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FilePlus className="w-6 h-6" />
                <span className="font-medium">New Note</span>
              </Link>

              {plugins.filter(plugin => plugin.installed).map(plugin => (
                <Link
                  key={plugin.id}
                  href={`/${plugin.id}`}
                  className="w-full flex items-center gap-3 p-4 bg-zinc-900 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {getPluginIcon(plugin.iconType, "w-6 h-6")}
                  <span className="font-medium">New {plugin.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden pb-16 md:pb-0">
        <div className="h-full overflow-y-auto px-0 md:px-4">
          <div className="w-full md:max-w-2xl mx-auto space-y-4">
            {allItems.map(item => (
              <div key={item.id} className='transition-all'>
                {renderItem(item)}
              </div>
            ))}

            {allItems.length === 0 && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <p className="text-zinc-400 text-xl">No organizations found</p>
                  <p className="text-zinc-600 mt-2">Create a new note, table or use a plugin to get started!</p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
} 
