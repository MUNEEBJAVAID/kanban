import { BoardData } from '@/types/kanban';

export const INITIAL_BOARD_DATA: BoardData = {
  columns: [
    {
      id: 'col-1',
      title: 'Backlog',
      cardIds: ['card-1', 'card-2'],
    },
    {
      id: 'col-2',
      title: 'To Do',
      cardIds: ['card-3', 'card-4'],
    },
    {
      id: 'col-3',
      title: 'In Progress',
      cardIds: ['card-5', 'card-6'],
    },
    {
      id: 'col-4',
      title: 'In Review',
      cardIds: ['card-7', 'card-8'],
    },
    {
      id: 'col-5',
      title: 'Done',
      cardIds: ['card-9', 'card-10'],
    },
  ],
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'User Authentication Audit',
      details: 'Review token lifecycle, expiration policies, and session validation flows.',
    },
    'card-2': {
      id: 'card-2',
      title: 'Vector Index Optimization',
      details: 'Benchmark latency and memory consumption across high-dimension embeddings.',
    },
    'card-3': {
      id: 'card-3',
      title: 'API Rate Limiting',
      details: 'Implement sliding window algorithm for public endpoints to prevent abuse.',
    },
    'card-4': {
      id: 'card-4',
      title: 'Connection Pool Tuning',
      details: 'Calibrate min and max connection thresholds under peak concurrent loads.',
    },
    'card-5': {
      id: 'card-5',
      title: 'Responsive Board Container',
      details: 'Ensure horizontal overflow behaves predictably on smaller viewports.',
    },
    'card-6': {
      id: 'card-6',
      title: 'Design System Tokens',
      details: 'Unify brand palette, border radii, typography weights, and elevation shadows.',
    },
    'card-7': {
      id: 'card-7',
      title: 'End-to-End Test Suite',
      details: 'Write automated integration coverage for card movement and column actions.',
    },
    'card-8': {
      id: 'card-8',
      title: 'Asset Loading Performance',
      details: 'Add resource hints and optimize font loading waterfalls to lower LCP.',
    },
    'card-9': {
      id: 'card-9',
      title: 'Semantic HTML Structure',
      details: 'Ensure proper document outlines, ARIA roles, and keyboard navigation.',
    },
    'card-10': {
      id: 'card-10',
      title: 'Deployment Pipeline Setup',
      details: 'Configure continuous integration triggers and build verification workflows.',
    },
  },
};
