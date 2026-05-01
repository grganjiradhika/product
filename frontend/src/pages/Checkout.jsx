import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51234567890abcdefghijk');

function CheckoutForm({ cartTotal, onPaymentSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Create payment method
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });

            if (stripeError) {
                setError(stripeError.message);
                setLoading(false);
                return;
            }

            // In a real app, send paymentMethod.id to your backend
            console.log('Payment successful:', paymentMethod);

            // Simulate successful payment
            setTimeout(() => {
                setLoading(false);
                onPaymentSuccess();
            }, 2000);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition duration-300"
            >
                {loading ? 'Processing Payment...' : `Pay $${cartTotal}`}
            </button>
        </form>
    );
}

function CheckoutContent() {
    const navigate = useNavigate();
    const { cart, clearCart, getCartTotal } = useCart();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
    });
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const cartTotal = getCartTotal();
    const taxAmount = cartTotal * 0.1;
    const finalTotal = cartTotal + taxAmount;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePaymentSuccess = () => {
        setPaymentSuccess(true);
        clearCart();

        // Simulate order creation
        const order = {
            orderId: `ORD-${Date.now()}`,
            items: cart,
            total: finalTotal,
            customer: formData,
            timestamp: new Date().toISOString(),
        };

        localStorage.setItem('lastOrder', JSON.stringify(order));

        setTimeout(() => {
            navigate('/order-confirmation');
        }, 2000);
    };

    if (paymentSuccess) {
        return (
            <div className="text-center py-12">
                <p className="text-green-600 text-xl mb-4">✓ Payment successful!</p>
                <p className="text-gray-600">Redirecting to order confirmation...</p>
            </div>
        );
    }

    if (cart.length === 0 && !paymentSuccess) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600 text-xl mb-6">Your cart is empty</p>
                <Link
                    to="/products"
                    className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                    {/* Shipping Information */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Shipping Information</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                required
                            />
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        />

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        />

                        <input
                            type="text"
                            name="address"
                            placeholder="Street Address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        />

                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                required
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                required
                            />
                            <input
                                type="text"
                                name="zipCode"
                                placeholder="ZIP Code"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment Information</h2>
                        <CheckoutForm cartTotal={finalTotal} onPaymentSuccess={handlePaymentSuccess} />
                    </div>
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-amber-500">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Calculations */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax (10%):</span>
                        <span>${taxAmount.toFixed(2)}</span>
                    </div>
                </div>

                {/* Total */}
                <div className="mb-6">
                    <div className="flex justify-between text-2xl font-bold text-amber-500">
                        <span>Total:</span>
                        <span>${finalTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Back to Cart */}
                <Link
                    to="/cart"
                    className="block w-full text-center text-amber-500 hover:text-amber-600 font-semibold py-2 transition"
                >
                    ← Back to Cart
                </Link>
            </div>
        </div>
    );
}

function Checkout() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-8">Checkout</h1>

            <Elements stripe={stripePromise}>
                <CheckoutContent />
            </Elements>
        </main>
    );
}

export default Checkout;
