import { GraphQLNamedType } from 'graphql';
import { getKind } from '../../utils/graphql';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  TypeAdded,
  TypeDescriptionAdded,
  TypeDescriptionChanged,
  TypeDescriptionRemoved,
  TypeKindChanged,
  TypeRemoved,
} from './change';

function buildTypeRemovedMessage(type: TypeRemoved): string {
  return `Type '${type.meta.removedTypeName}' was removed`;
}

export function typeRemoved(type: GraphQLNamedType): Change<ChangeType.TypeRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    type: ChangeType.TypeRemoved,
    get message() {
      return buildTypeRemovedMessage(this);
    },
    path: type.name,
    meta: {
      removedTypeName: type.name,
    },
  };
}

function buildTypeAddedMessage(type: TypeAdded): string {
  return `Type '${type.meta.addedTypeName}' was added`;
}

export function typeAdded(type: GraphQLNamedType): Change<ChangeType.TypeAdded> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.TypeAdded,
    get message() {
      return buildTypeAddedMessage(this);
    },
    path: type.name,
    meta: {
      addedTypeName: type.name,
    },
  };
}

function buildTypeKindChangedMessage(args: TypeKindChanged): string {
  return `'${args.meta.typeName}' kind changed from '${args.meta.oldTypeKind}' to '${args.meta.newTypeKind}'`;
}

export function typeKindChanged(
  oldType: GraphQLNamedType,
  newType: GraphQLNamedType,
): Change<ChangeType.TypeKindChanged> {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason: `Changing the kind of a type is a breaking change because it can cause existing queries to error. For example, turning an object type to a scalar type would break queries that define a selection set for this type.`,
    },
    type: ChangeType.TypeKindChanged,
    get message() {
      return buildTypeKindChangedMessage(this);
    },
    path: oldType.name,
    meta: {
      typeName: oldType.name,
      newTypeKind: String(getKind(newType)),
      oldTypeKind: String(getKind(oldType)),
    },
  };
}

function buildTypeDescriptionChangedMessage(args: TypeDescriptionChanged): string {
  return `Description '${args.meta.oldTypeDescription}' on type '${args.meta.typeName}' has changed to '${args.meta.newTypeDescription}'`;
}

export function typeDescriptionChanged(
  oldType: GraphQLNamedType,
  newType: GraphQLNamedType,
): Change<ChangeType.TypeDescriptionChanged> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.TypeDescriptionChanged,
    get message() {
      return buildTypeDescriptionChangedMessage(this);
    },
    path: oldType.name,
    meta: {
      typeName: oldType.name,
      newTypeDescription: newType.description ?? '',
      oldTypeDescription: oldType.description ?? '',
    },
  };
}

function buildTypeDescriptionRemoved(args: TypeDescriptionRemoved): string {
  return `Description '${args.meta.removedTypeDescription}' was removed from object type '${args.meta.typeName}'`;
}

export function typeDescriptionRemoved(
  type: GraphQLNamedType,
): Change<ChangeType.TypeDescriptionRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.TypeDescriptionRemoved,
    get message() {
      return buildTypeDescriptionRemoved(this);
    },
    path: type.name,
    meta: {
      typeName: type.name,
      removedTypeDescription: type.description ?? '',
    },
  };
}

function buildTypeDescriptionAddedMessage(args: TypeDescriptionAdded): string {
  return `Object type '${args.meta.typeName}' has description '${args.meta.addedTypeDescription}'`;
}

export function typeDescriptionAdded(
  type: GraphQLNamedType,
): Change<ChangeType.TypeDescriptionAdded> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.TypeDescriptionAdded,
    get message() {
      return buildTypeDescriptionAddedMessage(this);
    },
    path: type.name,
    meta: {
      typeName: type.name,
      addedTypeDescription: type.description ?? '',
    },
  };
}
