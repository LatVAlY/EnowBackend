import {
    productResolver
} from "./resolverslmp";
import { merge as _merge } from "lodash";
import { GraphQLUpload } from "graphql-upload";

export const resolvers = _merge(
  {
    Upload: GraphQLUpload,
  },
    productResolver
);
