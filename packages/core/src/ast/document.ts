import {
  DefinitionNode,
  FragmentDefinitionNode,
  Kind,
  OperationDefinitionNode,
  parse,
  Source,
} from 'graphql';

export interface Document {
  source: Source;
  fragments: {
    node: FragmentDefinitionNode;
    source: string;
  }[];
  operations: {
    node: OperationDefinitionNode;
    source: string;
  }[];
  hasFragments: boolean;
  hasOperations: boolean;
}

export function readDocument(source: Source): Document {
  const result: Document = {
    source,
    fragments: [],
    operations: [],
    hasFragments: false,
    hasOperations: false,
  };

  const documentNode = parse(source.body);
  const filepath = source.name;
  const definitions = documentNode.definitions || [];

  for (const node of definitions) {
    if (isOperation(node)) {
      result.operations.push({
        node,
        source: filepath,
      });
    } else if (isFragment(node)) {
      result.fragments.push({
        node,
        source: filepath,
      });
    }
  }

  result.hasFragments = result.fragments.length > 0;
  result.hasOperations = result.operations.length > 0;

  return result;
}

function isOperation(node: DefinitionNode): node is OperationDefinitionNode {
  return node.kind === Kind.OPERATION_DEFINITION;
}

function isFragment(node: DefinitionNode): node is FragmentDefinitionNode {
  return node.kind === Kind.FRAGMENT_DEFINITION;
}
