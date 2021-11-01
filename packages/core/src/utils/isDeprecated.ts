import { GraphQLEnumValue, GraphQLField } from "graphql";

export function isDeprecated(fieldOrEnumValue: GraphQLField<any, any> | GraphQLEnumValue) {
    if ('isDeprecated' in fieldOrEnumValue) {
        return fieldOrEnumValue['isDeprecated'];
    }
    if (fieldOrEnumValue.deprecationReason != null) {
        return true;
    }
    if (fieldOrEnumValue.astNode?.directives?.some(directive => directive.name.value === "deprecated")) {
        return true;
    }
    return false;
}
