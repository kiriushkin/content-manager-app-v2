import './Input.scss';
import { useRef, useContext } from 'react';
import Context from '../../TS-Generator/Context.js';

const Input = ({ title, onChange, value }) => {
  const ref = useRef(null);

  const { isReordering } = useContext(Context);

  return (
    <div className="input" ref={ref}>
      <input
        type="text"
        className="input__el"
        onChange={onChange}
        value={value}
        style={{ pointerEvents: isReordering ? 'none' : 'unset' }}
      />
      <span className="input__title">{title}</span>
    </div>
  );
};

export default Input;
