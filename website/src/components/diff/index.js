import React, {useState, useEffect} from 'react';
import {MonacoDiffEditor} from 'react-monaco-editor';
import {buildSchema} from 'graphql';
import {diff} from '@graphql-inspector/core';
import styles from './index.module.css';
import FlipMove from 'react-flip-move';

import Change from './Change';

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
    <div className={styles.diffContainer}>
      <MonacoDiffEditor
        width="100%"
        height={300}
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
      <FlipMove
        className={styles.diffChanges}
        enterAnimation="fade"
        leaveAnimation="fade"
      >
        {changes.map((change, i) => (
          <Change key={i} value={change} />
        ))}
      </FlipMove>
    </div>
  );
}
