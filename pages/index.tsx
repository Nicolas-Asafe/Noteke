import { Trash2, Edit, Plus, SendHorizontal, X, Eye, Grid2X2Plus,FilePlus, Table, ListChecks, GitBranch } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MobileSidebar } from "@/components/MobileSidebar";
import { getAvailableOrgs } from "@/utils/getOrgs";
import { useOrgs } from "@/contexts/OrgsContext";
import { isPluginEnabled, PLUGIN_IDS } from '@/utils/pluginManager';

interface BaseItem {
  id: string;
  title: string;
  createdAt: string;
}

interface Note extends BaseItem {
  type?: 'note';
  description: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface Checklist extends BaseItem {
  type: 'checklist';
  items: ChecklistItem[];
}

interface Task {
  id: string;
  text: string;
  status: 'todo' | 'doing' | 'done';
}

interface Workflow extends BaseItem {
  type: 'workflow';
  tasks: Task[];
}

interface Table extends BaseItem {
  type: 'table';
  data: any[][];
}

type OrgItem = Note | Checklist | Workflow | Table;

export default function Home() {   
  const [message, setMessage] = useState<string>("");
  const [isMessage, setIsMessage] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");   

  const { notes, tables, updateNotes, updateTables } = useOrgs();
  const [availableOrgs, setAvailableOrgs] = useState<any[]>([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const router = useRouter();

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

  const handleItemClick = (item: OrgItem) => {
    switch (item.type) {
      case 'workflow':
        if (!isPluginEnabled(PLUGIN_IDS.WORKFLOW)) {
          setColor('amber');
          setMessage('Workflow plugin not installed. Install it from the plugins page.');
          setIsMessage(true);
          return;
        }
        router.push(`/workflow/${item.id}`);
        break;
      case 'checklist':
        if (!isPluginEnabled(PLUGIN_IDS.CHECKLIST)) {
          setColor('amber');
          setMessage('Checklist plugin not installed. Install it from the plugins page.');
          setIsMessage(true);
          return;
        }
        router.push(`/checklist/${item.id}`);
        break;
      case 'table':
        router.push(`/NewTable?id=${item.id}`);
        break;
      default:
        router.push(`/note/${item.id}`);
    }
  };

  useEffect(() => {
    setAvailableOrgs(getAvailableOrgs());
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [isSidebarOpen]);

  const handleDelete = (item: OrgItem) => {
    try {
      if ('data' in item) {
        const updatedTables = tables.filter(table => table.id !== item.id);
        updateTables(updatedTables);
        setColor("red");
        setMessage("Table deleted successfully!");
      } else {
        const updatedNotes = notes.filter(note => note.id !== item.id);
        updateNotes(updatedNotes);
        setColor("red");
        setMessage(`${item.type || 'Note'} deleted successfully!`);
      }
      setIsMessage(true);
    } catch (error) {
      setColor("red");
      setMessage("Error deleting item");
      setIsMessage(true);
    }
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

  const getIcon = (iconName: string, size: number = 26) => {
    switch (iconName) {
      case 'Plus': return <Plus size={size} />;
      case 'Table': return <Table size={size} />;
      case 'ListChecks': return <ListChecks size={size} />;
      case 'GitBranch': return <GitBranch size={size} />;
      default: return <Plus size={size} />;
    }
  };

  const handleOrgClick = (path: string) => {
    router.push(path);
  };

  const getItemType = (item: OrgItem): string => {
    if ('data' in item) return 'Table';
    return item.type || 'Note';
  };

  return (
    <div className="anima md:animaMini w-full h-[calc(100vh-80px)] md:h-screen flex flex-col p-5 overflow-auto">
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {isMessage && <MessageContent message={message} color={color} />} 
      
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-3xl">Your Orgs</h1>
        </div>
        <div className='md:flex gap-2 hidden'>
          {availableOrgs.map(org => (
            <button 
              key={org.id}
              onClick={() => handleOrgClick(org.path)}
              className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition"
              title={`Create new ${org.name.toLowerCase()}`}
            >
              {getIcon(org.icon)}
            </button>
          ))}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsSidebarOpen(!isSidebarOpen);
          }} 
          className="md:hidden bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition"
        >
          <Plus size={26} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center overflow-auto">
        <div className="w-full md:max-w-2xl space-y-4 pb-20 md:pb-0">
          {[...notes, ...tables].sort((a, b) => {
            const dateA = b.createdAt || new Date().toISOString();
            const dateB = a.createdAt || new Date().toISOString();
            return new Date(dateA).getTime() - new Date(dateB).getTime();
          }).map((item: OrgItem) => {
            return (
              <div key={item.id} className="md:flex-col md:items-start flex gap-2 items-center p-4 bg-neutral-950 border w-auto border-neutral-800 rounded-lg shadow-md text-left">
                <div className="flex flex-col w-10/12 md:w-full">
                  <h2 style={{ maxWidth: "calc(100% - 0px)", }} className="truncate text-2xl font-bold mb-2">
                    {item.title || "Untitled"}
                  </h2>
                  {/* Renderiza o conteúdo apropriado baseado no tipo */}
                  {item.type === 'checklist' ? (
                    <div className="h-28 md:h-auto pl-2 overflow-y-scroll p-1 border border-neutral-800 rounded-md text-lg text-zinc-400">
                      {item.items?.map(checkItem => (
                        <div key={checkItem.id} className="flex items-center gap-2">
                          <span className={checkItem.checked ? 'line-through' : ''}>
                            {checkItem.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : item.type === 'workflow' ? (
                    <div className="h-28 md:h-auto pl-2 overflow-y-scroll p-1 border border-neutral-800 rounded-md text-lg text-zinc-400">
                      <div className="flex gap-4">
                        <div>
                          <p className="text-yellow-500">To Do: {item.tasks?.filter(t => t.status === 'todo').length || 0}</p>
                        </div>
                        <div>
                          <p className="text-blue-500">Doing: {item.tasks?.filter(t => t.status === 'doing').length || 0}</p>
                        </div>
                        <div>
                          <p className="text-green-500">Done: {item.tasks?.filter(t => t.status === 'done').length || 0}</p>
                        </div>
                      </div>
                    </div>
                  ) : 'data' in item ? (
                    <div className="h-28 md:h-auto pl-2 overflow-y-scroll p-1 border border-neutral-800 rounded-md text-lg text-zinc-400">
                      {/* Preview da tabela */}
                      Table preview
                    </div>
                  ) : (
                    <p style={{ maxWidth: "calc(100% - 0px)", }} className="h-28 md:h-auto pl-2 overflow-y-scroll p-1 border border-neutral-800 rounded-md text-lg text-zinc-400">
                      {item.description || "No description available."}
                    </p>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-2 border border-neutral-800 rounded-md p-2 w-auto">
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex items-center bg-red-600 text-white font-semibold p-2 rounded-md hover:bg-red-700 transition"
                  >
                    <Trash2 className="" scale={36}/> 
                  </button>

                  <button
                    onClick={() => handleItemClick(item)}
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
                  
                  <span className="text-xs ml-2 text-neutral-500">
                    ({getItemType(item)})
                  </span>
                </div>
              </div>
            );
          })}
          
          {notes.length === 0 && tables.length === 0 && (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <div className="text-center">
                <p className="text-zinc-400 text-xl">No orgs found.</p>
                <p className="text-zinc-600 mt-2">Create a new note or table to get started!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
