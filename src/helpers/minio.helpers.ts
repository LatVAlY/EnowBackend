import { environment } from "./environment";
import { Client } from "minio";

export const getMinioClient = (): Client => {
  const minioClientConfig = {
    endPoint: environment.apis.minio.endPoint,
    port: parseInt(environment.apis.minio.port.toString()),
    accessKey: environment.apis.minio.accessKey,
    secretKey: environment.apis.minio.secretKey,
    useSSL: environment.apis.minio.useSSL,
  };
  return new Client(minioClientConfig);
};
