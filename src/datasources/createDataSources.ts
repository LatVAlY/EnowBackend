import {ProductDataSource} from "./productDatasource/productDataSource";

export interface DataSources {
    ProductDataSource: ProductDataSource
}

export const createDataSources = (): DataSources => {
    return {
        ProductDataSource : new ProductDataSource()
    };
};
