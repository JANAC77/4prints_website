import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import MainNavbar from '../../components/layout/MainNavbar';
import SubNavbar from '../../components/layout/SubNavbar';
import Footer from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, getDisplayImageUrl } from '../../utils/formatters';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalItems, subtotal, gstAmount, shippingFee, grandTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, isAuthenticated, addAddress } = useAuth();
  const { success, error } = useToast();

  const [selectedAddressId, setSelectedAddressId] = useState(
    user?.addresses?.[0]?._id || null
  );
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderRefNumber, setOrderRefNumber] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Address modal in cart
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    label: 'Office',
    lineOne: '',
    lineTwo: '',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '',
    country: 'India',
  });

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddrForm.label || !newAddrForm.lineOne || !newAddrForm.pincode) {
      error('Please fill required address details');
      return;
    }
    try {
      const updatedUser = await addAddress(newAddrForm);
      const added = updatedUser?.addresses?.[updatedUser.addresses.length - 1];
      if (added) setSelectedAddressId(added._id);
      success('Shipping address added');
      setShowAddressModal(false);
    } catch (err) {
      error(err.message || 'Failed to save address');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
      return;
    }

    if (!user?.addresses || user.addresses.length === 0) {
      setShowAddressModal(true);
      return;
    }

    setIsPlacingOrder(true);
    setTimeout(() => {
      const refNo = '4P-' + Math.floor(100000 + Math.random() * 900000);
      setOrderRefNumber(refNo);
      setOrderPlaced(true);
      setIsPlacingOrder(false);
      clearCart();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col font-poppins bg-[#fdfbf6] text-gray-800">
      <header className="relative z-50 flex flex-col w-full bg-[#fdfbf6]">
        <MainNavbar />
        <SubNavbar />
      </header>

      {/* Breadcrumb */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-xs text-gray-500 flex items-center gap-2">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Shopping Cart & Checkout</span>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {orderPlaced ? (
          /* Order Confirmation Screen */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-md max-w-xl mx-auto text-center animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto mb-5">
              <Icon icon="solar:check-circle-bold" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              Thank you for ordering with 4Prints. Your print files have been queued for prepress inspection.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
              <span className="text-xs text-gray-500 block mb-1">Order Confirmation Code</span>
              <span className="text-lg font-mono font-bold text-gray-900 tracking-wider">
                {orderRefNumber}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/account"
                className="bg-[#110C0B] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black transition-colors"
              >
                View in Account
              </Link>
              <Link
                to="/products"
                className="bg-gray-100 text-gray-800 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center max-w-md mx-auto my-12 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-4xl mx-auto mb-4">
              <Icon icon="solar:cart-cross-linear" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Looks like you haven't added any customized print products to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-block bg-[#ffcc00] hover:bg-[#e6b800] text-black font-bold px-7 py-3 rounded-xl text-sm transition-colors shadow-xs"
            >
              Start Exploring Products
            </Link>
          </div>
        ) : (
          /* Cart + Checkout Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Cart Items & Delivery Address (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <h1 className="text-xl font-bold text-gray-900">
                    Shopping Cart ({totalItems} total items)
                  </h1>
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-5 flex flex-col sm:flex-row gap-4 justify-between">
                      <div className="flex gap-4">
                        <img
                          src={getDisplayImageUrl(item.image)}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                        />
                        <div className="space-y-1">
                          <Link
                            to={`/product/${item.slug}`}
                            className="text-sm sm:text-base font-bold text-gray-900 hover:text-yellow-700 transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <span className="text-[11px] text-gray-400 block font-mono">
                            SKU: {item.sku}
                          </span>

                          {/* Selected Variants */}
                          {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {Object.entries(item.selectedVariants).map(([k, v]) => (
                                <span
                                  key={k}
                                  className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md"
                                >
                                  {k}: {v}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Uploaded Artwork Badge */}
                          {item.designDetails?.uploadedFile && (
                            <div className="flex items-center gap-1.5 text-[11px] text-green-700 pt-1">
                              <Icon icon="solar:file-check-bold" />
                              <span className="font-medium truncate max-w-[200px]">
                                Artwork: {item.designDetails.uploadedFile.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Line Total */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 mt-2 sm:mt-0">
                        <div className="text-right">
                          <div className="text-base font-bold text-gray-900">
                            {formatCurrency(item.totalPrice)}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {formatCurrency(item.unitPrice)} / unit
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 50))}
                            className="px-2.5 py-1 text-gray-600 hover:text-black font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-900 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 50)}
                            className="px-2.5 py-1 text-gray-600 hover:text-black font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer pt-1"
                        >
                          <Icon icon="solar:trash-bin-trash-linear" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Shipping Address Selector */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Delivery Address</h2>
                    <p className="text-xs text-gray-500">Choose where to deliver your printed materials</p>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="text-xs font-bold text-yellow-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Icon icon="solar:add-circle-linear" className="text-base" />
                    <span>Add New</span>
                  </button>
                </div>

                {!isAuthenticated ? (
                  <div className="p-4 bg-yellow-50 rounded-2xl flex items-center justify-between">
                    <p className="text-xs text-yellow-900">
                      Sign in to select from your saved addresses or add one now.
                    </p>
                    <Link
                      to="/login?redirect=/cart"
                      className="px-4 py-1.5 bg-[#110C0B] text-white text-xs font-semibold rounded-xl"
                    >
                      Sign In
                    </Link>
                  </div>
                ) : user?.addresses && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr._id;
                      return (
                        <div
                          key={addr._id}
                          onClick={() => setSelectedAddressId(addr._id)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-yellow-400 bg-yellow-50/40 shadow-xs'
                              : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                              {addr.label}
                            </span>
                            {isSelected && (
                              <Icon icon="solar:check-circle-bold" className="text-yellow-600 text-lg" />
                            )}
                          </div>
                          <p className="text-xs text-gray-900 font-medium">{addr.lineOne}</p>
                          <p className="text-[11px] text-gray-600">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                    <p className="text-xs text-gray-600 mb-2">No addresses saved on your account yet.</p>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-xl"
                    >
                      Add Address Now
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout (4 cols on lg) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs sticky top-24 space-y-6">
                <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Standard GST (18%)</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(gstAmount)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping & Handling</span>
                    <span className="font-semibold text-gray-900">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        formatCurrency(shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">Grand Total</span>
                    <span className="text-xl font-black text-gray-900">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* Payment Option Selector */}
                <div className="pt-2 border-t border-gray-100">
                  <label className="text-xs font-bold text-gray-700 block mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'upi', label: 'UPI / QR', icon: 'solar:smartphone-bold' },
                      { id: 'card', label: 'Cards / NetBanking', icon: 'solar:card-bold' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          paymentMethod === m.id
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon icon={m.icon} />
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isPlacingOrder}
                  className="w-full py-4 rounded-2xl bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-sm sm:text-base transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isPlacingOrder ? (
                    <>
                      <Icon icon="svg-spinners:180-ring-with-bg" className="text-xl" />
                      <span>Securing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Print Order • {formatCurrency(grandTotal)}</span>
                      <Icon icon="solar:arrow-right-linear" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-gray-400 text-xs pt-1">
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:shield-check-bold" className="text-green-600 text-sm" />
                    100% Prepress Verified
                  </span>
                  <span>•</span>
                  <span>Safe Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quick Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-gray-900">Add Shipping Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <Icon icon="lucide:x" className="text-lg" />
              </button>
            </div>
            <form onSubmit={handleAddNewAddress} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Address Label</label>
                <input
                  type="text"
                  value={newAddrForm.label}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, label: e.target.value })}
                  placeholder="Home, Office, Shop"
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  value={newAddrForm.lineOne}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, lineOne: e.target.value })}
                  placeholder="Flat No, Street, Building"
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newAddrForm.city}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={newAddrForm.pincode}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, pincode: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-black"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-xl text-xs font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CartPage;
