class Category {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static findAll() {
        return categoriesDB;
    }
}

class Item {
    constructor(id, name, category_id, image) {
        this.id = id;
        this.name = name;
        this.category_id = category_id;
        this.image = image;
    }

    static findAll() {
        return itemsDB;
    }

    static findById(id) {
        return itemsDB.find(item => item.id === parseInt(id));
    }

    static search(query) {
        const lowerQuery = query.toLowerCase();
        return itemsDB.filter(item => item.name.toLowerCase().includes(lowerQuery)).slice(0, 10);
    }

    static findRelated(id, category_id) {
        return itemsDB.filter(item => item.category_id === category_id && item.id !== parseInt(id)).slice(0, 5);
    }
}

class Shop {
    constructor(id, name, distance) {
        this.id = id;
        this.name = name;
        this.distance = distance;
    }

    static findById(id) {
        return shopsDB.find(shop => shop.id === parseInt(id));
    }

    static findByItemId(itemId) {
        const itemShops = shopItemsDB.filter(si => si.item_id === parseInt(itemId));
        const shopsWithDetails = itemShops.map(si => {
            const shop = shopsDB.find(s => s.id === si.shop_id);
            return {
                ...shop,
                price: si.price,
                stock: si.stock
            };
        });
        return shopsWithDetails.sort((a, b) => a.distance - b.distance);
    }
}

class ShopItem {
    constructor(id, shop_id, item_id, price, stock) {
        this.id = id;
        this.shop_id = shop_id;
        this.item_id = item_id;
        this.price = price;
        this.stock = stock;
    }
}

// In-Memory Database Arrays
let categoriesDB = [];
let itemsDB = [];
let shopsDB = [];
let shopItemsDB = [];

// Data Generation Logic
function seedInMemoryDatabase() {
    const categoryNames = [
        "Vegetables", "Dairy", "Electronics", "Essentials", "Cosmetics",
        "Medicine", "Toys", "Clothing", "Fruits", "Sweets"
    ];

    categoryNames.forEach((name, idx) => {
        categoriesDB.push(new Category(idx + 1, name));
    });

    const itemsData = [
        { name: "Tomato", category: "Vegetables" }, { name: "Potato", category: "Vegetables" }, { name: "Onion", category: "Vegetables" },
        { name: "Carrot", category: "Vegetables" }, { name: "Spinach", category: "Vegetables" }, { name: "Capsicum", category: "Vegetables" },
        { name: "Milk", category: "Dairy" }, { name: "Curd", category: "Dairy" }, { name: "Cheese", category: "Dairy" },
        { name: "Butter", category: "Dairy" }, { name: "Paneer", category: "Dairy" }, { name: "Yogurt", category: "Dairy" },
        { name: "Headphones", category: "Electronics" }, { name: "Charger", category: "Electronics" }, { name: "Power Bank", category: "Electronics" },
        { name: "USB Cable", category: "Electronics" }, { name: "Mouse", category: "Electronics" },
        { name: "Rice (5kg)", category: "Essentials" }, { name: "Washing Powder", category: "Essentials" }, { name: "Salt", category: "Essentials" },
        { name: "Sugar", category: "Essentials" }, { name: "Oil (1L)", category: "Essentials" },
        { name: "Lipstick", category: "Cosmetics" }, { name: "Face Wash", category: "Cosmetics" }, { name: "Perfume", category: "Cosmetics" },
        { name: "Moisturizer", category: "Cosmetics" }, { name: "Shampoo", category: "Cosmetics" },
        { name: "Paracetamol", category: "Medicine" }, { name: "Bandage", category: "Medicine" }, { name: "Cough Syrup", category: "Medicine" },
        { name: "Antiseptic", category: "Medicine" }, { name: "Vitamins", category: "Medicine" },
        { name: "Action Figure", category: "Toys" }, { name: "Lego Set", category: "Toys" }, { name: "Doll", category: "Toys" },
        { name: "Puzzle", category: "Toys" }, { name: "Toy Car", category: "Toys" },
        { name: "T-Shirt", category: "Clothing" }, { name: "Jeans", category: "Clothing" }, { name: "Socks", category: "Clothing" },
        { name: "Cap", category: "Clothing" }, { name: "Shirt", category: "Clothing" },
        { name: "Apple", category: "Fruits" }, { name: "Banana", category: "Fruits" }, { name: "Mango", category: "Fruits" },
        { name: "Grapes", category: "Fruits" }, { name: "Orange", category: "Fruits" },
        { name: "Gulab Jamun", category: "Sweets" }, { name: "Rasgulla", category: "Sweets" }, { name: "Chocolate", category: "Sweets" },
        { name: "Ladoo", category: "Sweets" }, { name: "Cake", category: "Sweets" }
    ];

    itemsData.forEach((item, idx) => {
        const cat = categoriesDB.find(c => c.name === item.category);
        const imageUrl = `https://loremflickr.com/320/240/${item.category.toLowerCase().replace(' ', ',')},${item.name.split(' ')[0]}?random=${Math.random()}`;
        itemsDB.push(new Item(idx + 1, item.name, cat.id, imageUrl));
    });

    const shopNames = [
        "Sharma General Store", "Apna Bazaar", "Daily Fresh", "City Supermart", "Green Grocers",
        "Modi Care Shop", "Reliance Fresh Copy", "Quick Mart", "Corner Store", "Value Mart",
        "Best Price Shop", "Urban Needs", "Metro Mart", "Village Store", "Town Bazaar",
        "Sunrise Stores", "Moonlight Mart", "Star Groceries", "Galaxy Supermarket", "Universe Needs",
        "Planet Fresh", "Nature's Basket Copy", "Organic World", "Healthy Life", "Fit Food",
        "Tasty Treats", "Yummy Mart", "Delicious Deals", "Spicy Store", "Sweet Tooth Shop",
        "Gupta Provisions", "Singh Super Store", "Khan Market", "Reddy's Mart", "Patel Brothers",
        "Kumar Stores", "Rao's Daily Needs", "Mehta Market", "Jain General Store", "Agarwal Sweets & More",
        "Laxmi Stores", "Ganesh Mart", "Sai Baba Provisions", "Om Shanti Store", "Krishna Mart",
        "Radha Krishna Store", "Jai Hind Mart", "Bharat Bazaar", "Indian Roots", "Western Ways"
    ];

    shopNames.forEach((name, idx) => {
        const distance = parseFloat((Math.random() * 7.9 + 0.1).toFixed(1));
        shopsDB.push(new Shop(idx + 1, name, distance));
    });

    let shopItemIdCounter = 1;
    shopsDB.forEach(shop => {
        itemsDB.forEach(item => {
            // 60% chance to have an item
            if (Math.random() > 0.4) {
                const price = Math.floor(Math.random() * 200 + 20);
                // 20% chance to be Out of Stock
                const stock = Math.random() > 0.2 ? Math.floor(Math.random() * 50) + 1 : 0;
                shopItemsDB.push(new ShopItem(shopItemIdCounter++, shop.id, item.id, price, stock));
            }
        });
    });

    console.log("In-Memory DB Seeded: ", itemsDB.length, " items, ", shopsDB.length, " shops.");
}

// Seed on startup
seedInMemoryDatabase();

module.exports = {
    Category,
    Item,
    Shop,
    ShopItem
};
