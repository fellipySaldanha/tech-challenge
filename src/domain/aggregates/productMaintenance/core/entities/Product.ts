export default class Product {
    itemId: number;
    itemName: string;
    itemPrice: number;
    itemType: number;
    itemDescription: string;
    itemImgUrl:string;

    constructor(itemId: number, itemName: string, itemPrice: number , itemType: number,itemDescription:string,itemImgUrl:string) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemPrice = itemPrice;
        this.itemType = itemType;
        this.itemDescription = itemDescription;
        this.itemImgUrl = itemImgUrl;
    }
}
