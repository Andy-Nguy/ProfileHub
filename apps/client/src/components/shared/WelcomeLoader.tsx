import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const WELCOME_LOTTIE_SRC =
  'https://lottie.host/657a195b-95c9-437e-8cea-74bbe1ac6ce0/6fs50CZCUd.lottie';

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
