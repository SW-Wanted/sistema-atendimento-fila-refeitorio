import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

function getCurrentUser(): any | null {
  const raw = localStorage.getItem('user');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = getCurrentUser();
  if (user) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const user = getCurrentUser();

    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (roles.includes(user.tipo_conta)) {
      return true;
    }

    router.navigate(['/menu']);
    return false;
  };
};
