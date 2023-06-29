export default class Product {
    itemId: number;
    itemName: string;
    itemPrice: number;
    itemType: number;

    constructor(itemId: number, itemName: string, itemPrice: number , itemType: number) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemPrice = itemPrice;
        this.itemType = itemType;
    }
}
