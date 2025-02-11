import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que precisam de plugins
const PROTECTED_ROUTES = {
  '/workflow': 'workflow',
  '/checklist': 'checklist',
  '/NewWorkflow': 'workflow',
  '/NewChecklist': 'checklist'
};

export function middleware(request: NextRequest) {
  // Pega o caminho da URL
  const path = request.nextUrl.pathname;

  // Verifica se é uma rota protegida
  for (const [route, pluginId] of Object.entries(PROTECTED_ROUTES)) {
    if (path.startsWith(route)) {
      // Pega os plugins instalados do localStorage
      const plugins = request.cookies.get('installed_plugins')?.value;
      const installedPlugins = plugins ? JSON.parse(plugins) : [];
      
      // Verifica se o plugin necessário está instalado
      const isPluginInstalled = installedPlugins.some(
        (p: { id: string; enabled: boolean }) => p.id === pluginId && p.enabled
      );

      // Se não estiver instalado, redireciona para a página de plugins
      if (!isPluginInstalled) {
        const url = new URL('/plugins', request.url);
        url.searchParams.set('error', `This feature requires the ${pluginId} plugin. Please install it first.`);
        url.searchParams.set('returnUrl', path);
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

// Configuração para quais caminhos o middleware deve ser executado
export const config = {
  matcher: [
    '/workflow/:path*',
    '/checklist/:path*',
    '/NewWorkflow',
    '/NewChecklist'
  ]
}; 