import React from 'react';
import styles from './highlights.module.css';

export function Highlights({highlights}) {
  return (
    <div className={styles.highlightsContainer}>
      <div className={styles.highlightsLimiter}>
        <div className={styles.highlightsGrid}>
          {highlights.map(({title, text, link, img}) => {
            return (
              <div className={styles.highlightsItem} key={title}>
                <div>
                  <h3 className={styles.highlightsTitle}>{title}</h3>
                  {text}
                  {link}
                </div>
                {img ? <div className={styles.highlightsImg}>{img}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
