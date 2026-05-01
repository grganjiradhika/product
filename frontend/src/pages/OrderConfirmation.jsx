import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function OrderConfirmation() {
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const lastOrder = localStorage.getItem('lastOrder');
        if (lastOrder) {
            setOrder(JSON.parse(lastOrder));
        }
    }, []);

    if (!order) {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <p className="text-gray-600 text-xl">No order found</p>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Success Header */}
                <div className="bg-green-500 text-white text-center py-12">
                    <h1 className="text-5xl mb-4">✓</h1>
                    <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
                    <p className="text-green-100">Thank you for your purchase</p>
                </div>

                {/* Order Details */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
                        {/* Order Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Information</h2>
                            <div className="space-y-3 text-gray-700">
                                <div>
                                    <p className="font-semibold text-slate-900">Order ID:</p>
                                    <p className="text-amber-600 font-mono">{order.orderId}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">Order Date:</p>
                                    <p>{new Date(order.timestamp).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">Status:</p>
                                    <p className="text-green-600 font-semibold">Confirmed & Processing</p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Shipping To</h2>
                            <div className="space-y-1 text-gray-700">
                                <p className="font-semibold">{order.customer.firstName} {order.customer.lastName}</p>
                                <p>{order.customer.address}</p>
                                <p>{order.customer.city}, {order.customer.state} {order.customer.zipCode}</p>
                                <p className="pt-2 text-sm">
                                    <span className="font-semibold">Email:</span> {order.customer.email}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">Phone:</span> {order.customer.phone}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Items</h2>
                        <div className="space-y-3">
                            {order.items.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl">{item.image}</span>
                                        <div>
                                            <p className="font-bold text-slate-900">{item.name}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-amber-500">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <div className="flex justify-between text-2xl font-bold text-amber-500">
                            <span>Total Amount Paid:</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-3">What's Next?</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li>✓ Order confirmation email has been sent to {order.customer.email}</li>
                            <li>✓ Your order is being prepared for shipment</li>
                            <li>✓ You will receive tracking information within 24 hours</li>
                            <li>✓ Expected delivery: 3-5 business days</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/products"
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            to="/"
                            className="border-2 border-slate-900 text-slate-900 hover:bg-slate-50 font-bold py-3 px-8 rounded-lg transition duration-300"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Questions</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-slate-900 mb-2">Can I modify my order?</h3>
                        <p className="text-gray-600">Orders can be modified within 1 hour of placement. Please contact support immediately if you need changes.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 mb-2">How do I track my order?</h3>
                        <p className="text-gray-600">Tracking information will be sent to your email once your order ships.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 mb-2">What's your return policy?</h3>
                        <p className="text-gray-600">We offer 30-day returns for most items. Check your order confirmation email for return instructions.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default OrderConfirmation;
