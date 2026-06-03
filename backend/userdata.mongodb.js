use('firstdatabase');

db.createCollection('products');
db.products.insertMany([
    {
        name: 'Laptop',
        price: 999.99,
        category: 'Electronics',
        stock: 50
    },
    {
        name: 'Smartphone',
        price: 699.99,
        category: 'Electronics',
        stock: 100
    }
]);
// db.products.find().pretty();
db.products.updateOne(
    { name: 'Laptop' },
    { $set: { price: 899.99 } }
);