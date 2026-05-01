import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

function Header() {
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;

  return (
    <header className="bg-linear-to-r from-slate-900 to-slate-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-amber-500">🛍️ MyStore</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="text-gray-300 hover:text-amber-500 font-medium transition duration-300">
              Home
            </Link>
            <Link to="/products" className="text-gray-300 hover:text-amber-500 font-medium transition duration-300">
              Products
            </Link>
            <Link to="/login" className="text-gray-300 hover:text-amber-500 font-medium transition duration-300">
              Login
            </Link>
          </nav>

          {/* Cart & Wishlist Icons */}
          <div className="flex items-center gap-6">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative text-gray-300 hover:text-red-500 transition duration-300 text-xl"
              title="Wishlist"
            >
              ♥
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-gray-300 hover:text-amber-500 transition duration-300 text-2xl"
              title="Shopping Cart"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;