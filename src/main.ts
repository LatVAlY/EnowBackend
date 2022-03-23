import {handleDownloadRequest} from "./helpers/fileHelper";
import {ApolloServer} from "apollo-server-express";
import {graphqlUploadExpress} from "graphql-upload";
import {resolvers} from "./resolvers/resolvers";
import {environment} from "./helpers/environment";
import {createDataSources} from "./datasources/createDataSources";
import {loadSchemaSync} from "@graphql-tools/load";
import {GraphQLFileLoader} from "@graphql-tools/graphql-file-loader";
import {addResolversToSchema} from "@graphql-tools/schema";
import {join} from "path";
import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import admin from 'firebase-admin'

const express = require("express");
const url = require("url");
let token = null;

// Only for local Development
// @ts-ignore
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const getToken = (idToken: string) => {
 return admin.auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        // ...
      })
      .catch((error) => {
        // Handle error
      });
}
const startServer = async () => {
  const schema = loadSchemaSync(
      join(__dirname, "../graphql-schema/schema/*.graphql"),
      {loaders: [new GraphQLFileLoader()]}
  );
  const schemaWithResolvers = addResolversToSchema({
    schema,
    resolvers,
  });
  const apolloServer = new ApolloServer({
    schema: schemaWithResolvers,
    plugins: [
      environment.apollo.playground
        ? ApolloServerPluginLandingPageGraphQLPlayground({
            settings: {
              "request.credentials": "same-origin",
            },
          })
        : ApolloServerPluginLandingPageDisabled(),
      ApolloServerPluginCacheControl({
        defaultMaxAge: 0,
      }),
    ],
    introspection: environment.apollo.introspection,
    dataSources: createDataSources as any,
    context: async ({ req }) => {
      let accessToken: string =
          (req.headers[environment.firebase.accessTokenHeaderName] as string) || "";
      if (accessToken && accessToken.indexOf("Bearer") !== -1) {
        accessToken = accessToken.slice("Bearer ".length);
      }
      // const auth = getToken(accessToken)
      // console.log(auth)
      return {
        accessToken: accessToken,
        tokenForDirectGrant: "",
      };
    },
  });

  await apolloServer.start();
  const app = express();
  // adding limit to payload
  app.use(express.urlencoded({ limit: "25mb" }));
  app.use(express.json({ limit: "25mb" }));
  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());
  apolloServer.applyMiddleware({ app, path: "/graphql" });
  const server = app.listen({ port: environment.port }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${environment.port}${apolloServer.graphqlPath}`
    );
  });
  app.post("/download", express.json(), function (req, res) {
    handleDownloadRequest(req, res);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => server.close());
  }
};

startServer();
