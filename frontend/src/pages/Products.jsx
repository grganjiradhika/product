import { useState } from 'react';
import ProductCard from '../components/ProductCard';

function Products() {
    const [products] = useState([
        {
            id: 1,
            name: "Premium Wireless Headphones",
            price: 79.99,
            rating: 4.5,
            reviews: 128,
            image: "🎧",
            description: "High-quality sound with noise cancellation and 30-hour battery life",
            inStock: true,
        },
        {
            id: 2,
            name: "Smartwatch Pro",
            price: 299.99,
            rating: 4.7,
            reviews: 256,
            image: "⌚",
            description: "Advanced fitness tracking with heart rate monitor and GPS",
            inStock: true,
        },
        {
            id: 3,
            name: "4K Webcam",
            price: 149.99,
            rating: 4.3,
            reviews: 89,
            image: "📹",
            description: "Ultra HD webcam perfect for streaming and video calls",
            inStock: true,
        },
        {
            id: 4,
            name: "Portable SSD 1TB",
            price: 129.99,
            rating: 4.6,
            reviews: 342,
            image: "💾",
            description: "Fast external storage with 1050MB/s read speed",
            inStock: false,
        },
        {
            id: 5,
            name: "Mechanical Keyboard",
            price: 159.99,
            rating: 4.8,
            reviews: 512,
            image: "⌨️",
            description: "RGB mechanical keyboard with custom switches and aluminum frame",
            inStock: true,
        },
        {
            id: 6,
            name: "Wireless Mouse",
            price: 49.99,
            rating: 4.4,
            reviews: 178,
            image: "🖱️",
            description: "Ergonomic wireless mouse with precision tracking",
            inStock: true,
        },
    ]);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Products</h1>
            <p className="text-gray-600 mb-12">Explore our collection of premium tech products</p>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    );
}

export default Products;
