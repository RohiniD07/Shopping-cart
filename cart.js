// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart saved to localStorage:', cart);
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

// Function to add item to cart
window.addToCart = function(event) {
    console.log('addToCart called');
    const productElement = event.target.closest('.col-md-4');
    if (!productElement) {
        console.error('Product element not found');
        return;
    }
    const price = parseFloat(productElement.dataset.productPrice) || 0;
    if (price <= 0) {
        console.error(`Invalid price for ${productElement.dataset.productName}`);
        return;
    }
    const product = {
        id: productElement.dataset.productId,
        name: productElement.dataset.productName,
        price: price,
        quantity: 1
    };

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }

    saveCart();
    window.updateCartDisplay();
    alert(`${product.name} added to cart!`);
};

// Function to handle "Buy Now"
window.buyNow = function(event) {
    console.log('buyNow called');
    try {
        window.addToCart(event);
        console.log('Redirecting to checkout.html');
        window.location.href = 'checkout.html';
    } catch (error) {
        console.error('Error in buyNow:', error);
        alert('Failed to navigate to cart page. Please try again.');
    }
};

// Function to update cart display
window.updateCartDisplay = function() {
    console.log('updateCartDisplay called, cart:', cart);
    const cartItemCountElements = document.querySelectorAll('#cart-item-count');
    const cartItemsElement = document.querySelector('#cart-items');
    const cartTotalElement = document.querySelector('#cart-total');

    // Update cart item count in navbar
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCountElements.forEach(element => {
        element.textContent = totalItems;
    });

    // Update cart items on checkout page
    if (cartItemsElement && cartTotalElement) {
        try {
            cartItemsElement.innerHTML = '';
            let total = 0;

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                if (!isNaN(itemTotal)) {
                    total += itemTotal;
                }
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    ${item.name} (Qty: ${item.quantity}) - $${itemTotal.toFixed(2)}
                    <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
                `;
                cartItemsElement.appendChild(li);
            });

            cartTotalElement.textContent = isNaN(total) ? '0.00' : total.toFixed(2);
            console.log('Cart display updated, total:', total);
        } catch (error) {
            console.error('Error updating cart display:', error);
        }

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                console.log('Remove item clicked, index:', e.target.dataset.index);
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                saveCart();
                window.updateCartDisplay();
            });
        });
    } else if (cartItemsElement || cartTotalElement) {
        console.warn('Missing cart-items or cart-total element on this page');
    }
};

// Attach event listeners to buttons
document.addEventListener('DOMContentLoaded', () => {
    console.log('Attaching event listeners');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const buyNowButtons = document.querySelectorAll('.buy-now-btn');
    if (addToCartButtons.length === 0 && buyNowButtons.length === 0) {
        console.warn('No add-to-cart-btn or buy-now-btn elements found on this page');
    }
    addToCartButtons.forEach(button => {
        button.addEventListener('click', window.addToCart);
    });
    buyNowButtons.forEach(button => {
        button.addEventListener('click', window.buyNow);
    });
    window.updateCartDisplay();
});
