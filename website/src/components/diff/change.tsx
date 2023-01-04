import { forwardRef } from 'react';
import { Change, CriticalityLevel } from '@graphql-inspector/core';
import styles from './change.module.css';

const ColorMap = {
  [CriticalityLevel.Breaking]: '#d6231e',
  [CriticalityLevel.Dangerous]: '#f8b500',
  [CriticalityLevel.NonBreaking]: '#02a676',
};

const SINGLE_QUOTES_REGEX = /'([^']+)'/g;
const DOUBLE_QUOTES_REGEX = /"([^"]+)"/g;

export default forwardRef<any, { value: Change }>(function ChangeComponent({ value }, ref) {
  const { message, criticality } = value;

  const formatted = message
    .replace(SINGLE_QUOTES_REGEX, (_, value) => `<span>${value}</span>`)
    .replace(DOUBLE_QUOTES_REGEX, (_, value) => `<span>${value}</span>`);

  return (
    <div
      ref={ref}
      className={styles.changeBox}
      style={{
        borderLeftColor: ColorMap[criticality.level],
      }}
    >
      <div className={styles.changeMessage} dangerouslySetInnerHTML={{ __html: formatted }} />
    </div>
  );
});
