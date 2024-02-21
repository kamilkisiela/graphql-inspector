import { ReactElement, useCallback, useEffect, useState } from 'react';
import { buildSchema } from 'graphql';
import FlipMove from 'react-flip-move';
import { Change, diff } from '@graphql-inspector/core';
import { DiffEditor, DiffOnMount } from '@monaco-editor/react';
import ChangeComponent from './change';

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

export const Diff = (): ReactElement => {
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

  const onDiffOnMount: DiffOnMount = useCallback(diffEditor => {
    const editor = diffEditor.getModifiedEditor();
    editor.onKeyUp(() => {
      setCode(editor.getValue());
    });
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-zinc-900 py-16 px-4">
      <div className="xl:container flex flex-col md:flex-row gap-5">
        <DiffEditor
          height={300}
          language="graphql"
          theme="vs-dark"
          original={OLD_SCHEMA}
          modified={code}
          onMount={onDiffOnMount}
          options={{
            codeLens: false,
            lineNumbers: 'off',
            originalEditable: false,
          }}
        />
        <FlipMove className="shrink-0" enterAnimation="fade" leaveAnimation="fade">
          {changes.map((change, i) => (
            <ChangeComponent key={i} value={change} />
          ))}
        </FlipMove>
      </div>
    </div>
  );
};

export default Diff;
