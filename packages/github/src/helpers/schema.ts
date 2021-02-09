import {buildSchema, Source} from 'graphql';

export function produceSchema(source: Source) {
  try {
    if (!source.body.trim().length) {
      throw new Error(`Content is empty`);
    }

    return buildSchema(source, {
      assumeValid: true,
      assumeValidSDL: true,
    });
  } catch (e) {
    throw new Error(`Failed to parse "${source.name}": ${e.message}`);
  }
}
