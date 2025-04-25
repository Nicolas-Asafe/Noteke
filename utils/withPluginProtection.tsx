import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isPluginEnabled } from './pluginManager';

export function withPluginProtection(WrappedComponent: React.ComponentType, pluginId: string) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();

    useEffect(() => {
      if (!isPluginEnabled(pluginId)) {
        router.replace({
          pathname: '/plugins',
          query: { 
            error: `This feature requires the ${pluginId} plugin. Please install it first.`,
            returnUrl: router.asPath
          }
        });
      }
    }, [router]);

    if (!isPluginEnabled(pluginId)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 