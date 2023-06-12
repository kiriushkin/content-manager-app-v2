import { BLOCK_TYPES } from './BlockTypes.js';

const elements = [
  {
    id: '1',
    title: 'yam',
    type: BLOCK_TYPES.INPUT,
    showInPreview: true,
  },
  {
    id: '2',
    title: 'af',
    type: BLOCK_TYPES.DROPDOWN,
    items: ['Lucky Online', 'Leadbit'],
    showInPreview: false,
  },
  {
    id: '3',
    title: 'offer',
    type: BLOCK_TYPES.INPUT,
    showInPreview: true,
  },
];

const scheme = [elements[0]];

export { elements, scheme };
