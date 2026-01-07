// Main JavaScript File
$(document).ready(function() {
    // Initialize dark mode
    initializeDarkMode();
    
    // Initialize active navigation
    initializeActiveNav();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize smooth scrolling
    initializeSmoothScroll();
});

function initializeDarkMode() {
    const savedTheme = localStorage.getItem('baytnaTheme') || 'light';
    $('body').attr('data-theme', savedTheme);
    updateThemeUI(savedTheme);
    
    // Theme toggle event
    $('#themeToggle').off('click').on('click', function() {
        const currentTheme = $('body').attr('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        $('body').attr('data-theme', newTheme);
        localStorage.setItem('baytnaTheme', newTheme);
        updateThemeUI(newTheme);
    });
}

function updateThemeUI(theme) {
    const icon = $('.theme-icon');
    const text = $('.theme-text');
    
    if (icon.length && text.length) {
        if (theme === 'dark') {
            icon.removeClass('fa-sun').addClass('fa-moon');
            text.text('الوضع الليلي');
        } else {
            icon.removeClass('fa-moon').addClass('fa-sun');
            text.text('الوضع النهاري');
        }
    }
}

function initializeActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    $('.nav-link').each(function() {
        const href = $(this).attr('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (href.includes(currentPage) && currentPage !== '')) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });
}

function initializeTooltips() {
    $('[data-bs-toggle="tooltip"]').tooltip();
}

function initializeSmoothScroll() {
    $('a[href^="#"]').on('click', function(e) {
        if (this.hash !== '') {
            e.preventDefault();
            const hash = this.hash;
            
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 80
            }, 800);
        }
    });
}

// Utility function for localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return null;
    }
}

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeDarkMode,
        initializeActiveNav,
        saveToLocalStorage,
        loadFromLocalStorage
    };
}