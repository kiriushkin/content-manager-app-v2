import { BLOCK_TYPES } from './BlockTypes.js';
import Input from '../Base/Input/Input.jsx';
import Dropdown from '../Base/Dropdown/Dropdown.jsx';

const Block = ({ type, ...props }) => {
  if (type === BLOCK_TYPES.SPACER) return <Input noValue={true} {...props} />;
  if (type === BLOCK_TYPES.INPUT || type === BLOCK_TYPES.HEADER)
    return <Input {...props} />;
  if (type === BLOCK_TYPES.DROPDOWN) return <Dropdown {...props} />;
  return <></>;
};

export default Block;
