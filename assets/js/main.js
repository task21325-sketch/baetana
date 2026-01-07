$(document).ready(function() {
    // Load saved progress from LocalStorage
    loadProgress();
    
    // Timeline Navigation
    let currentStep = 1;
    const totalSteps = 8;
    
    // Next/Previous Buttons
    $('#nextBtn').click(function() {
        if (currentStep < totalSteps) {
            switchStep(currentStep + 1);
        }
    });
    
    $('#prevBtn').click(function() {
        if (currentStep > 1) {
            switchStep(currentStep - 1);
        }
    });
    
    // Click on timeline items
    $('.timeline-item').click(function() {
        const step = parseInt($(this).data('step'));
        switchStep(step);
    });
    
    // Checklist functionality
    $('.checklist input[type="checkbox"]').change(function() {
        saveProgress();
        updateProgressBar();
    });
    
    // Dark Mode Toggle
    $('#themeToggle').click(function() {
        toggleDarkMode();
    });
    
    // Initialize
    updateProgressBar();
    updateNavButtons();
});

// Switch to specific step with fade effect
function switchStep(step) {
    // Fade out current active
    $('.timeline-item.active .timeline-content').fadeOut(400, function() {
        // Remove active class
        $('.timeline-item.active').removeClass('active');
        
        // Add active to new step
        $(`.timeline-item[data-step="${step}"]`).addClass('active');
        
        // Fade in new content
        $('.timeline-item.active .timeline-content').fadeIn(600);
        
        currentStep = step;
        updateNavButtons();
        updateProgressBar();
    });
}

// Update Progress Bar
function updateProgressBar() {
    const progressData = loadProgress();
    const completedCount = progressData.completedSteps.length;
    const percentage = (completedCount / totalSteps) * 100;
    
    $('#progressFill').css('width', percentage + '%');
    $('#progressText').text(`${completedCount} من ${totalSteps} مراحل مكتملة`);
}

// Save progress to LocalStorage
function saveProgress() {
    const progressData = {
        completedSteps: [],
        timestamp: new Date().toISOString()
    };
    
    // Check which steps are completed
    for (let i = 1; i <= totalSteps; i++) {
        const stepElement = $(`.timeline-item[data-step="${i}"]`);
        if (stepElement.hasClass('completed') || 
            stepElement.find('input[type="checkbox"]:checked').length > 0) {
            progressData.completedSteps.push(i);
        }
    }
    
    localStorage.setItem('baytnaTimelineProgress', JSON.stringify(progressData));
}

// Load progress from LocalStorage
function loadProgress() {
    const saved = localStorage.getItem('baytnaTimelineProgress');
    return saved ? JSON.parse(saved) : { completedSteps: [] };
}

// Update Navigation Buttons
function updateNavButtons() {
    $('#prevBtn').prop('disabled', currentStep === 1);
    $('#nextBtn').prop('disabled', currentStep === totalSteps);
}

