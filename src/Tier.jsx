import React, {useRef} from 'react';
import {useDrag, useDrop} from "react-dnd";

const Tier = ({children, id, index, moveTiers, hierarchicalPath, color, type}) => {
  const tierRef = useRef(null);
  const [{handlerId}, drop] = useDrop({
    accept: type,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item, monitor) {
      if (!tierRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = tierRef.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveTiers(dragIndex, hoverIndex, item.hPath);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      //
      item.index = hoverIndex;
      item.hPath[item.hPath.length - 1] = hoverIndex
    }
  })


  const [{isDragging}, drag] = useDrag({
    type: type,
    item: () => {
      return {id, index, hPath: hierarchicalPath};
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  drag(drop(tierRef))

  return (
    <div
      ref={tierRef}
      data-handler-id={handlerId}
      className={`tier ${isDragging ? 'dragging' : ''}`}
      style={{backgroundColor: color}}
    >
      {children}</div>
  )
}

export default Tier
