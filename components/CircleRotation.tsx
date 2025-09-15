import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { memo } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
type Props = {
  isRefresh: boolean;
  setIsRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};
const CircleRotation = memo(({ isRefresh, setIsRefresh }: Props) => {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  const handleRefreshLocation = () => {
    setIsRefresh(true);
    rotation.value = withTiming(rotation.value + 360, { duration: 1000 });
    setTimeout(() => {
      setIsRefresh(false);
    }, 1000);
  };

  return (
    <TouchableWithoutFeedback onPress={handleRefreshLocation} disabled={isRefresh}>
      <Animated.View style={animatedStyle}>
        <FontAwesome6 name="arrows-rotate" size={22} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
});
CircleRotation.displayName = 'CircleRotation';

export default CircleRotation;
