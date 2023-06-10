import './Dropdown.scss';
import { useState, useEffect, useRef } from 'react';
import Input from '../Input/Input.jsx';

const Dropdown = ({ options = [], ...props }) => {
  const [isShown, setIsShown] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [optionIndex, setOptionIndex] = useState(-1);

  const dialog = useRef(null);

  const { isDraggable, value, onChange } = props;

  useEffect(() => {
    setCurrentOptions(
      options.filter((option) => option.match(new RegExp(value, 'i')))
    );

    setIsShown(value !== '');
  }, [value]);

  useEffect(() => {
    if (!isShown || currentOptions.length === 0) setOptionIndex(-1);
  }, [isShown, currentOptions]);

  return (
    <div
      className={`dropdown ${isDraggable ? 'dropdown_draggable' : ''}`}
      onKeyUp={(e) => {
        console.log(e.code);
        if (currentOptions.length === 0) return;

        if (e.code === 'ArrowDown')
          return setOptionIndex(
            optionIndex === currentOptions.length - 1 ? 0 : optionIndex + 1
          );

        if (e.code === 'ArrowUp')
          return setOptionIndex(
            optionIndex === 0 ? currentOptions.length - 1 : optionIndex - 1
          );

        if (e.code === 'Enter' && optionIndex !== -1)
          return dialog.current
            .querySelectorAll('.dropdown__option')
            [optionIndex].click();
      }}
    >
      <Input {...props} />
      <button className="dropdown__btn" onClick={() => setIsShown(!isShown)}>
        <i className="fa-solid fa-caret-down"></i>
      </button>
      <dialog className="dropdown__options" ref={dialog} open={isShown}>
        {currentOptions.map((option, index) => (
          <div
            key={index}
            className={`dropdown__option ${
              index === optionIndex ? 'dropdown__option_active' : ''
            }`}
            onClick={() => {
              onChange(option);
              setTimeout(() => setIsShown(false), 10);
            }}
          >
            {option}
          </div>
        ))}
        {currentOptions.length === 0 ? (
          <div className="dropdown__option dropdown__option_placeholder">
            Nothing found
          </div>
        ) : (
          ''
        )}
      </dialog>
    </div>
  );
};

export default Dropdown;
