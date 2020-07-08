import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

import user from './resolvers/user'

const schemaDefinitions = [
  user,
].reduce((definitions, schemaDefinition) => ({
  resolvers: merge( definitions.resolvers, schemaDefinition.resolvers),
  typeDefs: merge( definitions.typeDefs, schemaDefinition.typeDefs),
}))

export const schema = makeExecutableSchema(schemaDefinitions)
