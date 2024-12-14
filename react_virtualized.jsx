`/**
 * ! important : Currently this below logic only works with window scroll events
 * @feature v2 : Need to implement container scroll events
 */
import React, { useRef } from "react";
import {
  List,
  CellMeasurer,
  CellMeasurerCache,
  WindowScroller,
  AutoSizer,
} from "react-virtualized";

const DynamicHeightList = ({
  dataList,
  loader,
  defaultHeight,
  renderRow,
  scrollElement,
  gap,
}) => {
  const effectiveGap = gap || 20; // Default gap between items
  const visibleIndexesRef = useRef(new Set());

  // Track visible rows
  const handleVisibleRows = ({ startIndex, stopIndex }) => {
    const updatedIndexes = new Set();
    for (let i = startIndex; i <= stopIndex; i++) {
      updatedIndexes.add(i);
    }
    visibleIndexesRef.current = updatedIndexes;
  };

  const listRef = useRef(null); // Reference to the List component

  const handleHeightChange = (index) => {
    // Clear the cached height for the row
    cache.clear(index, 0);

    // Recompute row heights
    if (listRef.current) {
      listRef.current.recomputeRowHeights(index);
    }
  };

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: (defaultHeight || 50) + effectiveGap,
  });

  const rowRenderer = ({ index, key, parent, style, isScrolling }) => {
    const item = dataList[index];
    const adjustedStyle = {
      ...style,
      height: style.height - effectiveGap,
    };
    const isVisible = visibleIndexesRef.current.has(index);
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        {({ measure }) => (
          <div
            style={{
              ...adjustedStyle,
              marginBottom: effectiveGap,
            }}
            onLoad={measure}
          >
            {isScrolling && !isVisible ? (
              <div className="h-100">{loader(style)}</div>
            ) : (
              renderRow(item)
            )}
          </div>
        )}
      </CellMeasurer>
    );
  };

  return (
    <WindowScroller scrollElement={scrollElement || window}>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              ref={listRef}
              autoHeight
              height={height}
              width={width}
              isScrolling={isScrolling}
              scrollTop={scrollTop}
              onScroll={onChildScroll}
              rowCount={dataList.length}
              rowHeight={({ index }) =>
                cache.rowHeight({ index }) + effectiveGap
              }
              rowRenderer={rowRenderer}
              deferredMeasurementCache={cache}
              overscanRowCount={5}
              onRowsRendered={handleVisibleRows}
            />
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
};

export default DynamicHeightList;
