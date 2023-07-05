export default interface IProductRepository {

    createProduct(itemType: number ,itemName: string,itemPrice: number,itemDescription:string,itemImgUrl:string ): Promise<any>;
    getProducts(): Promise<any>;
    getProductById(itemId: number): Promise<any>;
    getProductByCategory(itemType: number): Promise<any>;
    updateProduct(itemId: number, itemName: string, itemPrice: number , itemType: number,itemDescription:string,itemImgUrl:string): Promise<any>;
    deleteProduct(id:number): Promise<any>;
}