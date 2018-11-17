import {Source} from 'graphql';

export type DocumentsLoader = () => Promise<Source[]>;
export type DocumentsHandler = (pointer: string) => void | (DocumentsLoader);
