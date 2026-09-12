import React from 'react';
import styles from './LetterLoader.module.css';

const LETTERS: Array<{ char: string; className: string }> = [
  { char: 'L', className: styles.l },
  { char: 'o', className: styles.o },
  { char: 'a', className: styles.a },
  { char: 'd', className: styles.d },
  { char: 'i', className: styles.i },
  { char: 'n', className: styles.n },
  { char: 'g', className: styles.g },
  { char: '.', className: styles.d1 },
  { char: '.', className: styles.d2 },
];

/**
 * LetterLoader — staggered opacity "Loading.." indicator.
 */
export const LetterLoader: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div className={`${styles.loader} ${className}`} aria-hidden="true">
    {LETTERS.map((letter, index) => (
      <span
        key={`${letter.char}-${index}`}
        className={`${styles.letter} ${letter.className}`}
      >
        {letter.char}
      </span>
    ))}
  </div>
);
