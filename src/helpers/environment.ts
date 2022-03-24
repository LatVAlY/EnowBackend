const defaultPort = 4000;

interface Environment {
  apollo: {
    introspection: boolean;
    playground: boolean;
    tracing: boolean;
  };
  apis: {
    enow: string;
  };
  firebase: {
    accessTokenHeaderName: string;
  };
  port: number | string;
  stage: string;
}

export const environment: Environment = {
  apollo: {
    introspection: process.env.APOLLO_INTROSPECTION === "true",
    playground: process.env.APOLLO_PLAYGROUND === "true",
    tracing: process.env.APOLLO_TRACING === "true",
  },
  apis: {
    enow: process.env.WLTP_API_URL,

  },
  firebase: {
    accessTokenHeaderName: "x-forwarded-access-token",
  },

  port: process.env.PORT || defaultPort,
  stage: process.env.STAGE || "development",
};
