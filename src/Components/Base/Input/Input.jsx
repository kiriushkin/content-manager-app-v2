import './Input.scss';
import 'animate.css';
import { Draggable } from 'react-beautiful-dnd';

const Input = ({
  isDraggable,
  showInPreview,
  isVisible,
  changeVisibility,
  id,
  index,
  title,
  onChange,
  value,
  additionalOption,
}) => {
  if (isDraggable)
    return (
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <div
            className={`input`}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <input
              type="text"
              className="input__el"
              onChange={onChange}
              value={value}
            />
            <span className="input__title">{title}</span>
            <div className="input__options">
              {additionalOption}
              {showInPreview ? (
                <div
                  className="input__option-icon"
                  onClick={() => changeVisibility()}
                >
                  <i
                    className="fa-regular fa-eye"
                    style={{ opacity: isVisible ? 1 : 0.5 }}
                  ></i>
                </div>
              ) : (
                ''
              )}
              <div className="input__option-icon" {...provided.dragHandleProps}>
                <i className="fa-solid fa-grip"></i>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  return (
    <div className={`input`}>
      <input
        type="text"
        className="input__el"
        onChange={onChange}
        value={value}
      />
      <span className="input__title">{title}</span>
    </div>
  );
};

export default Input;
