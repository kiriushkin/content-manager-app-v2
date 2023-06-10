import './Input.scss';
import 'animate.css';
import { Draggable } from 'react-beautiful-dnd';

const Input = ({ isDraggable, id, index, title, onChange, value }) => {
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
            <div className="input__drag-zone" {...provided.dragHandleProps}>
              <i className="fa-solid fa-grip"></i>
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
