import { FC, useEffect, useRef, useState, KeyboardEvent } from 'react';
import { buildSchema } from 'graphql';
import { diff, Change } from '@graphql-inspector/core';
import { DiffEditor, OnMount } from '@monaco-editor/react';
import FlipMove from 'react-flip-move';
import ChangeComponent from './Change';
import styles from './index.module.css';

const OLD_SCHEMA = /* GraphQL */ `
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

const NEW_SCHEMA = /* GraphQL */ `
  type Post {
    id: ID!
    title: String!
    createdAt: String
  }

  type Query {
    post: Post!
  }
`;

const oldSchema = buildSchema(OLD_SCHEMA);

const Diff: FC = () => {
  const diffRef = useRef<any>(null);
  const [code, setCode] = useState(NEW_SCHEMA);
  const [changes, setChanges] = useState<Change[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const changes = await diff(oldSchema, buildSchema(code));
        setChanges(changes);
      } catch (error) {
        console.error(error);
      }
    };
    run();
  }, [code]);

  const handleEditorChange: OnMount = (value) => {
    console.log('here is the current model value:', value);
    diffRef.current = value.getModifiedEditor();
    value.getModifiedEditor().onKeyUp(handleChange);
  };

  function handleChange(e: KeyboardEvent<HTMLInputElement>) {
    console.error('here is the current model value:', e);
    setCode(diffRef.current.getValue());
  }

  return (
    <div className={styles.diffContainer}>
      <DiffEditor
        width="100%"
        height={300}
        language="graphql"
        theme="vs-dark"
        original={OLD_SCHEMA}
        modified={code}
        onMount={handleEditorChange}
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
          <ChangeComponent key={i} value={change} />
        ))}
      </FlipMove>
    </div>
  );
};

export default Diff;
