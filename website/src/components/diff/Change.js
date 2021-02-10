import React, {Component} from 'react';
import {CriticalityLevel} from '@graphql-inspector/core';
import styles from './change.module.css';

const colorMap = {
  [CriticalityLevel.Breaking]: '#D6231E',
  [CriticalityLevel.Dangerous]: '#F8B500',
  [CriticalityLevel.NonBreaking]: '#02A676',
};

export default class Change extends Component {
  render() {
    const {message, criticality} = this.props.value;
    const findSingleQuotes = /'([^']+)'/gim;
    const findDoubleQuotes = /"([^"]+)"/gim;

    const formatted = message
      .replace(findSingleQuotes, (_, value) => `<span>${value}</span>`)
      .replace(findDoubleQuotes, (_, value) => `<span>${value}</span>`);

    return (
      <div
        className={styles.changeBox}
        style={{
          borderLeftColor: colorMap[criticality.level],
        }}
      >
        <div
          className={styles.changeMessage}
          dangerouslySetInnerHTML={{__html: formatted}}
        />
      </div>
    );
  }
}
