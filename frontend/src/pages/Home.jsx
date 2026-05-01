import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

function Home() {
  const featuredProducts = [
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
      id: 5,
      name: "Mechanical Keyboard",
      price: 159.99,
      rating: 4.8,
      reviews: 512,
      image: "⌨️",
      description: "RGB mechanical keyboard with custom switches and aluminum frame",
      inStock: true,
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-slate-900 to-slate-800 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to MyStore</h1>
          <p className="text-xl text-gray-300 mb-8">Discover premium tech products at unbeatable prices</p>
          <Link
            to="/products"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-slate-900 mb-2">Featured Products</h2>
        <p className="text-gray-600 mb-12">Check out our best-selling items</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-12">Why Shop With Us?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">On all orders over $50</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">💯</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">30-day money-back guarantee</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your payment is encrypted and safe</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-500 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 text-amber-100">Browse our full collection of premium tech products</p>
          <Link
            to="/products"
            className="inline-block bg-white hover:bg-gray-100 text-amber-600 font-bold py-3 px-8 rounded-lg transition duration-300"
          >
            Explore Products
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;