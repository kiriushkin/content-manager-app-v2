import './TS-Generator.scss';
import { useState, useEffect, useRef, useContext } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import Context from './Context.js';
import Block from './Block.jsx';
import { BLOCK_TYPES } from './BlockTypes.js';
import Icon from '../Base/Icon/Icon.jsx';
import { elements as testElements, scheme } from './TestData.js';

const TS_Generator = () => {
  const [blocks, setBlocks] = useState([]);
  const [elements, setElements] = useState([]);
  const [menuIndex, setMenuIndex] = useState(0);

  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

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

  useEffect(() => {
    setBlocks(
      scheme.map((item) => ({
        ...item,
        value: '',
        isVisible: item.isVisible ? item.isVisible : true,
      }))
    );
    setElements(testElements);
  }, []);

  return (
    <DragDropContext
      onDragEnd={handleOnDragEnd}
      onDragStart={handleOnDragStart}
    >
      <Context.Provider
        value={{
          menuIndex,
          setMenuIndex,
          blocks,
          setBlocks,
          elements,
          isDeleteVisible,
        }}
      >
        <div className="wrapper">
          <div className="ts-gen__container">
            <MainControlPanel />
            <div
              className="ts-gen__row"
              style={{
                left: `calc(${menuIndex} * (-100vw))`,
              }}
            >
              <SchemeContainer />
              <ElementsContainer />
            </div>
          </div>
        </div>
      </Context.Provider>
    </DragDropContext>
  );
};

const MainControlPanel = () => {
  const { setMenuIndex } = useContext(Context);

  return (
    <div className="ts-gen__panel">
      <div className="ts-gen__btn-wrapper">
        <button
          className="ts-gen__btn ts-gen__btn_blue"
          onClick={() => setMenuIndex(0)}
        >
          <i className="fa-solid fa-tablet"></i>
          <span className="ts-gen__btn-text">Scheme</span>
        </button>
        <button
          className="ts-gen__btn ts-gen__btn_green"
          onClick={() => setMenuIndex(1)}
        >
          <i className="fa-solid fa-cubes"></i>
          <span className="ts-gen__btn-text">Elements</span>
        </button>
      </div>
    </div>
  );
};

const SchemeContainer = () => {
  const { blocks, setBlocks, isDeleteVisible } = useContext(Context);

  return (
    <div className="ts-gen ts-gen__container">
      <SchemeControlPanel />

      <div className="ts-gen__container">
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
                      newBlocks[index].isVisible = !newBlocks[index].isVisible;
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
          <Preview />
        </div>
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
    </div>
  );
};

const SchemeControlPanel = () => {
  const { blocks, setBlocks, elements } = useContext(Context);

  const plusModal = useRef(null);

  return (
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
            className="ts-gen__plus-dialog-item ts-gen__plus-dialog-item_spacer"
            onClick={() => {
              plusModal.current.close();
              setBlocks([
                ...blocks,
                {
                  type: BLOCK_TYPES.SPACER,
                  title: 'Spacer',
                  id: uuid(),
                  showInPreview: true,
                  isVisible: true,
                },
              ]);
            }}
          >
            <Icon icon={BLOCK_TYPES.SPACER} />
            <div className="ts-gen__plus-dialog-title">Spacer</div>
          </div>

          <div
            className="ts-gen__plus-dialog-item ts-gen__plus-dialog-item_header"
            onClick={() => {
              plusModal.current.close();
              setBlocks([
                ...blocks,
                {
                  type: BLOCK_TYPES.HEADER,
                  title: 'Header',
                  id: uuid(),
                  showInPreview: true,
                  isVisible: true,
                  value: '',
                },
              ]);
            }}
          >
            <Icon icon={BLOCK_TYPES.HEADER} />
            <div className="ts-gen__plus-dialog-title">Header</div>
          </div>
          {elements.map((element) => {
            const { id, title, type } = element;
            if (blocks.find((block) => block.id === id)) return '';

            return (
              <div
                key={id}
                className="ts-gen__plus-dialog-item"
                onClick={() => {
                  plusModal.current.close();
                  setBlocks([
                    ...blocks,
                    { ...element, value: '', isVisible: true },
                  ]);
                }}
              >
                <Icon icon={type} />
                <div className="ts-gen__plus-dialog-title">{title}</div>
              </div>
            );
          })}
        </dialog>
      </div>
    </div>
  );
};

const Preview = () => {
  const { blocks } = useContext(Context);
  const [preview, setPreview] = useState('');

  const getPreview = () => {
    const text = [];

    blocks.forEach(({ type, showInPreview, title, value, isVisible }) => {
      if (!showInPreview || !isVisible) return;
      if (type === BLOCK_TYPES.SPACER) return text.push('');
      if (type === BLOCK_TYPES.HEADER)
        return (
          text.push(''), text.push(`*${value.toUpperCase()}*`), text.push('')
        );
      text.push(`${title} - ${value}`);
    });

    return text.join('\n');
  };

  useEffect(() => {
    setPreview(getPreview());
  }, [blocks]);

  return <div className="ts-gen__preview">{preview}</div>;
};

const ElementsContainer = () => {
  const { elements } = useContext(Context);

  return (
    <div className="ts-gen__container">
      <div className="ts-gen__panel"></div>
      <div className="ts-gen__section">
        {elements.map((element) => {
          return <ElementsContainerItem key={element.id} {...element} />;
        })}
      </div>
    </div>
  );
};

const ElementsContainerItem = ({ type, title }) => {
  return (
    <div className="ts-gen__element-item">
      <div className="ts-gen__element-icon">
        <Icon icon={type} />
      </div>

      <div className="ts-gen__element-title">{title}</div>
    </div>
  );
};

export default TS_Generator;
