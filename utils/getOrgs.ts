import { isPluginEnabled, PLUGIN_IDS } from './pluginManager';

export function getAvailableOrgs() {
  const defaultOrgs = [
    {
      id: 1,
      name: "Note",
      path: "/NewNote",
      icon: "FilePlus"
    },
    {
      id: 2,
      name: "Table",
      path: "/NewTable",
      icon: "Table"
    }
  ];

  const pluginOrgs = [];

  if (isPluginEnabled(PLUGIN_IDS.CHECKLIST)) {
    pluginOrgs.push({
      id: 3,
      name: "Checklist",
      path: "/NewChecklist",
      icon: "ListChecks"
    });
  }

  if (isPluginEnabled(PLUGIN_IDS.WORKFLOW)) {
    pluginOrgs.push({
      id: 4,
      name: "Workflow",
      path: "/NewWorkflow",
      icon: "GitBranch"
    });
  }

  return [...defaultOrgs, ...pluginOrgs];
} 