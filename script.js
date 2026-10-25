"use strict";

const products = [
    { name: "Laptop", price: 800 },
    { name: "Mouse", price: 25 }
];

const productTable = document.getElementById("productTable");
const productForm = document.getElementById("productForm");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const message = document.getElementById("message");

console.log("--- Initializing Inventory System ---");

function getCategory(price) {
    let category;

    if (price < 50) {
        category = "Budget";
    } else if (price < 200) {
        category = "Standard";
    } else {
        category = "Premium";
    }

    switch (category) {
        case "Budget":
            return "Budget";
        case "Standard":
            return "Standard";
        case "Premium":
            return "Premium";
        default:
            return "Uncategorized";
    }
}

function addProduct(name, price) {
    name = name.trim();

    // Reject missing or invalid input
    if (!name || !Number.isFinite(price) || price <= 0) {
        message.textContent =
            "Please enter a valid product name and a price greater than zero.";
        return false;
    }

    for (let i = 0; i < products.length; i++) {
        if (products[i].name.toLowerCase() === name.toLowerCase()) {
            message.textContent = "This product already exists.";
            continue;
        }
    }

    const exists = products.some(
        product => product.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
        return false;
    }

    products.push({ name: name, price: price });

    console.log(
        `[Product added] ${name} at ₹${price.toFixed(2)}`
    );

    message.textContent = `${name} added successfully!`;
    return true;
}

function calculateTotalValue(items = products) {
    let total = 0;

    items.forEach(function(product) {
        total += product.price;
    });

    return total;
}

const calculateFinalPrice = (
    amount,
    taxRate = 5,
    discountRate = 10
) => {
    const discountedAmount = amount * (1 - discountRate / 100);
    const tax = discountedAmount * taxRate / 100;

    return {
        discount: amount - discountedAmount,
        tax: tax,
        finalPrice: discountedAmount + tax
    };
};

function renderInventory() {
    productTable.innerHTML = "";

    console.log("\n--- Processing Inventory Roster (forEach) ---");

    products.forEach(function(product) {
        const category = getCategory(product.price);

        console.log(
            `* Item: ${product.name} (₹${product.price}) -> Category: ${category}`
        );

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;

        const priceCell = document.createElement("td");
        priceCell.textContent = `₹${product.price.toFixed(2)}`;

        const categoryCell = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = category;

        categoryCell.appendChild(badge);
        row.append(nameCell, priceCell, categoryCell);
        productTable.appendChild(row);
    });

    const totalValue = calculateTotalValue();

    const affordableProducts = products.filter(function(product) {
        return product.price < 200;
    });

    const formattedReport = products.map(function(product) {
        return `${product.name.toUpperCase()}: ₹${product.price}`;
    });

    document.getElementById("productCount").textContent =
        products.length;

    document.getElementById("inventoryValue").textContent =
        `₹${totalValue.toFixed(2)}`;

    document.getElementById("affordableCount").textContent =
        affordableProducts.length;

    document.getElementById("affordableProducts").textContent =
        affordableProducts.length
            ? affordableProducts.map(product =>
                `${product.name} (₹${product.price})`
            ).join(", ")
            : "None";

    document.getElementById("report").textContent =
        formattedReport.join("\n");

    console.log("\n--- Financial Analytics ---");
    console.log(`Total Inventory Value: ₹${totalValue}`);
    console.log(
        "Filtered Affordable Items (Under ₹200):",
        affordableProducts.map(product => product.name)
    );
    console.log("Formatted Report List:", formattedReport);
}

productForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = productNameInput.value;
    const price = Number(productPriceInput.value);

    if (addProduct(name, price)) {
        productForm.reset();
        renderInventory();
    }
});

document.getElementById("calculatorForm").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        const taxRate = Number(
            document.getElementById("taxRate").value
        );

        const discountRate = Number(
            document.getElementById("discountRate").value
        );

        if (
            !Number.isFinite(taxRate) ||
            !Number.isFinite(discountRate) ||
            taxRate < 0 ||
            taxRate > 100 ||
            discountRate < 0 ||
            discountRate > 100
        ) {
            document.getElementById("calculationResult").textContent =
                "Enter tax and discount percentages between 0 and 100.";
            return;
        }

        const total = calculateTotalValue();
        const result = calculateFinalPrice(
            total,
            taxRate,
            discountRate
        );

        document.getElementById("calculationResult").textContent =
            `Inventory value: ₹${total.toFixed(2)} | ` +
            `Discount: ₹${result.discount.toFixed(2)} | ` +
            `Tax: ₹${result.tax.toFixed(2)} | ` +
            `Final amount: ₹${result.finalPrice.toFixed(2)}`;

        console.log("\n--- Tax and Discount Calculation ---");
        console.log("Original Value:", total);
        console.log("Discount:", result.discount);
        console.log("Tax:", result.tax);
        console.log("Final Amount:", result.finalPrice);
    }
);

renderInventory();
