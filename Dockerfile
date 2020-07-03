FROM node:erbium-buster

RUN mkdir -p /home/node/app/node_modules && mkdir -p /home/node/app/dist && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node

RUN npm install
COPY --chown=node:node . .

# we pre-build and run again in entrypoint with stage specific lifecycle.
# Since watch is run at the same time as start, we need our initial version to exist.
RUN npm run build
COPY entrypoint.sh ./

SHELL [ "sh" ]

EXPOSE 3000

ENTRYPOINT [ "./entrypoint.sh" ]
CMD [ "npm", "run", "dev" ]
