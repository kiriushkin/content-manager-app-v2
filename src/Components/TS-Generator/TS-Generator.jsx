import './TS-Generator.scss';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Context from './Context.js';
import Input from '../Base/Input/Input.jsx';

const TS_Generator = () => {
  const data = ['title', 'yam', 'fbx', 'some'];

  const [inputs, setInputs] = useState([]);
  const [preview, setPreview] = useState([]);
  const [isReordering, setIsReordering] = useState(false);

  const plusModal = useRef(null);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const newInputs = [...inputs];
    const [resorderedInput] = newInputs.splice(result.source.index, 1);
    newInputs.splice(result.destination.index, 0, resorderedInput);

    setInputs(newInputs);
  };

  const getPreview = () => {
    const text = [];

    inputs.forEach(({ title, value }) => {
      text.push(`${title} - ${value}`);
    });

    return text.map((_) => <PreviewLine text={_} />);
  };

  useEffect(() => {
    const newInputs = data.map((title) => {
      return { id: uuid(), title: title, value: '' };
    });
    setInputs([...newInputs]);
  }, []);

  useEffect(() => {
    setPreview(getPreview());
  }, [inputs]);

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Context.Provider value={{ isReordering }}>
        <div className="ts-gen ts-gen__container">
          <div className="ts-gen__panel">
            <div className="ts-gen__btn-wrapper">
              <button
                className="ts-gen__btn"
                onClick={() => {
                  plusModal.current.show();
                }}
              >
                +
              </button>

              <button
                className="ts-gen__btn"
                onClick={() => {
                  setIsReordering(!isReordering);
                }}
              >
                🔁
              </button>

              <dialog ref={plusModal} className="ts-gen__plus-dialog">
                <div
                  className="ts-gen__plus-dialog-bg"
                  onClick={() => plusModal.current.close()}
                ></div>
                <div
                  className="ts-gen__plus-dialog-item"
                  onClick={() => {
                    plusModal.current.close();
                    setInputs([
                      ...inputs,
                      {
                        id: uuid(),
                        index: inputs.length,
                        title: 'New one',
                        value: '',
                      },
                    ]);
                  }}
                >
                  Input
                </div>
              </dialog>
            </div>
          </div>

          <Droppable droppableId="inputs">
            {(provided) => (
              <div
                className="ts-gen__block"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {inputs.map(({ id, title, value }, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <div
                          className="ts-gen__row"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <Input
                            title={title}
                            value={value}
                            onChange={(e) => {
                              const newInputs = [...inputs];
                              newInputs[index].value = e.target.value;
                              setInputs(newInputs);
                            }}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="ts-gen__block">
            <div className="ts-gen__preview">{preview}</div>
          </div>
        </div>
      </Context.Provider>
    </DragDropContext>
  );
};

const PreviewLine = ({ text }) => {
  return <div>{text}</div>;
};

export default TS_Generator;
