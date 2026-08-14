import { NAV_ITEMS, SECTION_PATH_MAP } from '@/constants/adminNav';
import type { AdminRole, Section } from '@/types/admin';

export const ADMIN_ROLES: AdminRole[] = [
  'SUPER_ADMIN',
  'SYSTEM_ADMIN',
  'PAYMENT_HANDLER',
  'METER_READER',
];

export const isAdminRole = (role?: string | null): role is AdminRole => {
  return ADMIN_ROLES.includes(role as AdminRole);
};

const sectionRoleMap = NAV_ITEMS.reduce<Record<Section, Set<AdminRole>>>((acc, item) => {
  const section = item.id as Section;
  if (!acc[section]) {
    acc[section] = new Set<AdminRole>();
  }
  item.roles.forEach((role) => acc[section].add(role));
  return acc;
}, {} as Record<Section, Set<AdminRole>>);

export const canAccessSection = (role: AdminRole, section: Section): boolean => {
  if (section === 'settings') return true;
  const roles = sectionRoleMap[section];
  return roles ? roles.has(role) : false;
};

export const getDefaultAdminPath = (role: AdminRole): string => {
  if (role === 'METER_READER') return SECTION_PATH_MAP.meter;
  if (role === 'PAYMENT_HANDLER') return SECTION_PATH_MAP.payments;
  return SECTION_PATH_MAP.dashboard;
};
