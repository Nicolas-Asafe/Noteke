import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Edit } from 'lucide-react';
import Link from 'next/link';

interface Cell {
  value: string;
  id: string;
}

export default function ViewTable() {
  const router = useRouter();
  const { id } = router.query;
  const [table, setTable] = useState<{title: string, data: Cell[][]} | null>(null);

  // Função para converter número em letra (1 -> A, 2 -> B, etc)
  const getColumnLabel = (index: number): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index] || '';
  };

  useEffect(() => {
    if (id) {
      const tables = JSON.parse(localStorage.getItem('tables') || '[]');
      const foundTable = tables.find((t: any) => t.id === id);
      if (foundTable) {
        setTable(foundTable);
      }
    }
  }, [id]);

  if (!table) return <div>Carregando...</div>;

  return (
    <div className="animao md:anima flex flex-col h-[86vh] p-5">
      <div className="flex flex-col gap-4 mb-4">
        <div className='flex justify-between items-center'>
          <h1 className="font-semibold text-2xl">{table.title}</h1>
          <Link
            href={`/NewTable?id=${id}`}
            className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition"
          >
            <Edit />
          </Link>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden border border-neutral-800 rounded-md">
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div className="overflow-auto h-full">
            <table className="w-full border-collapse relative">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="sticky left-0 z-20 w-12 border border-neutral-800 p-2 bg-zinc-900"></th>
                  {table.data[0].map((_, colIndex) => (
                    <th key={colIndex} className="min-w-[120px] border border-neutral-800 p-2 bg-zinc-900 font-semibold">
                      {getColumnLabel(colIndex)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="sticky left-0 z-10 border border-neutral-800 p-2 bg-zinc-900 font-semibold text-center">
                      {rowIndex + 1}
                    </td>
                    {row.map((cell) => (
                      <td key={cell.id} className="border border-neutral-800 p-2 min-w-[120px]">
                        <div className="w-full rounded-sm bg-neutral-950 p-2">
                          {cell.value}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 