import { useState } from 'react';
import { Save, Plus, X, MoveRight, MoveLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useOrgs } from '@/contexts/OrgsContext';
import { Task, OrgItem } from '@/contexts/OrgsContext';

export default function NewWorkflow() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [message, setMessage] = useState('');
  const [isMessage, setIsMessage] = useState(false);
  const [color, setColor] = useState('');

  const { notes, updateNotes } = useOrgs();

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: uuidv4(),
      text: newTaskText,
      status: 'todo'
    };

    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const handleMoveTask = (id: string, direction: 'forward' | 'backward') => {
    setTasks(tasks.map(task => {
      if (task.id !== id) return task;

      const statusMap = {
        todo: { forward: 'doing' as const, backward: 'todo' as const },
        doing: { forward: 'done' as const, backward: 'todo' as const },
        done: { forward: 'done' as const, backward: 'doing' as const }
      };

      return {
        ...task,
        status: statusMap[task.status][direction]
      };
    }));
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter((task: Task) => task.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) {
      setColor('red');
      setMessage('Title is required!');
      setIsMessage(true);
      return;
    }

    const newWorkflow = {
      id: uuidv4(),
      title,
      type: 'workflow' as const,
      tasks,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newWorkflow];
    updateNotes(updatedNotes as OrgItem[]);

    setTitle('');
    setTasks([]);
    setColor('green');
    setMessage('Workflow saved successfully!');
    setIsMessage(true);
  };

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

  const TaskColumn = ({ status, title, color }: { status: Task['status'], title: string, color: string }) => (
    <div className="flex-1 min-w-[300px] p-4 bg-neutral-950 border border-neutral-800 rounded-lg">
      <h3 className={`text-lg font-semibold mb-4 ${color}`}>{title}</h3>
      <div className="space-y-2">
        {tasks
          .filter(task => task.status === status)
          .map(task => (
            <div
              key={task.id}
              className="flex items-center gap-2 p-2 bg-zinc-900 border border-neutral-800 rounded-md group"
            >
              {status !== 'todo' && (
                <button
                  onClick={() => handleMoveTask(task.id, 'backward')}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-blue-500 transition"
                >
                  <MoveLeft size={20} />
                </button>
              )}
              <span className="flex-1">{task.text}</span>
              <div className="flex gap-1">
                {status !== 'done' && (
                  <button
                    onClick={() => handleMoveTask(task.id, 'forward')}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-blue-500 transition"
                  >
                    <MoveRight size={20} />
                  </button>
                )}
                <button
                  onClick={() => handleRemoveTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-600 transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen p-5 animaMini">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex self-start flex-col justify-between items-start gap-2 md:items-center">
          <h1 className="font-semibold text-2xl">Create a new workflow</h1>
        </div>  
        <input
          type="text"
          placeholder="Workflow Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-neutral-950 p-3 text-xl outline-none border rounded-md border-neutral-900 hover:border-neutral-600 transition"
        />
        <div className="flex gap-2 border-b border-neutral-800 pb-4">
          <input
            type="text"
            placeholder="New task"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            className="flex-1 bg-neutral-950 p-2 text-lg outline-none border rounded-md border-neutral-900 hover:border-neutral-600 transition"
          />
          <button
            onClick={handleAddTask}
            className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition"
          >
            <Plus />
          </button>
          <button
            onClick={handleSave}
            className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition"
          >
            <Save />
          </button>
        </div>
      </div>

      {isMessage && <MessageContent message={message} color={color} />}

      <div className="flex-1 overflow-auto mb-4">
        <div className="flex gap-4 min-h-full md:flex-row flex-col">
          <TaskColumn status="todo" title="To Do" color="text-yellow-500" />
          <TaskColumn status="doing" title="Doing" color="text-blue-500" />
          <TaskColumn status="done" title="Done" color="text-green-500" />
        </div>
      </div>
    </div>
  );
} 