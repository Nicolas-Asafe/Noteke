import { Trash2, Edit, Plus, SendHorizontal, X, Eye, Grid2X2Plus,FilePlus } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  interface Note {
    id: string;
    title: string;
    description: string;
  }

  interface Table {
    id: string;
    title: string;
    data: any[][];
    createdAt: string;
  }

  const [message, setMessage] = useState<string>("");
  const [isMessage, setIsMessage] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");   

  const [notes, setNotes] = useState<Note[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

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

  const router = useRouter();
  const handleNoteClick = (id: string) => {
    router.push(`/note/${id}`);
  };

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

  return (
    <div className="md:anima w-full h-screen flex flex-col p-5 overflow-scroll mb-20 md:mb-0 animaMini">
      {isMessage && <MessageContent message={message} color={color} />} 
      
      <div className="flex justify-between items-center w-full mb-4">
        <h1 className="font-semibold text-3xl self-start">Your Orgs</h1>
        <div className='flex gap-2'>
          <Link href={`/NewTable`} className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition">
            <Grid2X2Plus size={26} />
          </Link>
          <Link href={`/NewNote`} className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition">
            <FilePlus size={26} />
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div className="w-full md:max-w-2xl space-y-4">
          {[...notes, ...tables].sort((a, b) => {
            const dateA = (b as any).createdAt || new Date().toISOString();
            const dateB = (a as any).createdAt || new Date().toISOString();
            return new Date(dateA).getTime() - new Date(dateB).getTime();
          }).map(item => (
            'description' in item ? (
              <div key={item.id} className="md:flex-col md:items-start flex gap-2 items-center p-4 bg-neutral-950 border w-auto border-neutral-800 rounded-lg shadow-md text-left">
                <div className="flex flex-col w-10/12 md:w-full">
                 <h2 style={{ maxWidth: "calc(100% - 0px)", }} className="truncate text-2xl font-bold mb-2">{item.title || "Untitled"}</h2>
                 <p style={{ maxWidth: "calc(100% - 0px)", }} className="h-28 md:h-auto pl-2 overflow-y-scroll  p-1 border border-neutral-800 rounded-md text-lg text-zinc-400 ">{item.description || "No description available."}</p>
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
            ) : (
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
            )
          ))}
          
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
