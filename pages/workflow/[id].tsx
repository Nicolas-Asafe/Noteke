import React from 'react';
import { GitBranch, Save, Plus, X, Trash2, Circle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface Workflow {
  id: string;
  title: string;
  steps: WorkflowStep[];
  createdAt: string;
}

export default function WorkflowEditor() {
  const router = useRouter();
  const { id } = router.query;
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDescription, setNewStepDescription] = useState('');
  const [message, setMessage] = useState<string>("");
  const [isMessage, setIsMessage] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    if (id) {
      const savedWorkflows = localStorage.getItem('workflows');
      if (savedWorkflows) {
        const workflows = JSON.parse(savedWorkflows);
        const foundWorkflow = workflows.find((w: Workflow) => w.id === id);
        if (foundWorkflow) {
          setWorkflow(foundWorkflow);
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

  const handleCreateStep = () => {
    if (!newStepTitle.trim() || !workflow) return;

    const newStep: WorkflowStep = {
      id: uuidv4(),
      title: newStepTitle,
      description: newStepDescription,
      status: 'pending'
    };

    const updatedWorkflow = {
      ...workflow,
      steps: [...workflow.steps, newStep]
    };

    setWorkflow(updatedWorkflow);
    updateWorkflowInStorage(updatedWorkflow);
    setNewStepTitle('');
    setNewStepDescription('');
    setIsCreateModalOpen(false);

    setColor("green");
    setMessage("Etapa criada com sucesso!");
    setIsMessage(true);
  };

  const handleDeleteStep = (stepId: string) => {
    if (!workflow) return;

    const updatedWorkflow = {
      ...workflow,
      steps: workflow.steps.filter(step => step.id !== stepId)
    };

    setWorkflow(updatedWorkflow);
    updateWorkflowInStorage(updatedWorkflow);

    setColor("red");
    setMessage("Etapa excluída com sucesso!");
    setIsMessage(true);
  };

  const handleUpdateStepStatus = (stepId: string) => {
    if (!workflow) return;

    const statusOrder: ('pending' | 'in-progress' | 'completed')[] = ['pending', 'in-progress', 'completed'];
    
    const updatedWorkflow = {
      ...workflow,
      steps: workflow.steps.map(step => {
        if (step.id === stepId) {
          const currentStatusIndex = statusOrder.indexOf(step.status);
          const nextStatus = statusOrder[(currentStatusIndex + 1) % statusOrder.length];
          return { ...step, status: nextStatus };
        }
        return step;
      })
    };

    setWorkflow(updatedWorkflow);
    updateWorkflowInStorage(updatedWorkflow);
  };

  const updateWorkflowInStorage = (updatedWorkflow: Workflow) => {
    const savedWorkflows = localStorage.getItem('workflows');
    if (savedWorkflows) {
      const workflows = JSON.parse(savedWorkflows);
      const updatedWorkflows = workflows.map((w: Workflow) =>
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      );
      localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'in-progress':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      default:
        return 'text-neutral-500';
    }
  };

  if (!workflow) return <div>Carregando...</div>;

  return (
    <div className="w-full min-h-screen flex flex-col p-4 md:p-5">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <GitBranch className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
          </div>
          <h1 className="text-xl md:text-3xl font-bold truncate">{workflow?.title}</h1>
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
              <h2 className="text-lg md:text-xl font-bold">Create New Step</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-neutral-900 rounded-md transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              value={newStepTitle}
              onChange={(e) => setNewStepTitle(e.target.value)}
              placeholder="Step title"
              className="w-full bg-neutral-900 p-3 rounded-md border border-neutral-800 mb-4 outline-none focus:border-green-500"
            />
            <textarea
              value={newStepDescription}
              onChange={(e) => setNewStepDescription(e.target.value)}
              placeholder="Step description"
              className="w-full bg-neutral-900 p-3 rounded-md border border-neutral-800 mb-4 resize-none h-32 outline-none focus:border-green-500"
            />
            <button
              onClick={handleCreateStep}
              className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition"
            >
              Create Step
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto -mx-4 md:mx-0 px-4 md:px-0">
        <div className="space-y-3 md:space-y-4">
          {workflow?.steps.map((step, index) => (
            <div
              key={step.id}
              className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 md:p-6 hover:border-neutral-700 transition-all"
            >
              <div className="flex items-start md:items-center justify-between mb-4 flex-col md:flex-row gap-4 md:gap-0">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button
                    onClick={() => handleUpdateStepStatus(step.id)}
                    className={`p-2 rounded-full border transition-colors ${getStatusColor(step.status)}`}
                  >
                    <Circle className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <div className="flex-1 md:flex-initial">
                    <h3 className="text-lg md:text-xl font-semibold">{step.title}</h3>
                    <span className={`text-sm ${getStatusColor(step.status)}`}>
                      {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteStep(step.id)}
                  className="p-2 hover:bg-red-500/20 rounded-md transition ml-auto md:ml-0"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
              <p className="text-neutral-400 text-sm md:text-base ml-0 md:ml-12">{step.description}</p>
            </div>
          ))}

          {(!workflow?.steps || workflow.steps.length === 0) && (
            <div className="flex items-center justify-center min-h-[200px]">
              <p className="text-neutral-500 text-sm md:text-base">No steps created yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 