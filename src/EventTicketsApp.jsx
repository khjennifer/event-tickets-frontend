import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, ChevronRight, Loader, Heart, Share2, X } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export default function EventTicketsApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/events`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setLoading(false);
  };

  const filteredEvents = events.filter(event =>
    event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (eventId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(eventId)) {
      newFavorites.delete(eventId);
    } else {
      newFavorites.add(eventId);
    }
    setFavorites(newFavorites);
  };

  const handleAddToCart = (event, quantity) => {
    const newItem = { event, quantity, id: Date.now() };
    setCart([...cart, newItem]);
  };

  const handleCheckout = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const orderData = {
        userId: user.id,
        items: cart.map(item => ({
          eventId: item.event.id,
          quantity: item.quantity,
          price: item.event.price
        }))
      };

      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        alert('Order placed successfully!');
        setCart([]);
        setCurrentPage('home');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
          >
            TicketVue
          </button>
          
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search events, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative px-4 py-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-600 transition-colors"
            >
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => user ? setUser(null) : setShowAuthModal(true)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              {user ? `${user.name}` : 'Sign In'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentPage === 'home' && (
          <>
            {/* Hero Section */}
            <div className="mb-16 text-center">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold border border-emerald-500/30">
                  Discover Amazing Events
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Your Next Unforgettable
                <span className="block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Experience Awaits
                </span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Browse, discover, and book tickets to the most exciting events in your city
              </p>
            </div>

            {/* Events Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="animate-spin text-emerald-400" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <p className="text-slate-400 text-lg">No events found. Try adjusting your search.</p>
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="group cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(event);
                        setCurrentPage('event-detail');
                      }}
                    >
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 hover:border-emerald-400/50 transition-all duration-300">
                        {/* Event Image */}
                        <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-blue-500/20 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                            📸 Event Image
                          </div>
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(event.id);
                          }}
                          className="absolute top-3 right-3 p-2 bg-slate-900/80 backdrop-blur rounded-full hover:bg-emerald-500 transition-colors"
                        >
                          <Heart
                            size={18}
                            className={favorites.has(event.id) ? 'fill-emerald-400 text-emerald-400' : 'text-white'}
                          />
                        </button>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                              {event.name}
                            </h3>
                          </div>

                          <div className="space-y-2 mb-4 text-sm text-slate-300">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-emerald-400" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-emerald-400" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-emerald-400" />
                              <span>{event.availableTickets} tickets left</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                            <span className="text-2xl font-bold text-emerald-400">
                              ${event.price}
                            </span>
                            <button className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-all">
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {currentPage === 'event-detail' && selectedEvent && (
          <EventDetailPage
            event={selectedEvent}
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentPage('home')}
            isFavorite={favorites.has(selectedEvent.id)}
            onToggleFavorite={() => toggleFavorite(selectedEvent.id)}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            cart={cart}
            onCheckout={handleCheckout}
            onRemove={(id) => setCart(cart.filter(item => item.id !== id))}
            onBack={() => setCurrentPage('home')}
            isLoggedIn={!!user}
          />
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuth={(userData) => {
            setUser(userData);
            setShowAuthModal(false);
          }}
        />
      )}
    </div>
  );
}

function EventDetailPage({ event, onAddToCart, onBack, isFavorite, onToggleFavorite }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(event, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ChevronRight className="rotate-180" size={20} />
        Back to Events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl overflow-hidden border border-slate-700 mb-8">
            <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-blue-500/20 relative">
              <div className="absolute inset-0 flex items-center justify-center text-5xl">📸</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{event.name}</h1>
              <div className="flex items-center gap-4 text-slate-300">
                <span className="flex items-center gap-1">
                  <Calendar size={18} className="text-emerald-400" />
                  {new Date(event.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={18} className="text-emerald-400" />
                  {event.location}
                </span>
              </div>
            </div>

            <div className="p-6 bg-slate-700/50 rounded-lg border border-slate-600">
              <h2 className="text-xl font-bold text-white mb-3">About This Event</h2>
              <p className="text-slate-300 leading-relaxed">
                {event.description || 'Join us for an unforgettable experience. This event promises entertainment, excitement, and memories that will last a lifetime.'}
              </p>
            </div>

            <div className="p-6 bg-slate-700/50 rounded-lg border border-slate-600">
              <h2 className="text-xl font-bold text-white mb-3">Event Details</h2>
              <div className="space-y-2 text-slate-300">
                <p><span className="text-emerald-400">Type:</span> {event.category || 'Entertainment'}</p>
                <p><span className="text-emerald-400">Venue:</span> {event.location}</p>
                <p><span className="text-emerald-400">Tickets Available:</span> {event.availableTickets}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl border border-slate-700 space-y-6">
            <div>
              <p className="text-slate-400 text-sm mb-2">Price per ticket</p>
              <p className="text-4xl font-bold text-emerald-400">${event.price}</p>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-bold transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-600/50 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Total</p>
              <p className="text-3xl font-bold text-emerald-400">${event.price * quantity}</p>
            </div>

            <button
              onClick={handleAdd}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                added
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>

            <button
              onClick={onToggleFavorite}
              className="w-full py-3 rounded-lg font-bold border border-slate-600 text-white hover:border-emerald-400 hover:text-emerald-400 transition-colors flex items-center justify-center gap-2"
            >
              <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
              {isFavorite ? 'Saved' : 'Save Event'}
            </button>

            <button className="w-full py-3 rounded-lg font-bold border border-slate-600 text-white hover:border-blue-400 hover:text-blue-400 transition-colors flex items-center justify-center gap-2">
              <Share2 size={18} />
              Share
            </button>

            {event.availableTickets <= 5 && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-orange-400 font-semibold text-sm">Only {event.availableTickets} tickets left!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage({ cart, onCheckout, onRemove, onBack, isLoggedIn }) {
  const total = cart.reduce((sum, item) => sum + item.event.price * item.quantity, 0);

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ChevronRight className="rotate-180" size={20} />
        Continue Shopping
      </button>

      <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-slate-400 mb-4">Your cart is empty</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="p-6 bg-slate-700/50 rounded-lg border border-slate-600 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.event.name}</h3>
                  <p className="text-slate-400 mb-3">Quantity: {item.quantity}</p>
                  <p className="text-emerald-400 font-semibold">
                    ${item.event.price} × {item.quantity} = ${item.event.price * item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl border border-slate-700 space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-3 pb-4 border-b border-slate-600">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Fees</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <span className="text-white font-bold">Total</span>
                <span className="text-3xl font-bold text-emerald-400">
                  ${(total * 1.1).toFixed(2)}
                </span>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-3 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors mt-6"
              >
                {isLoggedIn ? 'Proceed to Payment' : 'Sign In to Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthModal({ onClose, onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth({
      id: Date.now(),
      email: formData.email,
      name: formData.name || formData.email.split('@')[0]
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}