import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface SharedNote {
  title: string;
  description: string;
}

export default function SharePage() {
  const [note, setNote] = useState<SharedNote | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (router.query.note) {
      try {
        const decodedNote = JSON.parse(decodeURIComponent(router.query.note as string));
        setNote(decodedNote);
      } catch (error) {
        console.error('Erro ao decodificar a nota:', error);
      }
    }
  }, [router.query]);

  if (!note) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Carregando nota...</p>
      </div>
    );
  }

  return (
    <div className="animaMini md:anima flex flex-col h-screen p-5 md:justify-center ">
      <h1 className="font-semibold text-2xl mb-3 self-start">Nota Compartilhada</h1>
      
      <div className="w-full bg-neutral-950 p-3 text-3xl border rounded-md border-neutral-900">
        {note.title}
      </div>

      <div className="w-full bg-neutral-950 mt-3 p-3 text-2xl border rounded-md border-neutral-900 h-3/5">
        {note.description}
      </div>
    </div>
  );
} 