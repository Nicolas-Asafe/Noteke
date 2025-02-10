import { Save, Image, Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
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

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    if (savedNotes.length > 0) {
      setTitle(savedNotes[0].title);
      setDescription(savedNotes[0].description);
    }
  }, []);  

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      setColor("red");
      setMessage("Title and description are required!");
      setIsMessage(true); 
      return;

    }

    const newNote = {
      id: uuidv4(),
      title,
      description,
      createdAt: new Date().toISOString(),
    };

    const existingNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = [...existingNotes, newNote];
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setTitle("");
    setDescription("");
    setColor("green");
    setMessage("Note saved successfully!");
    setIsMessage(true);

  };

  const handleDownload = () => {
    const markdownContent = `# ${title}\n\n${description}`; 
    
    const blob = new Blob([markdownContent], { type: 'text/markdown' }); 
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = `${title || "untitled"}.md`;
    link.click();

    setColor("amber");
    setMessage("Note downloaded successfully!");
    setIsMessage(true);

  };
 
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen p-5 animaMini">
      <div className="flex flex-col gap-4 mb-2">
        <div className="flex md:flex-row flex-col justify-between items-start gap-2 md:items-center">
          <h1 className="font-semibold text-2xl">Create a new note here</h1>
          <div className="flex gap-2">
            <button
              className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition"
              aria-label="Download note"
              onClick={handleDownload}
            >
              <Download />
            </button>
            <button
              className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition"
              aria-label="Save note"
              onClick={handleSave}
            >
              <Save />
            </button>
            <button 
              className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition" 
              aria-label="Change cover"
            >
              <Image />
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-neutral-950 p-3 text-xl outline-none border rounded-md border-neutral-900 hover:border-neutral-600 transition"
        />
      </div>

      {isMessage && <MessageContent message={message} color={color} />}

      <div className="flex-1 min-h-0">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-full w-full bg-neutral-950 p-3 resize-none border outline-none text-lg rounded-md border-neutral-900 hover:border-neutral-600 transition"
        />
      </div>
    </div>
  );
}
