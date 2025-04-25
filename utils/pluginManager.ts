interface Plugin {
  id: string;
  name: string;
  enabled: boolean;
}

export function getInstalledPlugins(): Plugin[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('installed_plugins');
  if (!stored) return [];
  
  // Também atualiza os cookies
  document.cookie = `installed_plugins=${stored}; path=/`;
  
  return JSON.parse(stored);
}

export function isPluginEnabled(pluginId: string): boolean {
  const plugins = getInstalledPlugins();
  return plugins.some(p => p.id === pluginId && p.enabled);
}

export function setInstalledPlugins(plugins: Plugin[]) {
  if (typeof window === 'undefined') return;
  
  const pluginsStr = JSON.stringify(plugins);
  localStorage.setItem('installed_plugins', pluginsStr);
  document.cookie = `installed_plugins=${pluginsStr}; path=/`;
}

export const PLUGIN_IDS = {
  CHECKLIST: 'checklist',
  WORKFLOW: 'workflow'
} as const; 