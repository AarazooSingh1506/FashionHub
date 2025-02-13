// Product data
const products = [
    {
        id: 1,
        name: "Classic White Sneakers",
        brand: "UrbanStyle",
        price: 2999,
        originalPrice: 4999,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
        description: "Minimalist everyday sneakers perfect for any occasion"
    },
    {
        id: 2,
        name: "Denim Jacket",
        brand: "StreetWear",
        price: 3499,
        originalPrice: 5999,
        image: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6",
        description: "Classic denim jacket with modern details"
    },
    {
        id: 3,
        name: "Summer Dress",
        brand: "Elegance",
        price: 1999,
        originalPrice: 3499,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
        description: "Light and breezy summer dress"
    },
    {
        id: 4,
        name: "Leather Backpack",
        brand: "TravelPro",
        price: 4999,
        originalPrice: 7999,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
        description: "Durable leather backpack with multiple compartments"
    }
];

// Cart and wishlist state
let cart = [];
let wishlist = [];
let recentlyViewed = [];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements
    const cartIcon = document.getElementById('cartIcon');
    const wishlistIcon = document.getElementById('wishlistIcon');
    const cartModal = document.getElementById('cartModal');
    const wishlistModal = document.getElementById('wishlistModal');
    const closeCart = document.getElementById('closeCart');
    const closeWishlist = document.getElementById('closeWishlist');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const searchInput = document.getElementById('searchInput');
    const trendingProducts = document.getElementById('trendingProducts');
    const recentlyViewedContainer = document.getElementById('recentlyViewed');
    const quickViewModal = document.getElementById('quickViewModal');
    const closeQuickView = document.getElementById('closeQuickView');

    // Render initial products
    renderProducts(products, trendingProducts);
    updateCart();
    updateWishlist();

    // Event Listeners
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('active');
    });

    wishlistIcon.addEventListener('click', () => {
        wishlistModal.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    closeWishlist.addEventListener('click', () => {
        wishlistModal.classList.remove('active');
    });

    closeQuickView.addEventListener('click', () => {
        quickViewModal.classList.remove('active');
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Thank you for your purchase!');
        cart = [];
        updateCart();
        cartModal.classList.remove('active');
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts, trendingProducts);
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
        if (e.target === wishlistModal) {
            wishlistModal.classList.remove('active');
        }
        if (e.target === quickViewModal) {
            quickViewModal.classList.remove('active');
        }
    });
});

// Render products
function renderProducts(productsToRender, container) {
    container.innerHTML = productsToRender.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="current-price">₹${product.price}</span>
                    <span class="original-price">₹${product.originalPrice}</span>
                    <span class="discount">${Math.round((1 - product.price/product.originalPrice) * 100)}% OFF</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

// Add to wishlist
function addToWishlist(productId) {
    if (!wishlist.find(item => item.id === productId)) {
        const product = products.find(p => p.id === productId);
        wishlist.push(product);
        updateWishlist();
    }
}

// View product
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    
    // Add to recently viewed
    if (!recentlyViewed.find(item => item.id === productId)) {
        recentlyViewed.unshift(product);
        if (recentlyViewed.length > 4) {
            recentlyViewed.pop();
        }
        renderProducts(recentlyViewed, document.getElementById('recentlyViewed'));
    }

    // Show quick view modal
    const quickViewModal = document.getElementById('quickViewModal');
    const quickViewDetails = document.getElementById('quickViewDetails');
    
    quickViewDetails.innerHTML = `
        <div class="quick-view-grid">
            <img src="${product.image}" alt="${product.name}" class="quick-view-image">
            <div class="quick-view-info">
                <h2>${product.brand}</h2>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="current-price">₹${product.price}</span>
                    <span class="original-price">₹${product.originalPrice}</span>
                    <span class="discount">${Math.round((1 - product.price/product.originalPrice) * 100)}% OFF</span>
                </div>
                <div class="quick-view-actions">
                    <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                        <i class="fa-solid fa-shopping-bag"></i> ADD TO BAG
                    </button>
                    <button onclick="addToWishlist(${product.id})" class="wishlist-btn">
                        <i class="fa-solid fa-heart"></i> WISHLIST
                    </button>
                </div>
            </div>
        </div>
    `;
    
    quickViewModal.classList.add('active');
}

// Update cart display
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-brand">${item.brand}</div>
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-item">&times;</button>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = total.toFixed(2);
}

// Update wishlist display
function updateWishlist() {
    const wishlistCount = document.getElementById('wishlistCount');
    const wishlistItems = document.getElementById('wishlistItems');

    wishlistCount.textContent = wishlist.length;

    wishlistItems.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
            <div class="wishlist-item-details">
                <div class="wishlist-item-brand">${item.brand}</div>
                <div class="wishlist-item-name">${item.name}</div>
                <div class="wishlist-item-price">₹${item.price}</div>
                <button onclick="moveToCart(${item.id})" class="move-to-cart">
                    <i class="fa-solid fa-shopping-bag"></i> MOVE TO BAG
                </button>
            </div>
            <button onclick="removeFromWishlist(${item.id})" class="remove-item">&times;</button>
        </div>
    `).join('');
}

// Update quantity
function updateQuantity(productId, delta) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = Math.max(1, cartItem.quantity + delta);
        updateCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Remove from wishlist
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    updateWishlist();
}

// Move to cart from wishlist
function moveToCart(productId) {
    addToCart(productId);
    removeFromWishlist(productId);
}