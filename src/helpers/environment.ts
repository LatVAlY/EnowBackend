const defaultPort = 4000;
const defaultMinioPort = 9099;

interface Environment {
  apollo: {
    introspection: boolean;
    playground: boolean;
    tracing: boolean;
  };
  apis: {
    wltp: string;
    minio: {
      endPoint: string;
      port: number | string;
      accessKey: string;
      secretKey: string;
      useSSL: boolean;
    };
  };

  firebase: {
    accessTokenHeaderName: string;
  };
  serviceOidc: {
    tokenEndpoint: string;
    clientId: string;
    clientSecret: string;
    expiresAtThreshold: number;
  };
  port: number | string;
  filesDirectory: string;
  mockFileRequests: boolean;
  stage: string;
  minioDirectories: {
    minioBucketName: string;
  };
}

export const environment: Environment = {
  apollo: {
    introspection: process.env.APOLLO_INTROSPECTION === "true",
    playground: process.env.APOLLO_PLAYGROUND === "true",
    tracing: process.env.APOLLO_TRACING === "true",
  },
  apis: {
    wltp: process.env.WLTP_API_URL,
    minio: {
      endPoint: process.env.MINIO_ENDPOINT || "minio",
      port: process.env.MINIO_PORT || defaultMinioPort,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
      useSSL: process.env.MINIO_USE_SSL === "true",
    },
  },
  firebase: {
    accessTokenHeaderName: "x-forwarded-access-token",
  },
  serviceOidc: {
    tokenEndpoint: process.env.OIDC_SERVICE_TOKEN_ENDPOINT || "",
    clientId: process.env.OIDC_SERVICE_CLIENT_ID || "",
    clientSecret: process.env.OIDC_SERVICE_CLIENT_SECRET || "",
    expiresAtThreshold:
      parseInt(process.env.OIDC_SERVICE_EXPIRES_AT_THRESHOLD) || 300,
  },
  port: process.env.PORT || defaultPort,
  filesDirectory: process.env.FILES_DIRECTORY,
  mockFileRequests: process.env.MOCK_FILE_REQUESTS === "true",
  stage: process.env.STAGE || "development",
  minioDirectories: {
    minioBucketName: process.env.MINIO_BUCKET_NAME || "wltp-1",
  },
};
