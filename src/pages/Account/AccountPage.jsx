import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import MainNavbar from '../../components/layout/MainNavbar';
import SubNavbar from '../../components/layout/SubNavbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, addAddress, updateAddress, deleteAddress, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');

  // Address modal states
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: '',
    lineOne: '',
    lineTwo: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If not logged in, show access prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col font-poppins bg-[#fdfbf6] text-gray-800">
        <header className="relative z-50 flex flex-col w-full bg-[#fdfbf6]">
          <MainNavbar />
          <SubNavbar />
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center text-3xl mb-4">
            <Icon icon="solar:user-bold" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Please sign in to access your profile, saved addresses, and print orders.
          </p>
          <Link
            to="/login"
            className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-semibold py-3 rounded-xl transition-colors shadow-xs"
          >
            Sign In Now
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      error('Name cannot be empty');
      return;
    }
    try {
      await updateProfile({ name: profileName.trim() });
      success('Profile updated successfully');
      setIsEditingProfile(false);
    } catch (err) {
      error(err.message || 'Failed to update profile');
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      label: 'Home',
      lineOne: '',
      lineTwo: '',
      city: '',
      district: '',
      state: 'Tamil Nadu',
      pincode: '',
      country: 'India',
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      label: addr.label || 'Home',
      lineOne: addr.lineOne || '',
      lineTwo: addr.lineTwo || '',
      city: addr.city || '',
      district: addr.district || '',
      state: addr.state || 'Tamil Nadu',
      pincode: addr.pincode || '',
      country: addr.country || 'India',
    });
    setIsAddressModalOpen(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressForm.label || !addressForm.lineOne || !addressForm.city || !addressForm.pincode) {
      error('Please fill in all required address fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAddressId) {
        await updateAddress({
          addressId: editingAddressId,
          ...addressForm,
        });
        success('Address updated successfully');
      } else {
        await addAddress(addressForm);
        success('New address added successfully');
      }
      setIsAddressModalOpen(false);
    } catch (err) {
      error(err.message || 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteAddress(addrId);
      success('Address removed');
    } catch (err) {
      error(err.message || 'Failed to delete address');
    }
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
        <span className="text-gray-900 font-medium">Customer Dashboard</span>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Profile Card & Tabs Navigation (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs text-center">
              <div className="w-20 h-20 rounded-full bg-[#110C0B] text-yellow-400 font-black text-3xl mx-auto flex items-center justify-center shadow-md mb-4">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>

              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full capitalize">
                  Account: {user?.status || 'Active'}
                </span>
                {user?.mobileNo && (
                  <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    +{user?.countryCode || '91'} {user?.mobileNo}
                  </span>
                )}
              </div>

              {/* Navigation Tabs */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-1.5 text-left">
                {[
                  { id: 'profile', label: 'Profile Information', icon: 'solar:user-linear' },
                  { id: 'addresses', label: 'Saved Shipping Addresses', icon: 'solar:map-point-linear' },
                  { id: 'orders', label: 'Order History', icon: 'solar:box-linear' },
                  { id: 'wishlist', label: 'My Saved Wishlist', icon: 'solar:heart-linear' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#110C0B] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon icon={tab.icon} className="text-lg" />
                    <span>{tab.label}</span>
                  </button>
                ))}

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left mt-4"
                >
                  <Icon icon="solar:logout-2-linear" className="text-lg" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Tab Content (8 cols on lg) */}
          <div className="lg:col-span-8">
            {/* Tab 1: Profile Details */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
                    <p className="text-xs text-gray-500">Manage your personal customer account details</p>
                  </div>
                  {!isEditingProfile ? (
                    <button
                      onClick={() => {
                        setProfileName(user?.name || '');
                        setIsEditingProfile(true);
                      }}
                      className="px-4 py-2 bg-yellow-100 text-yellow-900 hover:bg-yellow-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Icon icon="solar:pen-linear" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="text-xs font-semibold text-gray-500 hover:text-black cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Email (Primary ID)</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full border border-gray-100 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#110C0B] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-black transition-colors cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 font-medium block">Full Name</span>
                      <span className="text-sm font-bold text-gray-900 mt-1 block">{user?.name}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 font-medium block">Email Address</span>
                      <span className="text-sm font-bold text-gray-900 mt-1 block">{user?.email}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 font-medium block">Mobile Phone</span>
                      <span className="text-sm font-bold text-gray-900 mt-1 block">
                        {user?.mobileNo ? `+${user?.countryCode || '91'} ${user?.mobileNo}` : 'Not provided'}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 font-medium block">Member Since</span>
                      <span className="text-sm font-bold text-gray-900 mt-1 block">
                        {formatDate(user?.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Saved Shipping Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Saved Shipping Addresses</h2>
                    <p className="text-xs text-gray-500">Delivery addresses used for print order shipments</p>
                  </div>
                  <button
                    onClick={handleOpenAddAddress}
                    className="px-4 py-2 bg-[#ffcc00] hover:bg-[#e6b800] text-black rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  >
                    <Icon icon="solar:add-circle-bold" className="text-base" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {!user?.addresses || user.addresses.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                    <Icon icon="solar:map-point-wave-bold" className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-900">No saved addresses</p>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto mb-4">
                      Add a shipping address so you can checkout print orders with 1-click.
                    </p>
                    <button
                      onClick={handleOpenAddAddress}
                      className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-xl"
                    >
                      Add Address Now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className="p-5 rounded-2xl border border-gray-200 bg-white shadow-xs flex flex-col justify-between hover:border-yellow-400 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-yellow-800 bg-yellow-100 px-2.5 py-0.5 rounded-full">
                              {addr.label}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditAddress(addr)}
                                className="p-1 text-gray-400 hover:text-black cursor-pointer"
                                title="Edit"
                              >
                                <Icon icon="solar:pen-linear" />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(addr._id)}
                                className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                                title="Delete"
                              >
                                <Icon icon="solar:trash-bin-trash-linear" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{addr.lineOne}</p>
                          {addr.lineTwo && <p className="text-xs text-gray-600">{addr.lineTwo}</p>}
                          <p className="text-xs text-gray-600 mt-1">
                            {addr.city}, {addr.district || addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">{addr.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Order History */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Order History</h2>
                  <p className="text-xs text-gray-500">Track and view your current and past print orders</p>
                </div>

                <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
                  <Icon icon="solar:bag-3-linear" className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-900">No print orders placed yet</p>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto mb-4">
                    Your previous customized print jobs and proofs will appear here.
                  </p>
                  <Link
                    to="/products"
                    className="inline-block bg-[#110C0B] text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-black transition-colors"
                  >
                    Start an Order
                  </Link>
                </div>
              </div>
            )}

            {/* Tab 4: Wishlist Shortcut */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">My Saved Wishlist</h2>
                    <p className="text-xs text-gray-500">{wishlistItems.length} items saved for later</p>
                  </div>
                  <Link
                    to="/wishlist"
                    className="text-xs font-semibold text-yellow-800 hover:underline"
                  >
                    View Full Wishlist Page &rarr;
                  </Link>
                </div>

                {wishlistItems.length === 0 ? (
                  <p className="text-sm text-gray-500 py-6 text-center">Your wishlist is currently empty.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wishlistItems.slice(0, 6).map((item) => (
                      <Link
                        key={item._id}
                        to={`/product/${item.slug}`}
                        className="p-3 border border-gray-100 rounded-xl hover:border-black transition-all flex flex-col group"
                      >
                        <img
                          src={item.image || item.images?.[0]?.url}
                          alt={item.name}
                          className="w-full aspect-square object-cover rounded-lg bg-gray-50 mb-2"
                        />
                        <p className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-yellow-700">
                          {item.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Address Add/Edit Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                {editingAddressId ? 'Edit Shipping Address' : 'Add New Shipping Address'}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-gray-400 hover:text-black p-1 cursor-pointer"
              >
                <Icon icon="lucide:x" className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Address Label (e.g. Home, Office, Factory) *
                </label>
                <input
                  type="text"
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  placeholder="Home"
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Address Line 1 (Flat, House No, Building) *
                </label>
                <input
                  type="text"
                  value={addressForm.lineOne}
                  onChange={(e) => setAddressForm({ ...addressForm, lineOne: e.target.value })}
                  placeholder="No. 12, Sunrise Residency"
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Address Line 2 (Street, Area, Landmark)
                </label>
                <input
                  type="text"
                  value={addressForm.lineTwo}
                  onChange={(e) => setAddressForm({ ...addressForm, lineTwo: e.target.value })}
                  placeholder="Near Anna Nagar Metro"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="Chennai"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">District</label>
                  <input
                    type="text"
                    value={addressForm.district}
                    onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                    placeholder="Chennai"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="Tamil Nadu"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    placeholder="600001"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#110C0B] hover:bg-black text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Address'}
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

export default AccountPage;
