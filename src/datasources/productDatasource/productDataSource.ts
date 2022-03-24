import { RESTDataSource } from "apollo-datasource-rest";
import {ProductsData} from "../../api/productService";

export class ProductDataSource extends RESTDataSource {
    constructor() {
        super();
    }
    async getProduct(id: number) {
        return ProductsData.find((p) => p.id === id);
    }
    async getProducts() {
        return ProductsData
    }
    async addProduct(product : any) {
        return true
    }
}
