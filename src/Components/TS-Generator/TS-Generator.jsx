import './TS-Generator.scss';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Context from './Context.js';
import Block from './Block.jsx';
import Input from '../Base/Input/Input.jsx';
import { BLOCK_TYPES } from './BlockTypes.js';

const TS_Generator = () => {
  const data = [
    {
      type: BLOCK_TYPES.INPUT,
      id: uuid(),
      title: 'title',
      value: '',
    },
    {
      type: BLOCK_TYPES.INPUT,
      id: uuid(),
      title: 'yam',
      value: '',
    },
    {
      type: BLOCK_TYPES.INPUT,
      id: uuid(),
      title: 'fbx',
      value: '',
    },
    {
      type: BLOCK_TYPES.DROPDOWN,
      id: uuid(),
      title: 'AF',
      value: '',
      options: ['Lucky Online', 'Leadbit'],
    },
  ];

  const [blocks, setBlocks] = useState(data);
  const [preview, setPreview] = useState([]);

  const [customItem, setCustomItem] = useState({ type: '', value: '' });

  const plusModal = useRef(null);
  const customModal = useRef(null);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const newInputs = [...blocks];
    const [resorderedInput] = newInputs.splice(result.source.index, 1);
    newInputs.splice(result.destination.index, 0, resorderedInput);

    setBlocks(newInputs);
  };

  const getPreview = () => {
    const text = [];

    blocks.forEach(({ title, value }) => {
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
    setPreview(getPreview());
  }, [blocks]);

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
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
                <div
                  className="ts-gen__plus-dialog-item"
                  onClick={() => {
                    plusModal.current.close();
                    customModal.current.showModal();
                  }}
                >
                  <div className="ts-gen__plus-dialog-title">Custom</div>

                  <div className="ts-gen__plus-dialog-item ts-gen__plus-dialog-subitem">
                    <div
                      className="ts-gen__plus-dialog-title"
                      onClick={() =>
                        setCustomItem({
                          ...customItem,
                          type: BLOCK_TYPES.INPUT,
                        })
                      }
                    >
                      Input
                    </div>
                    <div
                      className="ts-gen__plus-dialog-title"
                      onClick={() =>
                        setCustomItem({
                          ...customItem,
                          type: BLOCK_TYPES.DROPDOWN,
                        })
                      }
                    >
                      Dropdown
                    </div>
                  </div>
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
                {blocks.map(({ id, type, title, value, options }, index) => {
                  return (
                    <div className="ts-gen__row" key={id}>
                      <Block
                        type={type}
                        isDraggable={true}
                        id={id}
                        index={index}
                        title={title}
                        options={options}
                        value={value}
                        onChange={(eOrValue) => {
                          const newInputs = [...blocks];
                          newInputs[index].value = eOrValue?.target
                            ? eOrValue.target.value
                            : eOrValue;
                          setBlocks(newInputs);
                        }}
                      />
                    </div>
                  );
                })}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="ts-gen__block">
            <div className="ts-gen__preview">{preview}</div>
          </div>

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
