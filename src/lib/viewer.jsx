import { createContext, useContext, useMemo, useState } from 'react';
import { ADMIN } from '@/data/seed';

/**
 * There is no sign-in. "Who am I?" is a switch in the header: an admin sees everything and can
 * act on it; an ambassador sees only their own work. The real product enforces the same split in
 * the database; here it is enforced in the mock services, so the behaviour is still demonstrable.
 */
const AMBASSADOR = { role: 'ambassador', id: 'AMB-1001', name: 'Sam Rivera' };
const ADMIN_VIEWER = { role: 'admin', id: ADMIN.id, name: ADMIN.name };

const ViewerContext = createContext(null);

export function ViewerProvider({ children }) {
  const [role, setRole] = useState('admin');
  const value = useMemo(
    () => ({ viewer: role === 'admin' ? ADMIN_VIEWER : AMBASSADOR, role, setRole, isAdmin: role === 'admin' }),
    [role],
  );
  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>;
}

export function useViewer() {
  const ctx = useContext(ViewerContext);
  if (!ctx) throw new Error('useViewer must be used inside <ViewerProvider>');
  return ctx;
}
