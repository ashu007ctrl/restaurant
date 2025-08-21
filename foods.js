// DOM Elements
const header = document.querySelector('.header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const searchInput = document.querySelector('#foodsSearchInput');
const searchBtn = document.querySelector('.search-btn');
const categoryBtns = document.querySelectorAll('.category-btn');
const foodCards = document.querySelectorAll('.food-card');
const orderFoodBtns = document.querySelectorAll('.order-food-btn');

// Check for URL search parameter on page load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    
    if (searchParam) {
        // Set the search input value
        searchInput.value = searchParam;
        // Perform the search
        performFoodSearch();
        // Scroll to search results
        setTimeout(() => {
            const foodsSection = document.querySelector('.foods-section');
            if (foodsSection) {
                foodsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }
});

// Mobile Menu Toggle
mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// Search Functionality
searchBtn.addEventListener('click', () => {
    performFoodSearch();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performFoodSearch();
    }
});

function performFoodSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // Show all cards if search is empty
        foodCards.forEach(card => {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease forwards';
        });
        return;
    }
    
    // Filter food cards based on search term
    foodCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show search results message
    showFoodSearchResults(searchTerm);
}

function showFoodSearchResults(searchTerm) {
    const visibleCards = Array.from(foodCards).filter(card => 
        card.style.display !== 'none'
    );
    
    if (visibleCards.length === 0) {
        showNoFoodResultsMessage();
    }
}

function showNoFoodResultsMessage() {
    // Remove existing no results message
    const existingMessage = document.querySelector('.no-results');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create and show no results message
    const message = document.createElement('div');
    message.className = 'no-results';
    message.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
            <i class="fas fa-search" style="font-size: 3rem; color: #ff6b35; margin-bottom: 1rem;"></i>
            <h3>No dishes found</h3>
            <p>Try searching for something else or browse our menu</p>
        </div>
    `;
    
    const foodsSection = document.querySelector('.foods-section');
    const foodsGrid = document.querySelector('.foods-grid');
    foodsSection.insertBefore(message, foodsGrid.nextSibling);
}

// Category Filtering
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-category');
        filterFoodsByCategory(category);
    });
});

function filterFoodsByCategory(category) {
    foodCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// Order Food Button Functionality
orderFoodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const foodName = btn.getAttribute('data-food');
        const foodPrice = btn.getAttribute('data-price');
        
        // Add shake animation
        btn.classList.add('shake');
        
        // Show order confirmation
        showFoodOrderConfirmation(foodName, foodPrice);
        
        // Remove shake class after animation
        setTimeout(() => {
            btn.classList.remove('shake');
        }, 500);
    });
});

function showFoodOrderConfirmation(foodName, foodPrice) {
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🎉 Order Placed Successfully!</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Thank you for choosing Ramu Kaka Restaurant!</p>
                <p>Your order for <strong>${foodName}</strong> will be ready in 20-30 minutes.</p>
                <div class="order-details">
                    <p><strong>Order ID:</strong> #${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    <p><strong>Item:</strong> ${foodName}</p>
                    <p><strong>Price:</strong> ₹${foodPrice}</p>
                    <p><strong>Estimated Delivery:</strong> 20-30 minutes</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-btn confirm-btn">Track Order</button>
                <button class="modal-btn cancel-btn">Close</button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .order-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .modal-header h3 {
            color: #ff6b35;
            margin: 0;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #999;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-body {
            margin-bottom: 2rem;
        }
        
        .modal-body p {
            margin-bottom: 1rem;
            color: #666;
            line-height: 1.6;
        }
        
        .order-details {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 10px;
            margin-top: 1rem;
        }
        
        .order-details p {
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }
        
        .modal-footer {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .modal-btn {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .confirm-btn {
            background: #ff6b35;
            color: white;
        }
        
        .confirm-btn:hover {
            background: #e55a2b;
        }
        
        .cancel-btn {
            background: #f0f0f0;
            color: #666;
        }
        
        .cancel-btn:hover {
            background: #e0e0e0;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeModal = () => {
        modal.remove();
        modalStyles.remove();
    };
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.cancel-btn').addEventListener('click', closeModal);
    modal.querySelector('.confirm-btn').addEventListener('click', () => {
        alert('Order tracking feature coming soon!');
        closeModal();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.food-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add hover effects to food cards
foodCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        const modal = document.querySelector('.order-modal');
        if (modal) {
            modal.remove();
        }
    }
});

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && touchStartX < 100) {
            // Swipe left from left edge - open menu
            navMenu.classList.add('active');
        } else if (diff < 0 && navMenu.classList.contains('active')) {
            // Swipe right when menu is open - close menu
            navMenu.classList.remove('active');
        }
    }
} 