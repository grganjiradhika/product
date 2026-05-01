import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

function Wishlist() {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        alert(`${product.name} added to cart!`);
    };

    if (wishlist.length === 0) {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-8">My Wishlist</h1>

                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <p className="text-gray-600 text-xl mb-6">Your wishlist is empty</p>
                    <Link
                        to="/products"
                        className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                    >
                        Explore Products
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900">My Wishlist ({wishlist.length} items)</h1>
                <button
                    onClick={clearWishlist}
                    className="text-red-500 hover:text-red-700 font-semibold transition"
                >
                    Clear Wishlist
                </button>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlist.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
                        {/* Product Image */}
                        <div className="bg-linear-to-br from-slate-500 to-slate-200 h-48 flex items-center justify-center relative">
                            <span className="text-6xl">{product.image}</span>

                            {/* Remove Button */}
                            <button
                                onClick={() => removeFromWishlist(product.id)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-300"
                                title="Remove from wishlist"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Product Details */}
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h2>

                            {/* Rating */}
                            {product.rating && (
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-amber-500 text-sm">
                                        {'★'.repeat(Math.floor(product.rating))}
                                        {'☆'.repeat(5 - Math.floor(product.rating))}
                                    </span>
                                    <span className="text-sm text-gray-600">({product.reviews || 0})</span>
                                </div>
                            )}

                            {/* Description */}
                            <p className="text-gray-600 mb-4 text-sm">{product.description}</p>

                            {/* Price */}
                            <div className="mb-4">
                                <span className="text-2xl font-bold text-amber-500">${product.price.toFixed(2)}</span>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.inStock ? (
                                    <span className="text-green-600 font-semibold text-sm">✓ In Stock</span>
                                ) : (
                                    <span className="text-red-600 font-semibold text-sm">Out of Stock</span>
                                )}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => handleAddToCart(product)}
                                disabled={!product.inStock}
                                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition duration-300"
                            >
                                {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-12 text-center">
                <Link
                    to="/products"
                    className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                >
                    Continue Shopping
                </Link>
            </div>
        </main>
    );
}

export default Wishlist;
