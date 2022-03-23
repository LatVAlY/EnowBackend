// Context.ts
import { DataSources } from "../datasources/createDataSources";

export interface MyContext {
  accessToken: string;
  tokenForDirectGrant: string;
  dataSources: DataSources;
}
