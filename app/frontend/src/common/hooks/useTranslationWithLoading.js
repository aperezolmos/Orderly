import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ensureNamespaceLoaded } from '../../i18n';


export const useTranslationWithLoading = (ns) => {
  
  const namespaces = Array.isArray(ns) ? ns : [ns];
  const { t, i18n, ready } = useTranslation(namespaces);
  const [namespacesReady, setNamespacesReady] = useState(false);


  useEffect(() => {
    const load = async () => {
      if (namespaces.length > 0) {
        await Promise.all(namespaces.map(ns => ensureNamespaceLoaded(ns)));
        setNamespacesReady(true);
      }
    };
    setNamespacesReady(false);
    load();
  }, [namespaces.join(','), i18n.language]);

  useEffect(() => {
    const handler = () => {
      if (namespaces.length > 0) {
        Promise.all(namespaces.map(ns => ensureNamespaceLoaded(ns)))
          .then(() => setNamespacesReady(true));
      }
    };
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, [i18n, namespaces.join(',')]);


  return {
    t,
    i18n,
    ready: ready && namespacesReady,
    isNamespaceLoading: !namespacesReady
  };
};
