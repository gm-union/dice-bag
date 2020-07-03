import { ApolloServer } from 'apollo-server-micro'
import { GraphQLRequest, GraphQLResponse, GraphQLRequestContext } from 'apollo-server-core'

import { v4 as uuid } from 'uuid'
import { schema } from '../../apollo/schema'
import { logger } from '../../lib/logger'

const isDevelopmentEnvironemnt = ['development', 'test'].includes(process.env.NODE_ENV)

interface Context extends GraphQLRequestContext {
  beforeResponding():void
  req: GraphQLRequest
  res: GraphQLResponse
  requestId: string
}

const apolloServer = new ApolloServer({
  schema,
  context({ req, res }: Context) {
    const requestId = uuid()

    const beforeResponding = () => {

    }

    return {
      beforeResponding,
      req,
      res,
      requestId,
    }
  },
  debug: isDevelopmentEnvironemnt,
  playground: {
    settings: {
      'request.credentials': 'same-origin'
    },
  },
  plugins: [
    {
      requestDidStart: ({ context: { requestId } }) => {
        const startTime = Date.now()
        logger.info({
          requestId,
          message: 'Received request.',
          timestamp: startTime,
        })

        return {
          willSendResponse: (res): void => {
            const endTime = Date.now()

            res.context.beforeResponding()

            logger.info({
              requestId,
              timestamp: endTime,
              elapsed: endTime - startTime,
              message: 'Sending Response'
            })
          },
        }
      },
    }
  ]
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default (req, res) => {
  const handler = apolloServer.createHandler({ path: '/api/graphql' })

  return handler(req, res)
}
