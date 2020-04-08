import app, {handleAction} from './probot';

export default app;

export {app};
export {handleAction};
export {ActionResult, CheckConclusion, Annotation} from './types';
export {SchemaPointer} from './probot';
export {diff} from './diff';
