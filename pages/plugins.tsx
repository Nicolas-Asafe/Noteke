import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getInstalledPlugins, setInstalledPlugins, PLUGIN_IDS } from '@/utils/pluginManager';
import { MessageContent } from '@/components/MessageContent';

const availablePlugins = [
  {
    id: PLUGIN_IDS.CHECKLIST,
    name: 'Checklist',
    description: 'Create and manage checklists'
  },
  {
    id: PLUGIN_IDS.WORKFLOW,
    name: 'Workflow',
    description: 'Create kanban-style workflows'
  }
];

export default function Plugins() {
  const router = useRouter();
  const [installedPlugins, setInstalledPluginsState] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isMessage, setIsMessage] = useState(false);
  const [color, setColor] = useState('');

  useEffect(() => {
    const plugins = getInstalledPlugins();
    setInstalledPluginsState(plugins.map(p => p.id));

    // Mostrar mensagem de erro se vier da proteção de rota
    if (router.query.error) {
      setMessage(router.query.error as string);
      setColor('amber');
      setIsMessage(true);
    }
  }, [router.query]);

  const togglePlugin = (pluginId: string) => {
    const newPlugins = installedPlugins.includes(pluginId)
      ? installedPlugins.filter(id => id !== pluginId)
      : [...installedPlugins, pluginId];

    // Atualiza o estado local
    setInstalledPluginsState(newPlugins);

    // Atualiza o localStorage e cookies
    const pluginsData = newPlugins.map(id => ({
      id,
      name: availablePlugins.find(p => p.id === id)?.name || '',
      enabled: true
    }));
    setInstalledPlugins(pluginsData);
    
    setColor('green');
    setMessage(`Plugin ${newPlugins.includes(pluginId) ? 'installed' : 'uninstalled'} successfully!`);
    setIsMessage(true);

    if (router.query.returnUrl && newPlugins.includes(pluginId)) {
      setTimeout(() => {
        router.push(router.query.returnUrl as string);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen p-5 animaMini">
      <h1 className="text-2xl font-bold mb-4">Plugins</h1>
      {isMessage && (
        <MessageContent 
          message={message} 
          color={color} 
          onClose={() => setIsMessage(false)} 
        />
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {availablePlugins.map(plugin => (
          <div key={plugin.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg">
            <h2 className="text-xl font-semibold">{plugin.name}</h2>
            <p className="text-neutral-400 mb-4">{plugin.description}</p>
            <button
              onClick={() => togglePlugin(plugin.id)}
              className={`px-4 py-2 rounded-md ${
                installedPlugins.includes(plugin.id)
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              } transition`}
            >
              {installedPlugins.includes(plugin.id) ? 'Uninstall' : 'Install'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 