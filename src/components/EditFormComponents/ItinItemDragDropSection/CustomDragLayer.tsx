import React from 'react';
import { useDragLayer } from 'react-dnd';
import EFDraggable from './EFDraggable';
import { XYCoord } from 'react-dnd';

const CustomDragLayer = () => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) {
    return null;
  }

  function renderItem() {
    // Based on the item type, return the appropriate drag preview
    switch (itemType) {
      // Assuming "itineraryItem" is one of your item types
      case 'itineraryItem':
        return (
          <EFDraggable
            id={item.id}
            itineraryItem={item.itineraryItem}
            style={{}}
            // ... any other props you need to pass
          />
        );
      // ... handle other item types if necessary
      default:
        return null;
    }
  }

  function getItemStyles(currentOffset: XYCoord | null): React.CSSProperties {
    if (!currentOffset) {
      return {
        display: 'none',
      };
    }
    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 100,
      left: 0,
      top: 0,
      transform,
      WebkitTransform: transform,
      // Ensure the item is fully opaque if that is the desired effect
      opacity: 1,
    };
  }

  // Render the drag preview
  return (
    <div style={getItemStyles(currentOffset)}>
      {renderItem()}
    </div>
  );
};

export default CustomDragLayer;
