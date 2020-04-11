import React, {useState, useEffect} from 'react';
import {MonacoDiffEditor} from 'react-monaco-editor';
import {buildSchema} from 'graphql';
import {diff} from '@graphql-inspector/core';
import styled from 'styled-components';
import FlipMove from 'react-flip-move';

import Change from './Change';

const height = 300;

const Container = styled.div`
  background-color: #000;
  display: flex;

  @media only screen and (max-width: 950px) {
    flex-direction: column;
  }

  @media only screen and (min-width: 950px) {
    flex-direction: row;
    justify-content: space-between;
    max-height: ${height}px;
  }
`;

const Changes = styled(FlipMove)`
  flex-shrink: 0;
  flex-grow: 1;
  overflow: scroll;
  box-sizing: border-box;

  @media only screen and (max-width: 950px) {
    width: 100%;
    max-height: ${height}px;
    padding: 15px;
  }

  @media only screen and (min-width: 950px) {
    width: 45%;
    padding-left: 15px;
  }
`;

const oldSchemaString = `
  type Post {
    id: ID!
    title: String
    createdAt: String
    modifiedAt: String
  }

  type Query {
    post: Post!
    posts: [Post!]
  }
`;

const newSchemaString = `
  type Post {
    id: ID!
    title: String!
    createdAt: String
  }

  type Query {
    post: Post!
  }
`;

const oldSchema = buildSchema(oldSchemaString);

export default function Diff() {
  const [code, setCode] = useState(newSchemaString);
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    try {
      setChanges(diff(oldSchema, buildSchema(code)));
    } catch (e) {
      console.error(e);
    }
  }, [code]);

  return (
    <Container>
      <MonacoDiffEditor
        width="100%"
        height={height}
        language="graphql"
        theme="vs-dark"
        original={oldSchemaString}
        value={code}
        onChange={setCode}
        options={{
          codeLens: false,
          lineNumbers: 'off',
          minimap: false,
          originalEditable: false,
        }}
      />
      <Changes enterAnimation="fade" leaveAnimation="fade">
        {changes.map((change, i) => (
          <Change key={i} value={change} />
        ))}
      </Changes>
    </Container>
  );
}
