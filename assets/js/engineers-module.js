// ===== Engineers Module =====
class EngineersModule {
    constructor() {
        this.engineers = [];
        this.favorites = JSON.parse(localStorage.getItem('engineerFavorites')) || [];
        this.filteredEngineers = [];
        this.currentView = 'grid';
        this.init();
    }


    init() {
     
        this.loadEngineersFromJSON();
        this.setupEventListeners();
        this.renderEngineers();
        this.renderFavorites();
    }

 loadEngineersFromJSON() {
  try {
    if (typeof window.engineersData !== 'undefined') {
      this.engineers = window.engineersData;
      console.log('Engineers loaded from external file');
    } else if (document.getElementById('engineersData')) {
      this.engineers = JSON.parse(document.getElementById('engineersData').textContent);
      console.log('Engineers loaded from inline JSON');
    } else {
      this.engineers = this.getFallbackData();
    }
    this.filteredEngineers = [...this.engineers];
  } catch (error) {
    console.error('Error loading engineers data:', error);
    this.engineers = this.getFallbackData();
    this.filteredEngineers = [...this.engineers];
  }
}


    getFallbackData() {
        // Fallback data in case JSON fails
        return [
            {
                id: 1,
                name: "المهندس محمد أبو عيشة",
                specialty: "إنشائي",
                city: "نابلس",
                rating: 4.9,
                projects: 47,
                avatar: "👨‍🔧",
                phone: "0591234567",
                email: "mohammed.abuisha@engineer.com",
                address: "نابلس - شارع الجامعة",
                experience: 12,
                availability: "متاح",
                description: "مهندس إنشائي متخصص في إعادة الإعمار",
                priceRange: "متوسط إلى مرتفع",
                languages: ["العربية", "الإنجليزية"],
                workingHours: "8:00 صباحاً - 5:00 مساءً"
            }
            // Add more fallback entries if needed
        ];
    }

    // باقي الدوال تبقى كما هي...
    filterEngineers() {
        // نفس الدالة السابقة
    }

