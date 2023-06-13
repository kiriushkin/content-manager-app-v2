import { BLOCK_TYPES } from '../../TS-Generator/BlockTypes.js';

const Icon = ({ icon }) => {
  const classes = {
    [BLOCK_TYPES.INPUT]: 'fa-solid fa-keyboard',
    [BLOCK_TYPES.DROPDOWN]: 'fa-solid fa-list',
    [BLOCK_TYPES.HEADER]: 'fa-solid fa-heading',
    [BLOCK_TYPES.SPACER]: 'fa-solid fa-grip-lines',
  };
  return <i className={classes[icon]}></i>;
};

export default Icon;
