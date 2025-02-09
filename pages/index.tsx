import { Trash2, Edit, Plus,SendHorizontal,X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  interface Note {
    id: string;
    title: string;
    description: string;
  }
  const [message, setMessage] = useState<string>("");
  const [isMessage, setIsMessage] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");   


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
      <p className={`anima ${colorClasses[color as keyof typeof colorClasses]} border border-neutral-900 bg-black p-2 rounded-md font-semibold cursor-pointer transition absolute top-1/2  flex flex-row gap-4 items-center`}>
          {message}
          <X onClick={CloseMessage} className="border border-neutral-900 rounded-md cursor-pointer" />
      </p>
    )
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
    setColor("red");
    setMessage("Note deleted successfully!");
    setIsMessage(true);
  };

  return (
    <div className="md:anima flex flex-col w-full h-screen text-center p-5 items-center overflow-scroll mb-20 md:mb-0 animaMini ">
      {isMessage && <MessageContent message={message} color={color} />}
      <h1 className="mb-4 font-semibold text-3xl self-start">Your Notes:</h1>

      {/* Lista de notas */}
      <div className="w-full md:max-w-2xl space-y-4">
        {notes.length > 0 ? (
          notes.map(note => (
            <div key={note.id} className="md:flex-col md:items-start flex gap-2 items-center p-4 bg-neutral-950 border w-auto border-neutral-800 rounded-lg shadow-md text-left">
              <div className="flex flex-col w-10/12 md:w-full">
               <h2 style={{ maxWidth: "calc(100% - 0px)", }} className="truncate text-2xl font-bold mb-2">{note.title || "Untitled"}</h2>
               <p style={{ maxWidth: "calc(100% - 0px)", }} className="h-28 md:h-auto pl-2 overflow-y-scroll  p-1 border border-neutral-800 rounded-md text-lg text-zinc-400 ">{note.description || "No description available."}</p>
              </div> 
              <div className="flex flex-col md:flex-row gap-2 border border-neutral-800 rounded-md p-2 w-auto">
             <button
                onClick={() => handleDelete(note.id)}
                className="flex items-center bg-red-600 text-white font-semibold p-2 rounded-md hover:bg-red-700 transition"
              >
                <Trash2 className="" scale={36}/> 
              </button>

              <button
                onClick={() => handleNoteClick(note.id)}
                className="flex items-center bg-green-600 text-white font-semibold p-2 rounded-md hover:bg-green-700 transition"
              >
                <Edit className="" scale={36}/> 
              </button>

              <button
                onClick={() => handleNoteClick(note.id)}
                className="flex items-center bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 transition"
              >
                <SendHorizontal className="" scale={36}/> 
              </button>
              
             </div>
            </div>
          ))
        ) : (
          <> 
            <Link href={'/NewNote'} className="text-white font-semibold text-2xl flex justify-between items-center p-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-neutral-800 hover:border-neutral-500 ">
            Create a note
            <Plus className="ml-2" />
          </Link>
          </>
          
        )}
      </div>
    </div>
  );
} 