    renderEngineers() {
        const container = $('#engineersContainer');
        const loading = $('#loadingEngineers');
        const noResults = $('#noResults');
        
        // Hide loading after short delay
        setTimeout(() => {
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
                const availabilityClass = engineer.availability === 'متاح' ? 'bg-success' : 'bg-warning';
                
                html += `
                    <div class="col-lg-4 col-md-6" data-engineer-id="${engineer.id}">
                        <div class="engineer-card ${this.currentView === 'list' ? 'engineer-card-list' : ''}">
                            <div class="engineer-header">
                                <div class="engineer-avatar">
                                    ${engineer.avatar}
                                </div>
                                <h3 class="engineer-name">${engineer.name}</h3>
                                <p class="engineer-title">${engineer.specialty} • ${engineer.city}</p>
                                <span class="badge ${availabilityClass}">${engineer.availability}</span>
                            </div>
                            
                            <div class="engineer-body">
                                <div class="engineer-meta mb-3">
                                    <div class="d-flex justify-content-between">
                                        <span class="text-muted">
                                            <i class="fas fa-star text-warning me-1"></i>
                                            ${engineer.rating}
                                        </span>
                                        <span class="text-muted">
                                            <i class="fas fa-project-diagram me-1"></i>
                                            ${engineer.projects} مشروع
                                        </span>
                                        <span class="text-muted">
                                            <i class="fas fa-history me-1"></i>
                                            ${engineer.experience} سنة
                                        </span>
                                    </div>
                                </div>
                                
                                <p class="engineer-description text-muted small mb-3">
                                    ${engineer.description}
                                </p>
                                
                                <div class="engineer-details">
                                    <div class="row g-2 mb-3">
                                        <div class="col-6">
                                            <small class="text-muted">
                                                <i class="fas fa-money-bill-wave me-1"></i>
                                                ${engineer.priceRange}
                                            </small>
                                        </div>
                                        <div class="col-6">
                                            <small class="text-muted">
                                                <i class="fas fa-clock me-1"></i>
                                                ${engineer.responseTime}
                                            </small>
                                        </div>
                                    </div>
                                    
                                    <div class="languages mb-2">
                                        <small class="text-muted d-block mb-1">
                                            <i class="fas fa-language me-1"></i>
                                            اللغات:
                                        </small>
                                        <div class="d-flex flex-wrap gap-1">
                                            ${engineer.languages.map(lang => 
                                                `<span class="badge bg-light text-dark">${lang}</span>`
                                            ).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="engineer-footer">
                                <div class="engineer-actions">
                                    <button class="btn btn-primary btn-sm contact-btn" 
                                            data-engineer-id="${engineer.id}">
                                        <i class="fas fa-phone me-2"></i> اتصل
                                    </button>
                                    <button class="btn btn-outline-danger btn-favorite btn-sm ${isFavorite ? 'active' : ''}" 
                                            data-engineer-id="${engineer.id}"
                                            title="${isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}">
                                        <i class="fas fa-heart"></i>
                                    </button>
                                    <button class="btn btn-outline-info btn-sm view-details-btn"
                                            data-engineer-id="${engineer.id}"
                                            title="عرض التفاصيل">
                                        <i class="fas fa-info-circle"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            container.html(html);
            
            // Add event listeners
            this.setupCardEventListeners();
            
        }, 500); // Simulate loading delay
    }

    showContactModal(engineerId) {
        const engineer = this.engineers.find(e => e.id === engineerId);
        if (!engineer) return;
        
        // Update modal with all data
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
        
        // Add additional details to modal
        let modalDetails = `
            <div class="additional-details mt-4">
                <h6 class="mb-3">تفاصيل إضافية:</h6>
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="detail-item">
                            <i class="fas fa-clock text-info me-2"></i>
                            <span class="fw-bold">ساعات العمل:</span>
                            <div class="text-muted">${engineer.workingHours}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="detail-item">
                            <i class="fas fa-money-bill-wave text-success me-2"></i>
                            <span class="fw-bold">نطاق الأسعار:</span>
                            <div class="text-muted">${engineer.priceRange}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="detail-item">
                            <i class="fas fa-history text-primary me-2"></i>
                            <span class="fw-bold">الخبرة:</span>
                            <div class="text-muted">${engineer.experience} سنة</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="detail-item">
                            <i class="fas fa-language text-warning me-2"></i>
                            <span class="fw-bold">اللغات:</span>
                            <div class="text-muted">${engineer.languages.join('، ')}</div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-item mt-3">
                    <i class="fas fa-info-circle text-secondary me-2"></i>
                    <span class="fw-bold">الوصف:</span>
                    <div class="text-muted">${engineer.description}</div>
                </div>
                
                ${engineer.certifications && engineer.certifications.length > 0 ? `
                    <div class="detail-item mt-3">
                        <i class="fas fa-certificate text-danger me-2"></i>
                        <span class="fw-bold">الشهادات:</span>
                        <div class="text-muted">
                            ${engineer.certifications.map(cert => `<div>• ${cert}</div>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Add details to modal body if not already there
        if (!$('.additional-details').length) {
            $('.contact-details').after(modalDetails);
        } else {
            $('.additional-details').replaceWith(modalDetails);
        }
        
        // Set up contact action buttons
        $('.contact-action[data-action="call"]').off('click').on('click', () => {
            window.location.href = `tel:${engineer.phone}`;
        });
        
        const modal = new bootstrap.Modal(document.getElementById('contactModal'));
        modal.show();
    }

    // باقي الدوال تبقى كما هي...
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
        
        // View details buttons
        $('.view-details-btn').on('click', (e) => {
            const engineerId = $(e.currentTarget).data('engineer-id');
            this.showEngineerDetails(engineerId);
        });
    }

    showEngineerDetails(engineerId) {
        const engineer = this.engineers.find(e => e.id === engineerId);
        if (!engineer) return;
        
        // Create details modal if it doesn't exist
        if (!$('#detailsModal').length) {
            this.createDetailsModal();
        }
        
        // Populate modal with data
        $('#detailsEngineerName').text(engineer.name);
        $('#detailsEngineerAvatar').text(engineer.avatar);
        $('#detailsEngineerSpecialty').text(engineer.specialty);
        $('#detailsEngineerCity').text(engineer.city);
        $('#detailsEngineerRating').html(this.generateStars(engineer.rating));
        $('#detailsEngineerExperience').text(`${engineer.experience} سنة`);
        $('#detailsEngineerProjects').text(`${engineer.projects} مشروع`);
        $('#detailsEngineerDescription').text(engineer.description);
        $('#detailsEngineerPhone').text(engineer.phone);
        $('#detailsEngineerEmail').text(engineer.email);
        $('#detailsEngineerAddress').text(engineer.address);
        $('#detailsEngineerWorkingHours').text(engineer.workingHours);
        $('#detailsEngineerPriceRange').text(engineer.priceRange);
        $('#detailsEngineerResponseTime').text(engineer.responseTime);
        $('#detailsEngineerLanguages').html(
            engineer.languages.map(lang => `<span class="badge bg-light text-dark me-1">${lang}</span>`).join('')
        );
        $('#detailsEngineerCertifications').html(
            engineer.certifications ? 
            engineer.certifications.map(cert => `<li>${cert}</li>`).join('') : 
            '<li class="text-muted">لا توجد شهادات</li>'
        );
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
        modal.show();
    }

    createDetailsModal() {
        const modalHTML = `
            <div class="modal fade" id="detailsModal" tabindex="-1" aria-labelledby="detailsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="detailsModalLabel">
                                <i class="fas fa-user-tie me-2"></i>
                                تفاصيل المهندس
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-4 text-center">
                                    <div class="engineer-avatar-lg mb-3">
                                        <span id="detailsEngineerAvatar" style="font-size: 3rem;">👨‍🔧</span>
                                    </div>
                                    <h4 id="detailsEngineerName" class="mb-2"></h4>
                                    <div class="mb-3">
                                        <span class="badge bg-primary" id="detailsEngineerSpecialty"></span>
                                        <span class="badge bg-success" id="detailsEngineerCity"></span>
                                    </div>
                                    <div class="rating mb-3">
                                        <span class="stars" id="detailsEngineerRating"></span>
                                        <small class="text-muted">/5</small>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="details-section">
                                        <h6 class="section-title mb-3">
                                            <i class="fas fa-info-circle me-2"></i>معلومات عامة
                                        </h6>
                                        <div class="row mb-3">
                                            <div class="col-6">
                                                <small class="text-muted d-block">الخبرة</small>
                                                <div id="detailsEngineerExperience" class="fw-bold"></div>
                                            </div>
                                            <div class="col-6">
                                                <small class="text-muted d-block">المشاريع</small>
                                                <div id="detailsEngineerProjects" class="fw-bold"></div>
                                            </div>
                                        </div>
                                        <p class="text-muted" id="detailsEngineerDescription"></p>
                                    </div>
                                    
                                    <div class="details-section mt-4">
                                        <h6 class="section-title mb-3">
                                            <i class="fas fa-address-card me-2"></i>معلومات التواصل
                                        </h6>
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">الهاتف</small>
                                                <div id="detailsEngineerPhone" class="fw-bold"></div>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">البريد الإلكتروني</small>
                                                <div id="detailsEngineerEmail" class="fw-bold"></div>
                                            </div>
                                            <div class="col-12">
                                                <small class="text-muted d-block">العنوان</small>
                                                <div id="detailsEngineerAddress"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="details-section mt-4">
                                        <h6 class="section-title mb-3">
                                            <i class="fas fa-cogs me-2"></i>تفاصيل العمل
                                        </h6>
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">ساعات العمل</small>
                                                <div id="detailsEngineerWorkingHours"></div>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">نطاق الأسعار</small>
                                                <div id="detailsEngineerPriceRange"></div>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">وقت الاستجابة</small>
                                                <div id="detailsEngineerResponseTime"></div>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">اللغات</small>
                                                <div id="detailsEngineerLanguages"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="details-section mt-4">
                                        <h6 class="section-title mb-3">
                                            <i class="fas fa-certificate me-2"></i>الشهادات
                                        </h6>
                                        <ul class="list-unstyled" id="detailsEngineerCertifications"></ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times me-2"></i>إغلاق
                            </button>
                            <button type="button" class="btn btn-primary contact-from-details">
                                <i class="fas fa-phone me-2"></i>اتصل الآن
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modalHTML);
    }
}

// Initialize when document is ready
$(document).ready(function() {
    window.engineersModule = new EngineersModule();
});