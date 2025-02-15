import { useState, useEffect } from 'react';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  url: string;
}

interface PluginOrg {
  id: string;
  name: string;
  type: string;
  data: any;
}

export function usePlugins() {
  const [installedPlugins, setInstalledPlugins] = useState<string[]>([]);
  const [organizations, setOrganizations] = useState<PluginOrg[]>([]);

  useEffect(() => {
    // Carregar plugins instalados do localStorage
    const plugins = JSON.parse(localStorage.getItem('installed_plugins') || '[]');
    setInstalledPlugins(plugins);

    // Carregar organizações dos plugins
    const orgs = JSON.parse(localStorage.getItem('plugin_organizations') || '[]');
    setOrganizations(orgs);
  }, []);

  const createOrganization = (pluginId: string, orgData: any) => {
    const newOrg: PluginOrg = {
      id: `${pluginId}-${Date.now()}`,
      name: orgData.name || 'Nova Organização',
      type: pluginId,
      data: orgData
    };

    const updatedOrgs = [...organizations, newOrg];
    setOrganizations(updatedOrgs);
    localStorage.setItem('plugin_organizations', JSON.stringify(updatedOrgs));
    
    return newOrg;
  };

  const updateOrganization = (orgId: string, newData: any) => {
    const updatedOrgs = organizations.map(org => 
      org.id === orgId ? { ...org, data: { ...org.data, ...newData } } : org
    );
    
    setOrganizations(updatedOrgs);
    localStorage.setItem('plugin_organizations', JSON.stringify(updatedOrgs));
  };

  const deleteOrganization = (orgId: string) => {
    const updatedOrgs = organizations.filter(org => org.id !== orgId);
    setOrganizations(updatedOrgs);
    localStorage.setItem('plugin_organizations', JSON.stringify(updatedOrgs));
  };

  return {
    installedPlugins,
    organizations,
    createOrganization,
    updateOrganization,
    deleteOrganization
  };
}