import './TS-Generator.scss';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Context from './Context.js';
import Block from './Block.jsx';
import Input from '../Base/Input/Input.jsx';
import { elements as testElements, schema } from './TestData.js';

const TS_Generator = () => {
  const [blocks, setBlocks] = useState([]);
  const [elements, setElements] = useState([]);
  const [preview, setPreview] = useState([]);

  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  const [customItem, setCustomItem] = useState({ type: '', value: '' });

  const plusModal = useRef(null);
  const customModal = useRef(null);

  const handleOnDragStart = () => {
    setIsDeleteVisible(true);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    if (result.destination.droppableId === 'delete-zone') {
      const newBlocks = [...blocks];
      newBlocks.splice(result.source.index, 1);
      setBlocks(newBlocks);
    }

    if (result.destination.droppableId === 'blocks') {
      const newBlocks = [...blocks];
      const [resorderedInput] = newBlocks.splice(result.source.index, 1);
      newBlocks.splice(result.destination.index, 0, resorderedInput);

      setBlocks(newBlocks);
    }

    setIsDeleteVisible(false);
  };

  const getPreview = () => {
    const text = [];

    blocks.forEach(({ showInPreview, title, value, isVisible }) => {
      if (!showInPreview || !isVisible) return;
      text.push(`${title} - ${value}`);
    });

    return text.map((_, index) => <PreviewLine text={_} key={index} />);
  };

  const closeOnOutsideClick = (e, ref) => {
    const dialogDimensions = ref.current.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      ref.current.close();
    }
  };

  useEffect(() => {
    setBlocks(
      schema.map((item) => ({
        ...item,
        value: '',
        isVisible: item.isVisible ? item.isVisible : true,
      }))
    );
    setElements(testElements);
  }, []);

  useEffect(() => {
    setPreview(getPreview());
  }, [blocks]);

  return (
    <DragDropContext
      onDragEnd={handleOnDragEnd}
      onDragStart={handleOnDragStart}
    >
      <Context.Provider value={{}}>
        <div className="ts-gen ts-gen__container">
          <div className="ts-gen__panel">
            <div className="ts-gen__btn-wrapper">
              <button
                className="ts-gen__btn"
                onClick={() => {
                  plusModal.current.show();
                }}
              >
                <i className="fa-solid fa-plus"></i>
              </button>

              <dialog ref={plusModal} className="ts-gen__plus-dialog">
                <div
                  className="ts-gen__plus-dialog-bg"
                  onClick={() => plusModal.current.close()}
                ></div>
                {elements.map((element) => {
                  const { id, title } = element;
                  if (blocks.find((block) => block.id === id)) return '';

                  return (
                    <div
                      key={id}
                      className="ts-gen__plus-dialog-item"
                      onClick={() => {
                        plusModal.current.close();
                        // customModal.current.showModal();
                        setBlocks([
                          ...blocks,
                          { ...element, value: '', isVisible: true },
                        ]);
                      }}
                    >
                      <div className="ts-gen__plus-dialog-title">{title}</div>
                    </div>
                  );
                })}
              </dialog>
            </div>
          </div>

          <Droppable droppableId="blocks">
            {(provided) => (
              <div
                className="ts-gen__section"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {blocks.map(({ id, ...props }, index) => {
                  return (
                    <Block
                      id={id}
                      key={id}
                      isDraggable={true}
                      index={index}
                      {...props}
                      onChange={(eOrValue) => {
                        const newBlocks = [...blocks];
                        newBlocks[index].value = eOrValue?.target
                          ? eOrValue.target.value
                          : eOrValue;
                        setBlocks(newBlocks);
                      }}
                      changeVisibility={() => {
                        const newBlocks = [...blocks];
                        newBlocks[index].isVisible =
                          !newBlocks[index].isVisible;
                        setBlocks(newBlocks);
                      }}
                    />
                  );
                })}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="ts-gen__section">
            <div className="ts-gen__preview">{preview}</div>
          </div>

          <Droppable droppableId="delete-zone">
            {(provided) => (
              <div
                className="ts-gen__panel ts-gen__delete-zone"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ opacity: isDeleteVisible ? 1 : 0 }}
              >
                <i className="fa-solid fa-trash"></i>
              </div>
            )}
          </Droppable>

          <dialog
            className="ts-gen__modal"
            ref={customModal}
            onClick={(e) => {
              closeOnOutsideClick(e, customModal);
            }}
          >
            <form method="dialog">
              <Input
                title={'Title'}
                value={customItem.value}
                onChange={(e) =>
                  setCustomItem({ ...customItem, value: e.target.value })
                }
              />
              <button
                type="submit"
                className="ts-gen__btn"
                onClick={(e) => {
                  if (!customItem.value) return e.preventDefault();
                  setBlocks([
                    ...blocks,
                    {
                      type: customItem.type,
                      id: uuid(),
                      index: blocks.length,
                      title: customItem.value,
                      value: '',
                    },
                  ]);

                  setCustomItem({ type: '', value: '' });
                }}
              >
                Добавить
              </button>
            </form>
          </dialog>
        </div>
      </Context.Provider>
    </DragDropContext>
  );
};

const PreviewLine = ({ text }) => {
  return <div>{text}</div>;
};

export default TS_Generator;
