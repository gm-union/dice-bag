import { AuthenticationError, UserInputError } from 'apollo-server-micro'

import { createUser, findUser, validatePassword } from '@/lib/user'
import { setLoginSession, getLoginSession } from '@/lib/auth'
import { removeTokenCookie } from '@/lib/auth-cookies'

import typeDefs from '../../schemas/user.graphql'

const viewer = async (_parent, _args, context, _info) => {
  try {
    const session = await getLoginSession(context.req)

    if (session) {
      return findUser({ email: session.email })
    }
  } catch (error) {
    throw new AuthenticationError(
      'Authentication token is invalid, please log in'
    )
  }
}

const signUp = async (_parent, args, _context, _info) => {
  const user = await createUser(args.input)
  return {
    user
  }
}

const signIn = async (_parent, args, context, _info) => {
  const user = await findUser({ email: args.input.email })

  if (user && (await validatePassword(user, args.input.password))) {
    const session = {
      id: user.id,
      email: user.email,
    }

    await setLoginSession(context.res, session)

    return { user }
  }

  throw new UserInputError('Invalid email and password combination')
}

const signOut = async (_parent, _args, context, _info) => {
  removeTokenCookie(context.res)
  return true
}

export const resolvers = {
  Query: {
    viewer,
  },
  Mutation: {
    signUp,
    signIn,
    signOut,
  },
}

const schemaDefinitions = {
  resolvers,
  typeDefs,
}

export default schemaDefinitions
