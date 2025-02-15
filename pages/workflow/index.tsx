import React from 'react';
import { GitBranch, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

interface Workflow {
  id: string;
  title: string;
  steps: WorkflowStep[];
  createdAt: string;
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export default function WorkflowPlugin() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkflowTitle, setNewWorkflowTitle] = useState('');

  useEffect(() => {
    const savedWorkflows = localStorage.getItem('workflows');
    if (savedWorkflows) {
      setWorkflows(JSON.parse(savedWorkflows));
    }
  }, []);

  const handleCreateWorkflow = () => {
    if (!newWorkflowTitle.trim()) return;

    const newWorkflow: Workflow = {
      id: uuidv4(),
      title: newWorkflowTitle,
      steps: [],
      createdAt: new Date().toISOString()
    };

    const updatedWorkflows = [...workflows, newWorkflow];
    setWorkflows(updatedWorkflows);
    localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));
    setNewWorkflowTitle('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="w-full h-screen flex flex-col p-5 overflow-hidden animaMini">
      <div className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <GitBranch className="w-8 h-8 text-green-500" />
          <h1 className="text-3xl font-bold">Seus Workflows</h1>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-950 p-6 rounded-lg w-96 border border-neutral-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Criar Novo Workflow</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-neutral-900 rounded-md transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              value={newWorkflowTitle}
              onChange={(e) => setNewWorkflowTitle(e.target.value)}
              placeholder="Título do workflow"
              className="w-full bg-neutral-900 p-3 rounded-md border border-neutral-800 mb-4"
            />
            <button
              onClick={handleCreateWorkflow}
              className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition"
            >
              Criar Workflow
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 h-[80dvh] overflow-y-auto">
        <div className="h-full mb-16 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map(workflow => (
              <Link
                href={`/workflow/${workflow.id}`}
                key={workflow.id}
                className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <GitBranch className="w-12 h-12 text-green-500" />
                  <div>
                    <h2 className="text-xl font-semibold">{workflow.title}</h2>
                    <p className="text-neutral-400">
                      {workflow.steps.length} {workflow.steps.length === 1 ? 'etapa' : 'etapas'}
                    </p>
                  </div>
                </div>
                <p className="text-neutral-500 text-sm">
                  Criado em {new Date(workflow.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>

          {workflows.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-zinc-400 text-xl">Nenhum workflow encontrado</p>
                <p className="text-zinc-600 mt-2">Crie um novo workflow para começar!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 