import React, { memo, useCallback, useMemo } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import isEqual from 'lodash.isequal';
import BottomSheetHandle from '../bottomSheetHandle';
import { useInteractivePanGestureHandler } from '../../hooks';
import { GESTURE } from '../../constants';
import type { BottomSheetHandleContainerProps } from './types';

const BottomSheetHandleContainerComponent = ({
  animatedIndex,
  animatedPosition,
  simultaneousHandlers,
  enableHandlePanningGesture,
  shouldMeasureHeight,
  snapPoints,
  animateToPoint,
  onMeasureHeight,
  handleComponent: _providedHandleComponent,
}: BottomSheetHandleContainerProps) => {
  //#region variables
  const shouldRenderHandle = useMemo(() => _providedHandleComponent !== null, [
    _providedHandleComponent,
  ]);
  //#endregion

  //#region
  const [handlePanGestureHandler] = useInteractivePanGestureHandler(
    GESTURE.HANDLE,
    animatedPosition,
    snapPoints,
    animateToPoint
  );
  //#endregion

  //#region callbacks
  const handleOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      onMeasureHeight(height);
    },
    [onMeasureHeight]
  );
  //#endregion

  //#region renders
  const renderHandle = useCallback(() => {
    if (_providedHandleComponent === null) {
      return null;
    }
    const HandleComponent =
      _providedHandleComponent === undefined
        ? BottomSheetHandle
        : _providedHandleComponent;

    return (
      <HandleComponent
        animatedIndex={animatedIndex}
        animatedPosition={animatedPosition}
      />
    );
  }, [animatedIndex, animatedPosition, _providedHandleComponent]);

  // console.log(
  //   'BottomSheetHandleContainer',
  //   'render',
  //   shouldRenderHandle,
  //   shouldMeasureHeight
  // );
  return shouldRenderHandle ? (
    <PanGestureHandler
      enabled={enableHandlePanningGesture}
      simultaneousHandlers={simultaneousHandlers}
      shouldCancelWhenOutside={false}
      onGestureEvent={handlePanGestureHandler}
    >
      <Animated.View
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityLabel="Bottom Sheet handle"
        accessibilityHint="Drag up or down to extend or minimize the Bottom Sheet"
        onLayout={shouldMeasureHeight ? handleOnLayout : undefined}
      >
        {renderHandle()}
      </Animated.View>
    </PanGestureHandler>
  ) : null;
  //#endregion
};

const BottomSheetHandleContainer = memo(
  BottomSheetHandleContainerComponent,
  isEqual
);

export default BottomSheetHandleContainer;
