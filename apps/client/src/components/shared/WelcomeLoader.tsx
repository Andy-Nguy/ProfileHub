import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const WELCOME_LOTTIE_SRC =
  'https://lottie.host/efd3d908-4daa-4e25-a377-86ae0c278548/t3aOB4vQky.lottie';

/**
 * WelcomeLoader — A special Lottie animation used specifically for the 
 * SideNav welcome user card. It uses a specific animation source and 
 * fixed dimensions to crop the bounding box properly.
 */
export const WelcomeLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-14">
      <DotLottieReact
        src={WELCOME_LOTTIE_SRC}
        loop
        autoplay
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
};

