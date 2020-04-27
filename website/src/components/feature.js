import React from 'react';

import classnames from 'classnames';
import styles from './feature.module.css';

export function Feature({reversed, title, img, text}) {
  const left = <div className={styles.featureImage}>{img}</div>;
  const right = (
    <div className={styles.featureText}>
      <h3 className={styles.featureTitle}>{title}</h3>
      {text}
    </div>
  );

  return (
    <div className={styles.featureContainer}>
      <div
        className={classnames(styles.featureContent, {
          [styles.reversed]: reversed === true,
        })}
      >
        {reversed ? (
          <>
            {right}
            {left}
          </>
        ) : (
          <>
            {left}
            {right}
          </>
        )}
      </div>
    </div>
  );
}
