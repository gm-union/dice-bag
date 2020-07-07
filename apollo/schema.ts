import { makeExecutableSchema } from 'graphql-tools'

import user from './resolvers/user'

const schemaDefinitions = [
  user,
].reduce((definitions, schemaDefinition) => ({
  resolvers: {
    ...definitions.resolvers,
    ...schemaDefinition.resolvers,
  },
  typeDefs: {
    ...definitions.typeDefs,
    ...schemaDefinition.typeDefs,
  },
}))

export const schema = makeExecutableSchema(schemaDefinitions)
