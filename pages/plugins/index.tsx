import { Download, Check, ListChecks, GitBranch } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Plugin } from '@/types/plugins';

const availablePlugins: Plugin[] = [
  {
    id: '1',
    name: 'Checklist',
    description: 'Create simple checklists to track your tasks',
    type: 'checklist',
    installed: false,
    icon: 'ListChecks'
  },
  {
    id: '2',
    name: 'Workflow',
    description: 'Create kanban-style workflows to manage your tasks',
    type: 'workflow',
    installed: false,
    icon: 'GitBranch'
  }
];

export default function Plugins() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Carregar plugins instalados do localStorage
    const installedPlugins = JSON.parse(localStorage.getItem('installed_plugins') || '[]');
    const updatedPlugins = availablePlugins.map(plugin => ({
      ...plugin,
      installed: installedPlugins.includes(plugin.id)
    }));
    setPlugins(updatedPlugins);
  }, []);

  const handleInstall = (plugin: Plugin) => {
    // Atualizar estado local
    const updatedPlugins = plugins.map(p => 
      p.id === plugin.id ? { ...p, installed: true } : p
    );
    setPlugins(updatedPlugins);

    // Salvar no localStorage
    const installedPlugins = updatedPlugins
      .filter(p => p.installed)
      .map(p => p.id);
    localStorage.setItem('installed_plugins', JSON.stringify(installedPlugins));

    // Mostrar mensagem
    setMessage(`${plugin.name} installed successfully!`);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div className="flex flex-col w-full h-screen p-5 animaMini">
      <h1 className="text-3xl font-bold mb-8">Available Plugins</h1>

      {showMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animaMini">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {plugins.map(plugin => (
          <div key={plugin.id} className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {plugin.icon === 'ListChecks' ? (
                  <ListChecks size={24} className="text-blue-500" />
                ) : (
                  <GitBranch size={24} className="text-green-500" />
                )}
                <h2 className="text-xl font-semibold">{plugin.name}</h2>
              </div>
              <button
                onClick={() => !plugin.installed && handleInstall(plugin)}
                className={`p-2 rounded-md transition ${
                  plugin.installed
                    ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                disabled={plugin.installed}
              >
                {plugin.installed ? (
                  <Check size={20} />
                ) : (
                  <Download size={20} />
                )}
              </button>
            </div>
            <p className="text-neutral-400">{plugin.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
  