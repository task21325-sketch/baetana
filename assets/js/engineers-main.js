// ============================================
// ENGINEERS MAIN
// الملف الرئيسي لصفحة المهندسين
// ============================================

$(document).ready(function() {
    console.log('🚀 Engineers page loading...');
    
    // Initialize the page
    initializeEngineersPage();
    
    // Add event listeners
    addEngineersEventListeners();
    
    console.log('✅ Engineers page ready!');
});

function initializeEngineersPage() {
    console.log('🔄 Initializing engineers page...');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('baytnaTheme') || 'light';
    $('body').attr('data-theme', savedTheme);
    updateThemeButton(savedTheme);
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize navigation
    initializeNavigation();
    
    // Start loading engineers
    setTimeout(() => {
        loadEngineers();
    }, 100);
}

function updateThemeButton(theme) {
    const icon = $('.theme-icon');
    const text = $('.theme-text');
    
    if (theme === 'dark') {
        icon.removeClass('fa-sun').addClass('fa-moon');
        text.text('الوضع الليلي');
        $('#themeToggle').removeClass('btn-outline-light').addClass('btn-light');
    } else {
        icon.removeClass('fa-moon').addClass('fa-sun');
        text.text('الوضع النهاري');
        $('#themeToggle').removeClass('btn-light').addClass('btn-outline-light');
    }
}

function initializeTooltips() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'hover',
            placement: 'top'
        });
    });
    
    console.log(`✅ ${tooltipList.length} tooltips initialized`);
}

function initializeNavigation() {
    // Highlight current page in navigation
    $('.nav-link').removeClass('active');
    $('.nav-link[href="engineers.html"]').addClass('active');
    
    console.log('✅ Navigation initialized');
}

function addEngineersEventListeners() {
    // Theme toggle
    $('#themeToggle').off('click').on('click', function() {
        const body = $('body');
        const currentTheme = localStorage.getItem('baytnaTheme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.attr('data-theme', newTheme);
        localStorage.setItem('baytnaTheme', newTheme);
        updateThemeButton(newTheme);
        
        showNotification(`تم التبديل إلى الوضع ${newTheme === 'dark' ? 'الليلي' : 'النهاري'}`, 'success');
    });
    
    // Smooth scroll
    $('a[href^="#"]').on('click', function(e) {
        if (this.hash !== '' && $(this.hash).length) {
            e.preventDefault();
            const hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 80
            }, 800);
            console.log(`📍 Scrolled to: ${hash}`);
        }
    });
    
    // Scroll to favorites
    $('#scrollToFavorites').on('click', function() {
        $('html, body').animate({
            scrollTop: $('#favoritesSection').offset().top - 80
        }, 800);
        console.log('📍 Scrolled to favorites section');
    });
    
    // Print button hover effect
    $('.print-btn').hover(
        function() {
            $(this).css({
                'width': '120px',
                'border-radius': '30px'
            });
        },
        function() {
            $(this).css({
                'width': '50px',
                'border-radius': '50%'
            });
        }
    );
    
    // Search button
    $('#searchBtn').on('click', function() {
        if (typeof EngineersModule !== 'undefined') {
            EngineersModule.filterEngineers();
        }
        $(this).blur();
    });
    
    // Enter key in search
    $('#quickSearch').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            if (typeof EngineersModule !== 'undefined') {
                EngineersModule.filterEngineers();
            }
        }
    });
    
    console.log('✅ Event listeners added');
}

function loadEngineers() {
    console.log('🔄 Loading engineers data...');
    
    // Show loading state
    $('#loadingEngineers').show();
    $('#engineersContainer').hide();
    $('#noResults').hide();
    
    // Simulate loading delay (for demo purposes)
    setTimeout(() => {
        if (typeof engineersData !== 'undefined' && typeof EngineersModule !== 'undefined') {
            // Initialize the module with engineers data
            EngineersModule.init(engineersData);
            
            // Hide loading
            $('#loadingEngineers').hide();
            $('#engineersContainer').show();
            
            // Initialize animations
            initializeAnimations();
            
            console.log('✅ Engineers loaded successfully!');
            console.log(`📊 Total engineers: ${EngineersModule.getEngineersCount()}`);
            console.log(`❤️  Favorites: ${EngineersModule.getFavoritesCount()}`);
            
            // Show welcome notification
            setTimeout(() => {
                showNotification(`تم تحميل ${EngineersModule.getEngineersCount()} مهندس بنجاح!`, 'success');
            }, 500);
        } else {
            console.error('❌ Error: Engineers data or module not loaded');
            $('#loadingEngineers').html(`
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>خطأ في تحميل البيانات!</strong>
                    <p class="mb-0">تعذر تحميل قائمة المهندسين. يرجى تحديث الصفحة.</p>
                </div>
                <button class="btn btn-primary mt-3" onclick="location.reload()">
                    <i class="fas fa-redo me-2"></i>إعادة تحميل الصفحة
                </button>
            `);
        }
    }, 1000);
}

