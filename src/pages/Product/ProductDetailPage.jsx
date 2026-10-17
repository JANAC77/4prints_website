import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AiFillStar } from 'react-icons/ai';
import MainNavbar from '../../components/layout/MainNavbar';
import SubNavbar from '../../components/layout/SubNavbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/common/ProductCard';
import { productApi } from '../../api/product.api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, getDisplayImageUrl } from '../../utils/formatters';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, calculatePrice } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error: toastError } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(100);
  const [customQuantity, setCustomQuantity] = useState('');
  const [selectedVariants, setSelectedVariants] = useState({});
  const [designFile, setDesignFile] = useState(null);
  const [designNotes, setDesignNotes] = useState('');
  const [activeTab, setActiveTab] = useState('highlights');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    productApi
      .getBySlug(slug)
      .then((data) => {
        setProduct(data);
        if (data.pricing && data.pricing.length > 0) {
          setSelectedQuantity(data.pricing[0].quantity);
        } else {
          setSelectedQuantity(data.minimumOrder || 1);
        }

        // Initialize default variants
        if (data.variants && data.variants.length > 0) {
          const defaults = {};
          data.variants.forEach((v) => {
            if (v.values && v.values.length > 0) {
              defaults[v.name] = v.values[0].value;
            }
          });
          setSelectedVariants(defaults);
        }

        // Fetch related products
        productApi.list({ limit: 4 }).then((res) => {
          if (res?.products) {
            setRelatedProducts(res.products.filter((p) => p.slug !== slug).slice(0, 4));
          }
        });
      })
      .catch((err) => {
        toastError('Failed to load product details');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-poppins bg-[#fdfbf6]">
        <header className="relative z-50 flex flex-col w-full bg-[#fdfbf6]">
          <MainNavbar />
          <SubNavbar />
        </header>
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Icon icon="svg-spinners:180-ring-with-bg" className="text-4xl text-yellow-500" />
            <p className="text-sm font-medium text-gray-500">Loading product information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col font-poppins bg-[#fdfbf6]">
        <header className="relative z-50 flex flex-col w-full bg-[#fdfbf6]">
          <MainNavbar />
          <SubNavbar />
        </header>
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">The product you are looking for does not exist or is inactive.</p>
          <Link
            to="/products"
            className="bg-[#110C0B] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-black transition-colors"
          >
            Explore All Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const effectiveQty = customQuantity ? parseInt(customQuantity) || product.minimumOrder || 1 : selectedQuantity;
  const { unitPrice, totalPrice } = calculatePrice(product, effectiveQty);
  const inWishlist = isInWishlist(product._id);

  const handleVariantChange = (variantName, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDesignFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type,
      });
      success(`Design file "${file.name}" uploaded successfully`);
    }
  };

  const handleAddToCart = () => {
    if (effectiveQty < (product.minimumOrder || 1)) {
      toastError(`Minimum order quantity is ${product.minimumOrder || 1}`);
      return;
    }

    addToCart(product, effectiveQty, selectedVariants, {
      uploadedFile: designFile,
      notes: designNotes,
    });
    success(`Added ${effectiveQty} items of "${product.name}" to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="min-h-screen flex flex-col font-poppins bg-[#fdfbf6] text-gray-800">
      <header className="relative z-50 flex flex-col w-full bg-[#fdfbf6]">
        <MainNavbar />
        <SubNavbar />
      </header>

      {/* Breadcrumb Navigation */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-xs text-gray-500 flex items-center gap-2">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-black transition-colors">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-2">
          {/* Left Column: Image Gallery (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Main Image Display */}
            <div className="relative aspect-square w-full rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden group">
              <img
                src={getDisplayImageUrl(product.images?.[selectedImageIndex]?.url)}
                alt={product.images?.[selectedImageIndex]?.alt || product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer z-10 ${
                  inWishlist
                    ? 'bg-red-50 text-red-500 hover:bg-red-100'
                    : 'bg-white/90 text-gray-700 hover:text-red-500 hover:bg-white'
                }`}
                title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Icon
                  icon={inWishlist ? 'solar:heart-bold' : 'mingcute:heart-line'}
                  className="text-xl"
                />
              </button>

              {/* Status Badge */}
              {product.status?.bestSeller && (
                <span className="absolute top-4 left-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  Best Seller
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-yellow-400 ring-2 ring-yellow-400/30'
                        : 'border-transparent bg-white hover:border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getDisplayImageUrl(img.url)}
                      alt={img.alt || `Product thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Configuration & Purchase Details (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Title & SKU */}
            <div className="border-b border-gray-100 pb-4 mb-5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-yellow-800 bg-yellow-100/70 px-2.5 py-0.5 rounded-full">
                  SKU: {product.sku}
                </span>
                {product.status?.newArrival && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    New Arrival
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2.5 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center text-yellow-500">
                  <AiFillStar className="text-base" />
                  <span className="ml-1 font-bold text-gray-900">
                    {typeof product.rating?.average === 'number' ? product.rating.average : 4.8}
                  </span>
                </div>
                <span>•</span>
                <span>
                  {typeof product.rating?.totalReviews === 'number' ? product.rating.totalReviews : 0} verified reviews
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">In Stock & Ready to Print</span>
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Pricing Summary Box */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs mb-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider block font-medium">
                    Estimated Price ({effectiveQty} units)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      {formatCurrency(totalPrice)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({formatCurrency(unitPrice)} / unit)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                    Min. Order: {product.minimumOrder || 1} units
                  </span>
                </div>
              </div>

              {/* Quantity Tiers Selector */}
              {product.pricing && product.pricing.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    Select Quantity Tier (Bigger savings on bulk orders):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {product.pricing.map((tier) => {
                      const isSelected = selectedQuantity === tier.quantity && !customQuantity;
                      return (
                        <button
                          key={tier.quantity}
                          type="button"
                          onClick={() => {
                            setSelectedQuantity(tier.quantity);
                            setCustomQuantity('');
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#110C0B] bg-[#110C0B] text-white shadow-xs'
                              : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 text-gray-800'
                          }`}
                        >
                          <div className="text-sm font-bold">{tier.quantity} pcs</div>
                          <div className={`text-xs ${isSelected ? 'text-yellow-400' : 'text-gray-900 font-semibold'}`}>
                            {formatCurrency(tier.price)}
                          </div>
                          {tier.discount > 0 && (
                            <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-gray-300' : 'text-emerald-600 font-medium'}`}>
                              Save {tier.discount}%
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Variants Selectors */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 mb-6">
                {product.variants.map((variant) => (
                  <div key={variant.name} className="bg-white p-4 rounded-xl border border-gray-100">
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                      {variant.name}:{' '}
                      <span className="font-normal text-yellow-800 lowercase">
                        {selectedVariants[variant.name] || 'Select'}
                      </span>
                    </label>

                    {/* Color Swatches */}
                    {variant.type === 'color' ? (
                      <div className="flex flex-wrap gap-2.5">
                        {variant.values.map((val) => {
                          const isSelected = selectedVariants[variant.name] === val.value;
                          return (
                            <button
                              key={val.value}
                              type="button"
                              onClick={() => handleVariantChange(variant.name, val.value)}
                              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                                isSelected ? 'border-black ring-2 ring-yellow-400' : 'border-gray-200'
                              }`}
                              style={{ backgroundColor: val.value }}
                              title={val.label}
                            >
                              {isSelected && (
                                <Icon
                                  icon="lucide:check"
                                  className={`text-sm ${
                                    val.value.toLowerCase().includes('white') ||
                                    val.value.toLowerCase().includes('#f')
                                      ? 'text-black'
                                      : 'text-white'
                                  }`}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : variant.type === 'dropdown' ? (
                      <select
                        value={selectedVariants[variant.name] || ''}
                        onChange={(e) => handleVariantChange(variant.name, e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-black cursor-pointer"
                      >
                        {variant.values.map((val) => (
                          <option key={val.value} value={val.value}>
                            {val.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      /* Radio / Button style */
                      <div className="flex flex-wrap gap-2">
                        {variant.values.map((val) => {
                          const isSelected = selectedVariants[variant.name] === val.value;
                          return (
                            <button
                              key={val.value}
                              type="button"
                              onClick={() => handleVariantChange(variant.name, val.value)}
                              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#110C0B] text-white shadow-xs'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {val.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Design Upload Section (Backend allowDesignUpload feature) */}
            {product.allowDesignUpload && (
              <div className="bg-yellow-50/60 border border-yellow-200/80 rounded-2xl p-4 sm:p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:upload-track-2-bold" className="text-yellow-700 text-xl" />
                  <h3 className="text-sm font-bold text-gray-900">Upload Your Print Design</h3>
                </div>
                {product.designInstructions && (
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {product.designInstructions}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto bg-white border border-dashed border-gray-400 hover:border-black rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs">
                    <Icon icon="solar:paperclip-2-linear" className="text-base" />
                    <span>{designFile ? 'Change Design File' : 'Select Design File (PDF, AI, PNG)'}</span>
                    <input
                      type="file"
                      accept=".pdf,.ai,.psd,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {designFile && (
                    <div className="flex items-center gap-2 text-xs bg-white py-1.5 px-3 rounded-lg border border-gray-200 text-gray-700">
                      <Icon icon="solar:file-check-bold" className="text-green-600 text-base" />
                      <span className="font-medium truncate max-w-[160px]">{designFile.name}</span>
                      <span className="text-gray-400">({designFile.size})</span>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <input
                    type="text"
                    value={designNotes}
                    onChange={(e) => setDesignNotes(e.target.value)}
                    placeholder="Special printing notes (e.g. Pantone shade, exact positioning)..."
                    className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-yellow-500 placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-xl bg-white border-2 border-[#110C0B] text-[#110C0B] hover:bg-gray-50 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] shadow-xs"
              >
                <Icon icon="solar:cart-plus-bold" className="text-xl" />
                <span>Add to Cart</span>
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#ffcc00] hover:bg-[#e6b800] text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] shadow-xs"
              >
                <Icon icon="solar:bolt-bold" className="text-xl" />
                <span>Buy Now • {formatCurrency(totalPrice)}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide bg-gray-50/50">
            {[
              { id: 'highlights', label: 'Highlights & Overview' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'templates', label: 'Design Templates' },
              { id: 'faqs', label: 'FAQs & Support' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-6 text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#110C0B] text-gray-900 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Body */}
          <div className="p-6 sm:p-8">
            {/* Highlights Tab */}
            {activeTab === 'highlights' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {product.description || product.shortDescription}
                  </p>
                </div>

                {product.highlights && product.highlights.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Key Features & Quality Highlights</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {product.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <Icon icon="solar:check-circle-bold" className="text-yellow-600 text-lg shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4">Technical Specifications</h3>
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-sm">
                        <span className="font-semibold text-gray-700">{spec.title}</span>
                        <span className="sm:col-span-2 text-gray-600">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Standard specifications apply for this product line.</p>
                )}
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Downloadable Artwork Templates</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Use our certified bleed and margin templates to ensure your print design comes out with pixel-perfect accuracy.
                </p>
                {product.templates && product.templates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {product.templates.map((tpl, i) => (
                      <div key={i} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{tpl.title}</p>
                          <p className="text-xs text-gray-400">PDF / AI Guidelines</p>
                        </div>
                        <a
                          href={tpl.file || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-gray-100 hover:bg-yellow-200 text-gray-800 transition-colors"
                        >
                          <Icon icon="solar:download-linear" className="text-lg" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-gray-50 rounded-xl">
                    <Icon icon="solar:file-linear" className="text-3xl text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Standard bleed is 3mm. You can upload artwork directly or our team will assist you.</p>
                  </div>
                )}
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 mb-3">Frequently Asked Questions</h3>
                {(product.faqs && product.faqs.length > 0 ? product.faqs : [
                  { question: 'What is the printing and delivery timeframe?', answer: 'Standard production takes 24-48 business hours. Shipping across India typically arrives in 2-4 business days.' },
                  { question: 'Can I request a sample before a large bulk order?', answer: 'Yes! Contact support via email or place a sample order with the minimum order tier.' },
                ]).map((faq, i) => {
                  const isOpen = openFaqIndex === i;
                  return (
                    <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                        className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <Icon
                          icon="lucide:chevron-down"
                          className={`text-gray-400 text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/30">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
