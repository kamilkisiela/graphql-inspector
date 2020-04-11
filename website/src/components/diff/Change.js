import React, {Component} from 'react';
import styled from 'styled-components';
import {CriticalityLevel} from '@graphql-inspector/core';

const colorMap = {
  [CriticalityLevel.Breaking]: '#D6231E',
  [CriticalityLevel.Dangerous]: '#F8B500',
  [CriticalityLevel.NonBreaking]: '#02A676',
};

const Box = styled.div`
  /* margin: 5px 0; */
  margin-bottom: 5px;
  padding: 10px;
  display: block;
  border: 1px solid #4a4a4a;
  font-size: 12px;
  line-height: 30px;
  box-shadow: 0 25px 68px 0 rgba(0, 0, 0, 0.02);
  border-left: 3px solid ${props => props.color};
  background-color: #4b5ff7;
  color: #fff;
  border-radius: 5px;
`;

const Message = styled.div`
  font-weight: 600;

  span {
    padding: 5px 7px;
    background-color: #1e1e1e;
    border-radius: 5px;
    font-weight: 600;
  }
`;

// const Reason = styled.div`
//   color: #9ea6fd;
//   font-style: italic;
// `;

export default class Change extends Component {
  render() {
    const {message, criticality} = this.props.value;
    const findSingleQuotes = /'([^']+)'/gim;
    const findDoubleQuotes = /"([^"]+)"/gim;

    const formatted = message
      .replace(findSingleQuotes, (_, value) => `<span>${value}</span>`)
      .replace(findDoubleQuotes, (_, value) => `<span>${value}</span>`);

    return (
      <Box color={colorMap[criticality.level]}>
        <Message dangerouslySetInnerHTML={{__html: formatted}} />
        {/* {criticality.reason ? <Reason>{criticality.reason}</Reason> : null} */}
      </Box>
    );
  }
}
