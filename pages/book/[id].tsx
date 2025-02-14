import React from 'react';
import { Book, Save, Plus, X, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

interface Chapter {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Book {
  id: string;
  title: string;
  chapters: Chapter[];
  createdAt: string;
  lastModified: string;
}

export default function BookEditor() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState<Book | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isMessage, setIsMessage] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    if (id) {
      const savedBooks = localStorage.getItem('books');
      if (savedBooks) {
        const books = JSON.parse(savedBooks);
        const foundBook = books.find((b: Book) => b.id === id);
        if (foundBook) {
          setBook(foundBook);
        }
      }
    }
  }, [id]);

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

  const handleCreateChapter = () => {
    if (!newChapterTitle.trim() || !book) return;

    const newChapter: Chapter = {
      id: uuidv4(),
      title: newChapterTitle,
      content: '',
      createdAt: new Date().toISOString()
    };

    const updatedBook = {
      ...book,
      chapters: [...book.chapters, newChapter],
      lastModified: new Date().toISOString()
    };

    setBook(updatedBook);
    updateBookInStorage(updatedBook);
    setNewChapterTitle('');
    setIsCreateModalOpen(false);
    setSelectedChapter(newChapter);

    setColor("green");
    setMessage("Capítulo criado com sucesso!");
    setIsMessage(true);
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (!book) return;

    const updatedBook = {
      ...book,
      chapters: book.chapters.filter(chapter => chapter.id !== chapterId),
      lastModified: new Date().toISOString()
    };

    setBook(updatedBook);
    updateBookInStorage(updatedBook);
    setSelectedChapter(null);

    setColor("red");
    setMessage("Capítulo excluído com sucesso!");
    setIsMessage(true);
  };

  const handleSaveChapter = () => {
    if (!book || !selectedChapter) return;

    const updatedBook = {
      ...book,
      chapters: book.chapters.map(chapter =>
        chapter.id === selectedChapter.id ? selectedChapter : chapter
      ),
      lastModified: new Date().toISOString()
    };

    setBook(updatedBook);
    updateBookInStorage(updatedBook);

    setColor("green");
    setMessage("Capítulo salvo com sucesso!");
    setIsMessage(true);
  };

  const updateBookInStorage = (updatedBook: Book) => {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
      const books = JSON.parse(savedBooks);
      const updatedBooks = books.map((b: Book) =>
        b.id === updatedBook.id ? updatedBook : b
      );
      localStorage.setItem('books', JSON.stringify(updatedBooks));
    }
  };

  if (!book) return <div>Carregando...</div>;

  return (
    <div className="w-full min-h-screen flex flex-col p-4 md:p-5">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Book className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
          </div>
          <h1 className="text-xl md:text-3xl font-bold truncate">{book?.title}</h1>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition flex items-center gap-2"
        >
          <Plus size={24} />
        </button>
      </div>

      {isMessage && <MessageContent message={message} color={color} />}

      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            className="bg-neutral-950 p-4 md:p-6 rounded-lg w-full max-w-md border border-neutral-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold">Create New Chapter</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-neutral-900 rounded-md transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="Chapter title"
              className="w-full bg-neutral-900 p-3 rounded-md border border-neutral-800 mb-4 outline-none focus:border-blue-500"
            />
            <button
              onClick={handleCreateChapter}
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
            >
              Create Chapter
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
        {/* Lista de capítulos */}
        <div className="w-full md:w-64 h-48 md:h-auto overflow-y-auto border border-neutral-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Chapters</h2>
          <div className="space-y-2">
            {book?.chapters.map(chapter => (
              <div
                key={chapter.id}
                className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                  selectedChapter?.id === chapter.id
                    ? 'bg-blue-500/10 border border-blue-500/20'
                    : 'bg-neutral-900 border border-neutral-800 hover:border-neutral-700'
                }`}
                onClick={() => setSelectedChapter(chapter)}
              >
                <span className="truncate text-sm md:text-base">{chapter.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChapter(chapter.id);
                  }}
                  className="p-1 hover:bg-red-500/20 rounded-md transition"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor de capítulo */}
        {selectedChapter ? (
          <div className="flex-1 flex flex-col overflow-hidden border border-neutral-800 rounded-lg p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-4">
              <input
                type="text"
                value={selectedChapter.title}
                onChange={(e) => setSelectedChapter({
                  ...selectedChapter,
                  title: e.target.value
                })}
                className="text-lg md:text-xl font-semibold bg-transparent border-b border-neutral-800 focus:border-blue-500 outline-none px-2 py-1 w-full md:w-auto"
              />
              <button
                onClick={handleSaveChapter}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2 w-full md:w-auto justify-center"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
            <textarea
              value={selectedChapter.content}
              onChange={(e) => setSelectedChapter({
                ...selectedChapter,
                content: e.target.value
              })}
              className="flex-1 bg-neutral-900 p-4 rounded-lg border border-neutral-800 resize-none outline-none focus:border-blue-500 text-sm md:text-base"
              placeholder="Chapter content..."
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center border border-neutral-800 rounded-lg">
            <p className="text-neutral-500 text-sm md:text-base">Select a chapter to edit</p>
          </div>
        )}
      </div>
    </div>
  );
} 