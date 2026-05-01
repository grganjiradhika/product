import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

function ProductCard({ product }) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setQuantity(1);
        // Show success message (you can add a toast notification here)
        alert(`${product.name} added to cart!`);
    };

    const handleToggleWishlist = () => {
        toggleWishlist(product);
    };

    const inWishlist = isInWishlist(product.id);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
            {/* Product Image */}
            <div className="bg-linear-to-br from-slate-500 to-slate-200 h-64 flex items-center justify-center relative">
                <span className="text-8xl">{product.image}</span>

                {/* Wishlist Button */}
                <button
                    onClick={handleToggleWishlist}
                    className={`absolute top-4 right-4 p-2 rounded-full transition duration-300 ${inWishlist
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-400 hover:bg-gray-100 hover:text-red-500'
                        }`}
                    title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    ♥
                </button>
            </div>

            {/* Product Details */}
            <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h2>

                {/* Rating */}
                {product.rating && (
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-amber-500">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                        <span className="text-sm text-gray-600">({product.reviews || 0} reviews)</span>
                    </div>
                )}

                {/* Description */}
                <p className="text-gray-600 mb-4 text-sm">{product.description}</p>

                {/* Price */}
                <div className="mb-4">
                    <span className="text-3xl font-bold text-amber-500">${product.price.toFixed(2)}</span>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                    {product.inStock ? (
                        <span className="text-green-600 font-semibold text-sm">✓ In Stock</span>
                    ) : (
                        <span className="text-red-600 font-semibold text-sm">Out of Stock</span>
                    )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-12 text-center border-0 outline-none"
                            min="1"
                        />
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                >
                    {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
