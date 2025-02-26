import { useState, useEffect } from 'react';
import { Save, Plus, Minus, Download, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';

interface Cell {
  value: string; 
  id: string;
}

export default function NewTable() {
  const router = useRouter();

  // Criar uma matriz 8x8 inicial
  const createInitialGrid = () => {
    const grid: Cell[][] = [];
    for (let i = 0; i < 8; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < 8; j++) {
        row.push({ value: '', id: uuidv4() });
      }
      grid.push(row);
    }
    return grid;
  };

  const [rows, setRows] = useState<Cell[][]>(createInitialGrid());
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isMessage, setIsMessage] = useState<boolean>(false);
  const [color, setColor] = useState<string>('');

  // Carregar tabela existente se estiver editando
  useEffect(() => {
    const tableId = router.query.id;
    if (tableId) {
      const tables = JSON.parse(localStorage.getItem('tables') || '[]');
      const table = tables.find((t: any) => t.id === tableId);
      if (table) {
        setTitle(table.title);
        setRows(table.data);
      }
    }
  }, [router.query]);

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

  const addRow = () => {
    const newRow = Array(rows[0].length).fill('').map(() => ({ value: '', id: uuidv4() }));
    setRows([...rows, newRow]);
  };

  const addColumn = () => {
    const newRows = rows.map(row => [...row, { value: '', id: uuidv4() }]);
    setRows(newRows);
  };

  const removeRow = () => {
    if (rows.length > 1) {
      const newRows = rows.slice(0, -1);
      setRows(newRows);
    }
  };

  const removeColumn = () => {
    if (rows[0].length > 1) {
      const newRows = rows.map(row => row.slice(0, -1));
      setRows(newRows);
    }
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex].value = value;
    setRows(newRows);
  };

  const handleSave = () => {
    if (!title.trim()) {
      setColor('red');
      setMessage('Por favor, adicione um título à tabela!');
      setIsMessage(true);
      return;
    }

    const tableId = router.query.id;
    const tables = JSON.parse(localStorage.getItem('tables') || '[]');
    
    const newTable = {
      id: tableId || uuidv4(),
      title,
      data: rows,
      createdAt: new Date().toISOString(),
    };

    if (tableId) {
      // Atualizar tabela existente
      const tableIndex = tables.findIndex((t: any) => t.id === tableId);
      if (tableIndex !== -1) {
        tables[tableIndex] = newTable;
      }
    } else {
      // Adicionar nova tabela
      tables.push(newTable);
    }

    localStorage.setItem('tables', JSON.stringify(tables));
    
    setColor('green');
    setMessage('Tabela salva com sucesso!');
    setIsMessage(true);

    if (!tableId) {
      // Limpar formulário após salvar nova tabela
      setTitle('');
      setRows(createInitialGrid());
    }
  };

  const handleDownload = () => {
    let csvContent = '';
    
    // Converter dados para CSV
    rows.forEach(row => {
      const rowContent = row.map(cell => `"${cell.value}"`).join(',');
      csvContent += rowContent + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title || 'table'}.csv`;
    link.click();

    setColor('amber');
    setMessage('Tabela baixada com sucesso!');
    setIsMessage(true);
  };

  // Função para converter número em letra (1 -> A, 2 -> B, etc)
  const getColumnLabel = (index: number): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index] || '';
  };

  return (
    <div className="animao md:anima flex flex-col h-[86vh] p-5">
      <div className="flex flex-col gap-4 mb-4">
        <div className='flex justify-between items-center'>
        <h1 className="font-semibold text-2xl">Create a new table</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition"
          >
            <Save />
          </button>
          <button
            onClick={handleDownload}
            className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition"
          >
            <Download />
          </button>
        </div>
        </div>
        <input
          type="text"
          placeholder="Table Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-neutral-950 p-3 text-xl outline-none border rounded-md border-neutral-900 hover:border-neutral-600 transition"
        />

        

        <div className="flex gap-2  md:justify-normal justify-center">
          <button
            onClick={addRow}
            className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition flex items-center gap-1"
          >
            <Plus size={16} /> Row
          </button>
          <button
            onClick={addColumn}
            className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition flex items-center gap-1"
          >
            <Plus size={16} /> Colls
          </button>
          <button
            onClick={removeRow}
            className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition flex items-center gap-1"
          >
            <Minus size={16} /> Row
          </button>
          <button
            onClick={removeColumn}
            className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition flex items-center gap-1"
          >
            <Minus size={16} /> Colls
          </button>
        </div>
      </div>

      {isMessage && <MessageContent message={message} color={color} />}

      <div className="relative flex-1 overflow-hidden border border-neutral-800 rounded-md ">
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div className="overflow-auto h-full">
            <table className="w-full border-collapse relative">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="sticky left-0 z-20 w-12 border border-neutral-800 p-2 bg-zinc-900"></th>
                  {rows[0].map((_, colIndex) => (
                    <th key={colIndex} className="min-w-[120px] border border-neutral-800 p-2 bg-zinc-900 font-semibold">
                      {getColumnLabel(colIndex)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="sticky left-0 z-10 border border-neutral-800 p-2 bg-zinc-900 font-semibold text-center">
                      {rowIndex + 1}
                    </td>
                    {row.map((cell, colIndex) => (
                      <td key={cell.id} className="border border-neutral-800 p-1 min-w-[120px]">
                        <input
                          type="text"
                          value={cell.value}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          className="w-full rounded-sm bg-neutral-950 p-2 outline-none focus:bg-zinc-900 transition"
                          aria-label={`${getColumnLabel(colIndex)}${rowIndex + 1}`}
                        />
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
