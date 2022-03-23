import {
    productResolver
} from "./resolverslmp";
import { merge as _merge } from "lodash";

export const resolvers = _merge(
    productResolver
);
