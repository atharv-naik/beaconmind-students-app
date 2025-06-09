import { Video } from 'expo-av';
import { useRef } from 'react';

const SuccessAnimation = () => {
  const video = useRef(null);

  return (
    <Video
      ref={video}
      source={require('@/assets/success.mp4')}
      resizeMode="contain"
      style={{ width: '100%', height: 250, resizeMode: 'contain', marginBottom: 20 }}
      shouldPlay
      isLooping={false}
    />
  );
};

export default SuccessAnimation;
