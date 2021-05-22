import React, { memo, useCallback, useMemo, useRef } from 'react';
import { LayoutChangeEvent, View, StatusBar } from 'react-native';
import { WINDOW_HEIGHT } from '../../constants';
import { print } from '../../utilities';
import { styles } from './styles';
import type { BottomSheetContainerProps } from './types';

function BottomSheetContainerComponent({
  containerHeight,
  containerOffset,
  topInset = 0,
  bottomInset = 0,
  shouldCalculateHeight = true,
  children,
}: BottomSheetContainerProps) {
  const containerRef = useRef<View>(null);
  //#region styles
  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        top: topInset,
        bottom: bottomInset,
      },
    ],
    [topInset, bottomInset]
  );
  //#endregion

  //#region callbacks
  const handleContainerLayout = useCallback(
    function handleContainerLayout({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) {
      if (height !== containerHeight.value) {
        containerHeight.value = height;
      }

      containerRef.current?.measure(
        (_x, _y, _width, _height, _pageX, pageY) => {
          containerOffset.value = {
            top: pageY,
            left: 0,
            right: 0,
            bottom:
              WINDOW_HEIGHT - (pageY + height + (StatusBar.currentHeight ?? 0)),
          };
        }
      );

      print({
        component: BottomSheetContainer.displayName,
        method: 'handleContainerLayout',
        params: {
          height,
        },
      });
    },
    [containerHeight, containerOffset, containerRef]
  );
  //#endregion

  //#region render
  return (
    <View
      ref={containerRef}
      pointerEvents="box-none"
      onLayout={shouldCalculateHeight ? handleContainerLayout : undefined}
      style={containerStyle}
      children={children}
    />
  );
  //#endregion
}

const BottomSheetContainer = memo(BottomSheetContainerComponent);
BottomSheetContainer.displayName = 'BottomSheetContainer';

export default BottomSheetContainer;
