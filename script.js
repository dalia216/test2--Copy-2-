// NoorEldean Coaching - Main JavaScript

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Body scroll lock when mobile menu is open
    var menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Mobile Dropdown Toggle - Always add listeners
    var dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(function(dropdown) {
        var link = dropdown.querySelector(':scope > a');
        if (link) {
            // Use touchend for mobile to prevent double firing
            link.addEventListener('touchend', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdowns.forEach(function(d) {
                        if (d !== dropdown) {
                            d.classList.remove('open');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('open');
                }
            }, { passive: false });
            
            // Prevent click from navigating on mobile
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }
    });
    
    // Handle clicks on dropdown menu items (let them navigate)
    document.querySelectorAll('.dropdown-menu a').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            // Close mobile menu after clicking
            if (menuToggle) {
                menuToggle.checked = false;
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('touchend', function(e) {
        if (window.innerWidth <= 768) {
            if (!e.target.closest('.nav-dropdown')) {
                dropdowns.forEach(function(d) {
                    d.classList.remove('open');
                });
            }
        }
    });
    
    // Re-check on resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            document.querySelectorAll('.nav-dropdown').forEach(function(d) {
                d.classList.remove('open');
            });
        }
    });
    
    // Dynamic Year in Footer
    var yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Scroll to Top Button
    var scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Navbar Scroll Effect + Scroll to Top visibility
window.addEventListener('scroll', function() {
    var navbar = document.querySelector('.navbar');
    var scrollBtn = document.getElementById('scrollToTop');
    
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Show/hide scroll to top button
    if (scrollBtn) {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }
});

// Discount Calculator - Auto calculate discount percentages
function forceCalculateDiscount() {
    var cards = document.querySelectorAll('.pricing-card-clean');
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var oldPriceEl = card.querySelector('.pricing-old-price');
        var newPriceEl = card.querySelector('.pricing-new-price');
        var badge = card.querySelector('.discount-badge');
        if (oldPriceEl && newPriceEl && badge) {
            var oldPrice = parseFloat(oldPriceEl.innerText.replace(/[^\d.]/g, ''));
            var newPrice = parseFloat(newPriceEl.innerText.replace(/[^\d.]/g, ''));
            if (oldPrice > 0 && newPrice > 0) {
                var percent = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
                badge.innerHTML = percent + '% خصم';
            }
        }
    }
}

window.addEventListener('load', forceCalculateDiscount);
setTimeout(forceCalculateDiscount, 1000);