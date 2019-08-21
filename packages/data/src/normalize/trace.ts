import {TraceNode} from '../node';
import {flatten} from '../helpers';

type TypeFieldIndex = string;

export type NormalizedTraceNodes = Omit<TraceNode, 'children'> & {
  path: Array<string | number>;
  children: void;
};

export type NormalizedTraceNodeMap = Record<
  TypeFieldIndex,
  NormalizedTraceNodes[]
>;

function createNormalizeTraceNode(
  node: TraceNode,
  path: Array<string | number> = [],
): NormalizedTraceNodes[] {
  const index =
    typeof node.index !== 'undefined'
      ? node.index
      : node.originalField || node.field;

  if (typeof index === 'undefined') {
    return flatten(node.children.map(n => createNormalizeTraceNode(n)));
  }

  const children = flatten(
    node.children.map(n => createNormalizeTraceNode(n, [...path, index])),
  );

  if (typeof node.index !== 'undefined') {
    return children;
  }

  return [
    {
      ...node,
      children: undefined,
      path,
    },
    ...children,
  ];
}

export function normalizeTraceNode(node: TraceNode): NormalizedTraceNodeMap {
  const traceMap: NormalizedTraceNodeMap = {};
  const all = createNormalizeTraceNode(node);

  all.forEach(node => {
    const index = `${node.parentType}.${node.field}`;

    if (!traceMap[index]) {
      traceMap[index] = [];
    }

    traceMap[index].push(node);
  });

  return traceMap;
}

// {
//   'Type.Field': [TraceNode]
// }

// export type NormalizedTraceNode = Required<Exclude<TraceNode, 'index' | 'errors' | 'childern'>> & {
//   path:
// };

// function normalizeTraceNode():
