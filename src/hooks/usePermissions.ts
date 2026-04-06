import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export interface UserPermissions {
  hemoderivados: {
    crear: boolean;
    consultar: boolean;
    editar: boolean;
    eliminar: boolean;
    aceptar: boolean;
    devolver: boolean;
  };
  laboratorio: {
    crear: boolean;
    consultar: boolean;
  };
  insumos: {
    crear: boolean;
    consultar: boolean;
    consumir: boolean;
    eliminar: boolean;
  };
}

const SUPER_ADMIN_EMAIL = "ingbiomedico@ucihonda.com.co";

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
          setIsAdmin(true);
          setPermissions({
            hemoderivados: { crear: true, consultar: true, editar: true, eliminar: true, aceptar: true, devolver: true },
            laboratorio: { crear: true, consultar: true },
            insumos: { crear: true, consultar: true, consumir: true, eliminar: true }
          });
          setLoading(false);
          return;
        }

        const unsubscribeDoc = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.active) {
              setIsAdmin(data.role === 'admin');
              setPermissions(data.permissions);
            } else {
              setPermissions(null);
              setIsAdmin(false);
            }
          } else {
            setPermissions(null);
            setIsAdmin(false);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user permissions:", error);
          setPermissions(null);
          setIsAdmin(false);
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        setPermissions(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const hasPermission = (section: keyof UserPermissions, action: string) => {
    if (isAdmin) return true;
    if (!permissions) return false;
    return (permissions[section] as any)?.[action] === true;
  };

  return { permissions, isAdmin, hasPermission, loading };
};
