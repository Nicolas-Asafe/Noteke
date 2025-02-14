import React from 'react';
import { Book, GitBranch, CheckSquare, Download, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Plugin {
  id: string;
  name: string;
  description: string;
  iconType: 'book' | 'workflow' | 'checklist';
  installed: boolean;
}

function getPluginIcon(iconType: string, className: string = "") {
  switch (iconType) {
    case 'book':
      return <Book className={`${className} text-blue-500`} />;
    case 'workflow':
      return <GitBranch className={`${className} text-green-500`} />;
    case 'checklist':
      return <CheckSquare className={`${className} text-purple-500`} />;
    default:
      return null;
  }
}

function MessageContent({
  message,
  color,
  onClose
}: {
  message: string;
  color: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div className="md:ml-32 pointer-events-auto">
        <p className={`animaMini ${color} border border-neutral-900 bg-black p-2 rounded-md font-semibold cursor-pointer transition flex flex-row gap-4 items-center`}>
          {message}
          <X onClick={onClose} className="border border-neutral-900 rounded-md cursor-pointer" />
        </p>
      </div>
    </div>
  );
}

export default function PluginsPage() {
  const router = useRouter();
  const defaultPlugins: Plugin[] = [
    {
      id: 'book',
      name: 'Book',
      description: 'Create a book to your notes and use many tools',
      iconType: 'book',
      installed: false  
    },
    {
      id: 'workflow',
      name: 'Workflow',
      description: 'Organize your work with a visual and interactive flowchart',
      iconType: 'workflow',
      installed: false
    },
    {
      id: 'checklist',
      name: 'Checklist',
      description: 'Create a checklist to your tasks and track your progress',
      iconType: 'checklist',
      installed: false
    }
  ];

  const [plugins, setPlugins] = useState<Plugin[]>(defaultPlugins);
  const [message, setMessage] = useState<string>("");
  const [isMessage, setIsMessage] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");

  // Carregar plugins do localStorage
  useEffect(() => {
    try {
      const savedPlugins = localStorage.getItem('plugins');
      if (savedPlugins) {
        const parsedPlugins = JSON.parse(savedPlugins);
        // Garantir que todos os plugins padrão existam
        const updatedPlugins = defaultPlugins.map(defaultPlugin => {
          const savedPlugin = parsedPlugins.find((p: Plugin) => p.id === defaultPlugin.id);
          return savedPlugin || defaultPlugin;
        });
        setPlugins(updatedPlugins);
      }
    } catch (error) {
      console.error('Erro ao carregar plugins:', error);
      setPlugins(defaultPlugins);
    }
  }, []);

  const handleInstall = (pluginId: string) => {
    const updatedPlugins = plugins.map(plugin => {
      if (plugin.id === pluginId) {
        return { ...plugin, installed: !plugin.installed };
      }
      return plugin;
    });
    
    // Criar versão segura para localStorage (sem referências circulares)
    const storagePlugins = updatedPlugins.map(({ id, name, description, iconType, installed }) => ({
      id,
      name,
      description,
      iconType,
      installed
    }));
    
    setPlugins(updatedPlugins);
    localStorage.setItem('plugins', JSON.stringify(storagePlugins));

    const plugin = updatedPlugins.find(p => p.id === pluginId);
    if (plugin) {
      if (plugin.installed) {
        setMessage(`${plugin.name} instalado!`);
        setColor("text-green-500");
        setTimeout(() => router.push(`/${plugin.id}`), 1000);
      } else {
        setMessage(`${plugin.name} desinstalado!`);
        setColor("text-red-500");
      }
      setIsMessage(true);
      setTimeout(() => setIsMessage(false), 3000);
    }
  };

    return (
    <div className="w-full h-screen flex flex-col p-5 overflow-hidden">
      <h1 className="text-4xl font-bold mb-8">Plugins</h1>
      
      {isMessage && (
        <MessageContent 
          message={message} 
          color={color} 
          onClose={() => setIsMessage(false)} 
        />
      )}

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plugins.map(plugin => (
              <div 
                key={plugin.id}
                className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                    {getPluginIcon(plugin.iconType, "w-12 h-12")}
                  </div>
                  <button
                    onClick={() => handleInstall(plugin.id)}
                    className={`p-3 rounded-lg transition-all ${
                      plugin.installed
                        ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                        : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
                    }`}
                  >
                    {plugin.installed ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Download className="w-6 h-6" />
                    )}
                  </button>
                </div>

                <h2 className="text-xl font-semibold mb-2">{plugin.name}</h2>
                <p className="text-neutral-400 mb-4">{plugin.description}</p>

                {plugin.installed && (
                  <div className="flex items-center text-green-500 text-sm font-semibold">
                    <Check className="w-4 h-4 mr-1" />
                    Instalado
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    );
  }
  