import { Resolvers } from "../../api/models";

export const productResolver: Resolvers = {
  Query: {
    getProducts: async (_source, _args, { dataSources, accessToken }) => {
      return await dataSources.ProductDataSource.getProducts()
    },

    getProduct: async (_source, _args, { dataSources, accessToken }) => {
      return await dataSources.ProductDataSource.getProduct(_args.id)
    },
  },
  Mutation: {
    addProduct: async (
      _source,
      _args,
      { dataSources, accessToken }
    ) => {
      return await dataSources.ProductDataSource.addProduct(
        _args.input
      );
    },
  },
};