// Dark Mode Toggle
function toggleDarkMode() {
    const body = $('body');
    const currentTheme = localStorage.getItem('baytnaTheme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.attr('data-theme', newTheme);
    localStorage.setItem('baytnaTheme', newTheme);
    
    // Update icon
    const icon = $('.theme-icon');
    icon.removeClass('fa-sun fa-moon');
    icon.addClass(newTheme === 'dark' ? 'fa-sun' : 'fa-moon');
}

// Load theme on page load
const savedTheme = localStorage.getItem('baytnaTheme') || 'light';
$('body').attr('data-theme', savedTheme);
$('.theme-icon').removeClass('fa-sun fa-moon').addClass(savedTheme === 'dark' ? 'fa-sun' : 'fa-moon');

// ===== Engineers Module =====
class EngineersModule {
    constructor() {
        this.engineers = [];
        this.favorites = JSON.parse(localStorage.getItem('engineerFavorites')) || [];
        this.filteredEngineers = [];
        this.currentView = 'grid'; // 'grid' or 'list'
        this.init();
    }

    init() {
        this.loadEngineers();
        this.setupEventListeners();
        this.renderEngineers();
        this.renderFavorites();
    }

    loadEngineers() {
        // This data should come from engineers-data.js
        // For now, we'll use placeholder data
        this.engineers = window.engineersData || [
            {
                id: 1,
                name: "المهندس محمد أبو عيشة",
                title: "مهندس إنشائي",
                city: "نابلس",
                specialty: "إنشائي",
                rating: 4.8,
                projects: 47,
                phone: "0591234567",
                email: "mohammed@example.com",
                avatar: "👨‍🔧",
                address: "نابلس، فلسطين",
                experience: "15 سنة"
            }
            // ... add more engineers
        ];
        
        this.filteredEngineers = [...this.engineers];
    }

    setupEventListeners() {
        // Search functionality
        $('#quickSearch').on('input', () => this.filterEngineers());
        $('#cityFilter, #specialtyFilter').on('change', () => this.filterEngineers());
        $('#ratingFilter').on('input', function() {
            $('#ratingValue').text($(this).val() + '+');
            this.filterEngineers();
        }.bind(this));
        $('#projectsFilter, #sortBy').on('change', () => this.filterEngineers());
        
        // Search button
        $('#searchBtn').on('click', () => this.filterEngineers());
        
        // Reset filters
        $('#resetFilters').on('click', () => this.resetFilters());
        
        // Clear search
        $('#clearSearch').on('click', () => {
            $('#quickSearch').val('');
            this.filterEngineers();
        });
        
        // Toggle view
        $('#toggleView').on('click', () => this.toggleView());
        
        // Show all engineers
        $('#showAllEngineers').on('click', () => {
            this.resetFilters();
            $('html, body').animate({
                scrollTop: $('#engineersGrid').offset().top - 100
            }, 500);
        });
        
        // Scroll to favorites
        $('#scrollToFavorites').on('click', () => {
            $('html, body').animate({
                scrollTop: $('#favoritesSection').offset().top - 100
            }, 500);
        });
    }

    filterEngineers() {
        const searchTerm = $('#quickSearch').val().toLowerCase();
        const city = $('#cityFilter').val();
        const specialty = $('#specialtyFilter').val();
        const minRating = parseFloat($('#ratingFilter').val());
        const minProjects = $('#projectsFilter').val() ? parseInt($('#projectsFilter').val()) : 0;
        const sortBy = $('#sortBy').val();

        this.filteredEngineers = this.engineers.filter(engineer => {
            const matchesSearch = !searchTerm || 
                engineer.name.toLowerCase().includes(searchTerm) ||
                engineer.specialty.toLowerCase().includes(searchTerm) ||
                engineer.city.toLowerCase().includes(searchTerm);
            
            const matchesCity = !city || engineer.city === city;
            const matchesSpecialty = !specialty || engineer.specialty === specialty;
            const matchesRating = engineer.rating >= minRating;
            const matchesProjects = !minProjects || engineer.projects >= minProjects;

            return matchesSearch && matchesCity && matchesSpecialty && 
                   matchesRating && matchesProjects;
        });

        // Sort engineers
        this.sortEngineers(sortBy);

        // Update results count
        $('#resultsCount').text(this.filteredEngineers.length);
        
        // Update filter info
        this.updateFilterInfo();
        
        // Render filtered engineers
        this.renderEngineers();
    }

    sortEngineers(sortBy) {
        switch(sortBy) {
            case 'rating':
                this.filteredEngineers.sort((a, b) => b.rating - a.rating);
                break;
            case 'projects':
                this.filteredEngineers.sort((a, b) => b.projects - a.projects);
                break;
            case 'name':
                this.filteredEngineers.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
                break;
            case 'city':
                this.filteredEngineers.sort((a, b) => a.city.localeCompare(b.city, 'ar'));
                break;
        }
    }

    updateFilterInfo() {
        const city = $('#cityFilter').val();
        const specialty = $('#specialtyFilter').val();
        const minRating = $('#ratingFilter').val();
        
        let info = 'يعرض جميع المهندسين';
        
        if (city || specialty || minRating > 0) {
            info = 'يعرض مهندسين مفلترين حسب: ';
            const filters = [];
            
            if (city) filters.push(`المدينة: ${city}`);
            if (specialty) filters.push(`التخصص: ${specialty}`);
            if (minRating > 0) filters.push(`التقييم: ${minRating}+`);
            
            info += filters.join('، ');
        }
        
        $('#filterInfo').text(info);
    }

    resetFilters() {
        $('#quickSearch').val('');
        $('#cityFilter').val('');
        $('#specialtyFilter').val('');
        $('#ratingFilter').val(0);
        $('#ratingValue').text('0+');
        $('#projectsFilter').val('');
        $('#sortBy').val('rating');
        
        this.filterEngineers();
    }

    toggleView() {
        this.currentView = this.currentView === 'grid' ? 'list' : 'grid';
        $('#toggleView i').toggleClass('fa-th-large fa-list');
        $('#toggleView span').text(
            this.currentView === 'grid' ? ' تغيير العرض' : ' عرض الشبكة'
        );
        
        this.renderEngineers();
    }

    renderEngineers() {
        const container = $('#engineersContainer');
        const loading = $('#loadingEngineers');
        const noResults = $('#noResults');
        
        // Hide loading
        loading.addClass('d-none');
        
        if (this.filteredEngineers.length === 0) {
            container.html('');
            noResults.removeClass('d-none');
            return;
        }
        
        noResults.addClass('d-none');
        
        let html = '';
        
        this.filteredEngineers.forEach(engineer => {
            const isFavorite = this.favorites.includes(engineer.id);
            
            html += `
                <div class="col-lg-4 col-md-6" data-engineer-id="${engineer.id}">
                    <div class="engineer-card ${this.currentView === 'list' ? 'engineer-card-list' : ''}">
                        <div class="engineer-header">
                            <div class="engineer-avatar">
                                ${engineer.avatar}
                            </div>
                            <h3 class="engineer-name">${engineer.name}</h3>
                            <p class="engineer-title">${engineer.title}</p>
                        </div>
                        
                        <div class="engineer-body">
                            <div class="engineer-meta">
                                <span class="badge bg-primary">${engineer.specialty}</span>
                                <span class="badge bg-success">${engineer.city}</span>
                                <span class="badge bg-info">${engineer.experience}</span>
                            </div>
                            
                            <div class="engineer-rating">
                                <div class="stars">
                                    ${this.generateStars(engineer.rating)}
                                </div>
                                <div class="rating-text">
                                    <span class="fw-bold">${engineer.rating}</span>/5 
                                    <small class="text-muted">(${engineer.projects} مشروع)</small>
                                </div>
                            </div>
                            
                            <div class="engineer-skills mt-3">
                                <small class="text-muted">مشاريع مكتملة: ${engineer.projects}</small>
                            </div>
                        </div>
                        
                        <div class="engineer-footer">
                            <div class="engineer-actions">
                                <button class="btn btn-primary contact-btn" 
                                        data-engineer-id="${engineer.id}">
                                    <i class="fas fa-phone me-2"></i> اتصل
                                </button>
                                <button class="btn btn-outline-danger btn-favorite ${isFavorite ? 'active' : ''}" 
                                        data-engineer-id="${engineer.id}">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.html(html);
        
        // Add event listeners to new buttons
        this.setupCardEventListeners();
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '★';
            } else if (i === fullStars && hasHalfStar) {
                stars += '⯪';
            } else {
                stars += '☆';
            }
        }
        
        return stars;
    }

    setupCardEventListeners() {
        // Contact buttons
        $('.contact-btn').on('click', (e) => {
            const engineerId = $(e.currentTarget).data('engineer-id');
            this.showContactModal(engineerId);
        });
        
        // Favorite buttons
        $('.btn-favorite').on('click', (e) => {
            const button = $(e.currentTarget);
            const engineerId = button.data('engineer-id');
            this.toggleFavorite(engineerId, button);
        });
    }

    showContactModal(engineerId) {
        const engineer = this.engineers.find(e => e.id === engineerId);
        if (!engineer) return;
        
        $('#modalEngineerAvatar').text(engineer.avatar);
        $('#modalEngineerName').text(engineer.name);
        $('#modalEngineerSpecialty').text(engineer.specialty);
        $('#modalEngineerCity').text(engineer.city);
        $('#modalEngineerRating').html(this.generateStars(engineer.rating));
        $('#modalEngineerRatingValue').text(engineer.rating);
        $('#modalEngineerPhone').text(engineer.phone);
        $('#modalEngineerEmail').text(engineer.email);
        $('#modalEngineerAddress').text(engineer.address);
        $('#modalEngineerProjects').text(`${engineer.projects} مشروع`);
        
        // Set up contact action buttons
        $('.contact-action[data-action="call"]').off('click').on('click', () => {
            window.location.href = `tel:${engineer.phone}`;
        });
        
        const modal = new bootstrap.Modal(document.getElementById('contactModal'));
        modal.show();
    }

    toggleFavorite(engineerId, button) {
        const index = this.favorites.indexOf(engineerId);
        
        if (index === -1) {
            // Add to favorites
            this.favorites.push(engineerId);
            button.addClass('active');
            this.showToast('تمت الإضافة إلى المفضلة', 'success');
        } else {
            // Remove from favorites
            this.favorites.splice(index, 1);
            button.removeClass('active');
            this.showToast('تمت الإزالة من المفضلة', 'info');
        }
        
        // Save to localStorage
        localStorage.setItem('engineerFavorites', JSON.stringify(this.favorites));
        
        // Update favorites display
        this.renderFavorites();
    }

    renderFavorites() {
        const container = $('#favoritesContainer');
        const emptyState = $('#emptyFavorites');
        
        if (this.favorites.length === 0) {
            container.html('');
            emptyState.removeClass('d-none');
            return;
        }
        
        emptyState.addClass('d-none');
        
        let html = '';
        const favoriteEngineers = this.engineers.filter(e => this.favorites.includes(e.id));
        
        favoriteEngineers.forEach(engineer => {
            html += `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="engineer-card favorite-card">
                        <div class="engineer-header">
                            <div class="engineer-avatar">
                                ${engineer.avatar}
                            </div>
                            <h4 class="engineer-name">${engineer.name}</h4>
                            <p class="engineer-title">${engineer.title}</p>
                        </div>
                        
                        <div class="engineer-body">
                            <div class="engineer-meta">
                                <span class="badge bg-light text-dark">${engineer.city}</span>
                                <span class="badge bg-light text-dark">${engineer.specialty}</span>
                            </div>
                            
                            <div class="engineer-rating">
                                <div class="stars text-warning">
                                    ${this.generateStars(engineer.rating)}
                                </div>
                            </div>
                        </div>
                        
                        <div class="engineer-footer">
                            <button class="btn btn-outline-light w-100 contact-btn" 
                                    data-engineer-id="${engineer.id}">
                                <i class="fas fa-phone me-2"></i> اتصل
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.html(html);
        
        // Add event listeners to favorite contact buttons
        $('#favoritesContainer .contact-btn').on('click', (e) => {
            const engineerId = $(e.currentTarget).data('engineer-id');
            this.showContactModal(engineerId);
        });
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        // Add to toast container
        if (!$('#toastContainer').length) {
            $('body').append('<div id="toastContainer" class="toast-container position-fixed bottom-0 end-0 p-3"></div>');
        }
        
        $('#toastContainer').append(toastHtml);
        
        // Show toast
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
        toast.show();
        
        // Remove after hide
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}

// Initialize when document is ready
$(document).ready(function() {
    window.engineersModule = new EngineersModule();
});