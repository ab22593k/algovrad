import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Algovrad — Radar ministres & décrets',
  },
  {
    path: 'ministers',
    loadComponent: () => import('./features/ministers/ministers').then((m) => m.Ministers),
    title: 'Ministres algériens',
  },
  {
    path: 'radar',
    loadComponent: () => import('./features/radar/radar').then((m) => m.Radar),
    title: 'Radar décrets & offres',
  },
  {
    path: 'agent',
    loadComponent: () => import('./features/agent-chat/agent-chat').then((m) => m.AgentChat),
    title: 'Agent IA AlgoVrad',
  },
  { path: '**', redirectTo: '' },
];