function initializeAnimations() {
    // Animate cards on scroll
    function animateOnScroll() {
        $('.engineer-card').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                if (!$(this).hasClass('animate__animated')) {
                    $(this).addClass('animate__animated animate__fadeInUp');
                }
            }
        });
    }
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    $(window).on('scroll', animateOnScroll);
    
    console.log('✅ Animations initialized');
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    $('.notification').remove();
    
    // Create notification
    const icon = type === 'success' ? 'fa-check-circle' : 
                type === 'warning' ? 'fa-exclamation-triangle' : 
                type === 'danger' ? 'fa-times-circle' : 'fa-info-circle';
    
    const notification = $(`
        <div class="notification alert alert-${type} alert-dismissible fade show position-fixed animate__animated animate__fadeInDown"
             style="top: 100px; left: 50%; transform: translateX(-50%); z-index: 9999; max-width: 90%;">
            <i class="fas ${icon} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="إغلاق"></button>
        </div>
    `);
    
    // Add to body
    $('body').append(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.alert('close');
    }, 3000);
}

function printEngineerInfo() {
    const engineerName = $('#modalEngineerName').text();
    const engineerSpecialty = $('#modalEngineerSpecialty').text();
    const engineerCity = $('#modalEngineerCity').text();
    const engineerPhone = $('#modalEngineerPhone').text();
    const engineerEmail = $('#modalEngineerEmail').text();
    const engineerRating = $('#modalEngineerRatingValue').text();
    const engineerProjects = $('#modalEngineerProjects').text();
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html dir="rtl">
        <head>
            <title>معلومات المهندس - ${engineerName}</title>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600&display=swap');
                body { 
                    font-family: 'Cairo', sans-serif; 
                    padding: 30px; 
                    line-height: 1.6;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    border-bottom: 2px solid #4299e1;
                    padding-bottom: 20px;
                }
                h1 { 
                    color: #4299e1; 
                    margin-bottom: 10px;
                    font-size: 24pt;
                }
                .subtitle {
                    color: #666;
                    font-size: 14pt;
                }
                .info-section {
                    margin: 30px 0;
                }
                .info-item {
                    margin: 15px 0;
                    display: flex;
                    align-items: center;
                }
                .info-label {
                    font-weight: bold;
                    color: #2d3748;
                    min-width: 150px;
                }
                .info-value {
                    color: #4a5568;
                    flex: 1;
                }
                .rating {
                    color: #f59e0b;
                    font-size: 16pt;
                    letter-spacing: 3px;
                }
                .footer {
                    margin-top: 60px;
                    text-align: center;
                    color: #718096;
                    font-size: 10pt;
                    border-top: 1px solid #e2e8f0;
                    padding-top: 20px;
                }
                .contact-info {
                    background: #f7fafc;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                @media print {
                    body { font-size: 12pt; }
                    .no-print { display: none; }
                }
                @page {
                    margin: 20mm;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${engineerName}</h1>
                <div class="subtitle">معلومات التواصل والمهنية</div>
            </div>
            
            <div class="info-section">
                <div class="info-item">
                    <span class="info-label">التخصص:</span>
                    <span class="info-value">${engineerSpecialty}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">المدينة:</span>
                    <span class="info-value">${engineerCity}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">التقييم:</span>
                    <span class="info-value">
                        <span class="rating">${'★'.repeat(Math.floor(engineerRating))}${'☆'.repeat(5-Math.floor(engineerRating))}</span>
                        (${engineerRating}/5)
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">المشاريع:</span>
                    <span class="info-value">${engineerProjects}</span>
                </div>
            </div>
            
            <div class="contact-info">
                <h3 style="color: #4299e1; margin-top: 0;">معلومات التواصل</h3>
                <div class="info-item">
                    <span class="info-label">رقم الهاتف:</span>
                    <span class="info-value">${engineerPhone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">البريد الإلكتروني:</span>
                    <span class="info-value">${engineerEmail}</span>
                </div>
            </div>
            
            <div class="footer">
                <p>مطبوع من منصة "بيتنا" - إعادة إعمار المنازل الفلسطينية</p>
                <p>${new Date().toLocaleDateString('ar-EG', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</p>
                <p>www.baytna.ps</p>
            </div>
            
            <div class="no-print" style="margin-top: 30px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #4299e1; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    طباعة هذه الصفحة
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #718096; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                    إغلاق النافذة
                </button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    
    // Auto-print after a short delay
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Add debug info to console
console.log('📊 Debug Information:');
console.log('====================');
console.log('Page: engineers.html');
console.log('CSS Files:');
console.log('  - engineers-base.css');
console.log('  - engineers-components.css');
console.log('  - engineers-responsive.css');
console.log('JS Files:');
console.log('  - engineers-data.js');
console.log('  - engineers-module.js');
console.log('  - engineers-main.js');
console.log('====================');