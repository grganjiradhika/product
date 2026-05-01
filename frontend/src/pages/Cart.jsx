import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <p className="text-gray-600 text-xl mb-6">Your cart is empty</p>
                    <Link
                        to="/products"
                        className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-8">Shopping Cart ({cart.length} items)</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {cart.map(item => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-6 border-b hover:bg-gray-50 transition"
                            >
                                {/* Product Image & Name */}
                                <div className="flex items-center gap-6 flex-1">
                                    <span className="text-6xl">{item.image}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                                        <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Quantity Control */}
                                <div className="flex items-center border border-gray-300 rounded-lg mx-4">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Price */}
                                <div className="text-right min-w-[120px]">
                                    <p className="text-lg font-bold text-amber-500">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="ml-4 text-red-500 hover:text-red-700 font-bold text-xl"
                                    title="Remove from cart"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Continue Shopping */}
                    <div className="mt-6">
                        <Link
                            to="/products"
                            className="text-amber-500 hover:text-amber-600 font-semibold transition"
                        >
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-24">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

                    {/* Calculations */}
                    <div className="space-y-4 mb-6 pb-6 border-b">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax (10%):</span>
                            <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="mb-6">
                        <div className="flex justify-between text-2xl font-bold text-amber-500">
                            <span>Total:</span>
                            <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <Link
                        to="/checkout"
                        className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg mb-4"
                    >
                        Proceed to Checkout
                    </Link>

                    {/* Clear Cart */}
                    <button
                        onClick={clearCart}
                        className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50 font-semibold py-2 rounded-lg transition"
                    >
                        Clear Cart
                    </button>
                </div>
            </div>
        </main>
    );
}

export default Cart;
