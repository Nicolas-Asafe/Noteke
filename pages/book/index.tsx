import React from 'react';
import { Book, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

interface BookType {
  id: string;
  title: string;
  chapters: Chapter[];
  createdAt: string;
  lastModified: string;
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function BookPlugin() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');

  useEffect(() => {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  const handleCreateBook = () => {
    if (!newBookTitle.trim()) return;

    const now = new Date().toISOString();
    const newBook: BookType = {
      id: uuidv4(),
      title: newBookTitle,
      chapters: [],
      createdAt: now,
      lastModified: now
    };

    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    setNewBookTitle('');
    setIsCreateModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="w-full min-h-screen flex flex-col p-4 md:p-5">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <Book className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl md:text-3xl font-bold">Your Books</h1>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition flex items-center gap-2"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Modal de criação */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            className="bg-neutral-950 p-6 rounded-lg w-full max-w-md border border-neutral-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Book</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-neutral-900 rounded-md transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
              placeholder="Book title"
              className="w-full bg-neutral-900 p-3 rounded-md border border-neutral-800 mb-4 outline-none focus:border-blue-500"
            />
            <button
              onClick={handleCreateBook}
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
            >
              Create Book
            </button>
          </div> 
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto -mx-4 md:mx-0 px-4 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {books.map(book => (
              <Link
                href={`/book/${book.id}`}
                key={book.id}
                className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 md:p-6 hover:border-neutral-700 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 group-hover:border-blue-500/30 transition-all">
                    <Book className="w-8 h-8 md:w-12 md:h-12 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold">{book.title}</h2>
                    <p className="text-neutral-400 text-sm md:text-base">
                      {book.chapters.length} {book.chapters.length === 1 ? 'chapter' : 'chapters'}
                    </p>
                  </div>
                </div>
                <div className="space-y-1 text-xs md:text-sm">
                  <p className="text-neutral-500">
                    Created: {formatDate(book.createdAt)}
                  </p>
                  <p className="text-neutral-500">
                    Last modified: {formatDate(book.lastModified)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {books.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-zinc-400 text-xl">No books found</p>
                <p className="text-zinc-600 mt-2">Create a new book to get started!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 