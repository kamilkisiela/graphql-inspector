import { TokenKind, visit } from 'graphql';
import type { ParseOptions, Source } from 'graphql';
import { Parser } from 'graphql/language/parser';

class ParserWithLexer extends Parser {
  private __tokenCount: number = 0;

  get tokenCount() {
    return this.__tokenCount;
  }

  constructor(source: string | Source, options?: ParseOptions) {
    super(source, options);
    const lexer = this._lexer;
    this._lexer = new Proxy(lexer, {
      get: (target, prop, receiver) => {
        if (prop === 'advance') {
          return () => {
            const token = target.advance();
            if (token.kind !== TokenKind.EOF) {
              this.__tokenCount++;
            }
            return token;
          };
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }
}

export function calculateTokenCount(args: {
  source: Source | string;
  getReferencedFragmentSource: (fragmentName: string) => Source | string | undefined;
}): number {
  const parser = new ParserWithLexer(args.source);
  const document = parser.parseDocument();
  let { tokenCount } = parser;

  visit(document, {
    FragmentSpread(node) {
      const fragmentSource = args.getReferencedFragmentSource(node.name.value);
      if (fragmentSource) {
        tokenCount += calculateTokenCount({
          source: fragmentSource,
          getReferencedFragmentSource: args.getReferencedFragmentSource,
        });
      }
    },
  });

  return tokenCount;
}
