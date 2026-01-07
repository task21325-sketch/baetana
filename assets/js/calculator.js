// Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    loadSavedEstimates();
    updateSavedCount();
    
    // Event Listeners
    document.getElementById('costForm').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateCost();
    });
    
    document.getElementById('resetCalculator').addEventListener('click', resetCalculator);
    document.getElementById('saveEstimate').addEventListener('click', saveEstimate);
    document.getElementById('showSavedEstimates').addEventListener('click', showSavedEstimates);
    document.getElementById('shareEstimate').addEventListener('click', shareEstimate);
    
    // Real-time calculation
    const inputs = document.querySelectorAll('#costForm input, #costForm select');
    inputs.forEach(input => {
        input.addEventListener('input', calculateCost);
        input.addEventListener('change', calculateCost);
    });
    
    // Initial calculation
    calculateCost();
});

function calculateCost() {
    // Get form values
    const houseSize = parseFloat(document.getElementById('houseSize').value) || 0;
    const baseCostPerMeter = parseFloat(document.getElementById('damageType').value) || 800;
    const cityMultiplier = parseFloat(document.getElementById('city').value) || 1;
    const finishMultiplier = parseFloat(document.getElementById('finishLevel').value) || 1;
    
    // Calculate extras
    let extrasTotal = 0;
    const extras = [];
    
    if (document.getElementById('solarPanels').checked) {
        const value = 15000;
        extrasTotal += value;
        extras.push({ name: 'ألواح شمسية', value: value });
    }
    if (document.getElementById('lift').checked) {
        const value = 30000;
        extrasTotal += value;
        extras.push({ name: 'مصعد', value: value });
    }
    if (document.getElementById('garden').checked) {
        const value = 8000;
        extrasTotal += value;
        extras.push({ name: 'حديقة', value: value });
    }
    if (document.getElementById('security').checked) {
        const value = 12000;
        extrasTotal += value;
        extras.push({ name: 'نظام أمان', value: value });
    }
    
    // Calculate costs
    const baseCost = houseSize * baseCostPerMeter;
    const adjustedCost = baseCost * cityMultiplier * finishMultiplier;
    const finalTotal = adjustedCost + extrasTotal;
    const costPerMeter = houseSize > 0 ? Math.round(finalTotal / houseSize) : 0;
    
    // Update UI
    document.getElementById('totalCost').textContent = formatNumber(finalTotal);
    document.getElementById('costPerMeter').textContent = formatNumber(costPerMeter);
    document.getElementById('baseCost').textContent = formatNumber(baseCost);
    document.getElementById('cityFactor').textContent = `x${cityMultiplier.toFixed(2)}`;
    document.getElementById('finishFactor').textContent = `x${finishMultiplier.toFixed(2)}`;
    document.getElementById('finalTotal').textContent = formatNumber(finalTotal);
    
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
    
    // Update breakdown list
    const breakdownList = document.getElementById('breakdownList');
    let breakdownHTML = `
        <div class="breakdown-item">
            <span class="breakdown-label">التكلفة الأساسية</span>
            <span class="breakdown-value">${formatNumber(baseCost)} شيكل</span>
        </div>
        <div class="breakdown-item">
            <span class="breakdown-label">معامل الموقع (${cityMultiplier.toFixed(2)}x)</span>
            <span class="breakdown-value">${formatNumber(baseCost * (cityMultiplier - 1))} شيكل</span>
        </div>
        <div class="breakdown-item">
            <span class="breakdown-label">معامل التشطيب (${finishMultiplier.toFixed(2)}x)</span>
            <span class="breakdown-value">${formatNumber(baseCost * cityMultiplier * (finishMultiplier - 1))} شيكل</span>
        </div>
    `;
    
    if (extras.length > 0) {
        extras.forEach(extra => {
            breakdownHTML += `
                <div class="breakdown-item">
                    <span class="breakdown-label">${extra.name}</span>
                    <span class="breakdown-value">+${formatNumber(extra.value)} شيكل</span>
                </div>
            `;
        });
    }
    
    breakdownHTML += `
        <div class="breakdown-item" style="background: rgba(78, 84, 200, 0.1); font-weight: bold;">
            <span class="breakdown-label">الإجمالي النهائي</span>
            <span class="breakdown-value" style="color: var(--success-color);">${formatNumber(finalTotal)} شيكل</span>
        </div>
    `;
    
    breakdownList.innerHTML = breakdownHTML;
    
    // Store current estimate
    window.currentEstimate = {
        houseSize,
        baseCostPerMeter,
        cityMultiplier,
        finishMultiplier,
        baseCost,
        adjustedCost,
        extrasTotal,
        finalTotal,
        costPerMeter,
        extras: extras,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('ar-EG'),
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
    
    // Smooth scroll to results
    setTimeout(() => {
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

function resetCalculator() {
    if (confirm('هل تريد إعادة تعيين الحاسبة؟ سيتم مسح جميع البيانات الحالية.')) {
        document.getElementById('houseSize').value = 120;
        document.getElementById('damageType').value = 1400;
        document.getElementById('city').value = 1;
        document.getElementById('finishLevel').value = 1.3;
        
        const checkboxes = document.querySelectorAll('.option-card input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        
        calculateCost();
    }
}

function saveEstimate() {
    if (!window.currentEstimate) {
        alert('يرجى حساب التكلفة أولاً قبل الحفظ');
        return;
    }
    
    const estimates = JSON.parse(localStorage.getItem('baytnaEstimates') || '[]');
    
    // Check if similar estimate already exists
    const similarExists = estimates.some(est => 
        est.houseSize === window.currentEstimate.houseSize &&
        est.baseCostPerMeter === window.currentEstimate.baseCostPerMeter &&
        est.cityMultiplier === window.currentEstimate.cityMultiplier &&
        est.finishMultiplier === window.currentEstimate.finishMultiplier &&
        est.extrasTotal === window.currentEstimate.extrasTotal
    );
    
    if (similarExists) {
        if (!confirm('يوجد تقدير مشابه مُحفَظ مسبقًا. هل تريد إضافة نسخة جديدة؟')) {
            return;
        }
    }
    
    estimates.unshift({
        ...window.currentEstimate,
        id: Date.now()
    });
    
    // Keep only last 10 estimates
    localStorage.setItem('baytnaEstimates', JSON.stringify(estimates.slice(0, 10)));
    updateSavedCount();
    
    // Show success message
    showNotification('تم حفظ التقدير بنجاح!', 'success');
}

function loadSavedEstimates() {
    return JSON.parse(localStorage.getItem('baytnaEstimates') || '[]');
}

function updateSavedCount() {
    const estimates = loadSavedEstimates();
    document.getElementById('savedEstimates').textContent = estimates.length;
    document.getElementById('savedCount').textContent = estimates.length;
}

function showSavedEstimates() {
    const estimates = loadSavedEstimates();
    const modalList = document.getElementById('savedEstimatesList');
    
    if (estimates.length === 0) {
        modalList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-history fa-3x text-muted mb-3"></i>
                <p class="text-muted">لا توجد تقديرات محفوظة</p>
                <p class="small text-muted">احسب تكلفة أولاً ثم احفظها لتظهر هنا</p>
            </div>
        `;
    } else {
        let html = '<div class="row g-3">';
        estimates.forEach((est, index) => {
            const extrasList = est.extras?.map(e => e.name).join(', ') || 'لا يوجد';
            
            html += `
                <div class="col-12">
                    <div class="saved-estimate-item">
                        <div class="saved-estimate-header">
                            <div>
                                <strong>التقدير #${index + 1}</strong>
                                <div class="saved-estimate-date">${est.date} - ${est.time}</div>
                            </div>
                            <div class="saved-estimate-total">${formatNumber(est.finalTotal)} شيكل</div>
                        </div>
                        <div class="saved-estimate-details">
                            <div>المساحة: ${est.houseSize} م²</div>
                            <div>الموقع: معامل ${est.cityMultiplier.toFixed(2)}</div>
                            <div>الإضافات: ${extrasList}</div>
                        </div>
                        <div class="text-end mt-2">
                            <button class="btn btn-sm btn-outline-primary me-2" onclick="loadEstimate(${est.id})">
                                <i class="fas fa-upload me-1"></i>تحميل
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteEstimate(${est.id})">
                                <i class="fas fa-trash me-1"></i>حذف
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        modalList.innerHTML = html;
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('savedEstimatesModal'));
    modal.show();
}

function loadEstimate(id) {
    const estimates = loadSavedEstimates();
    const estimate = estimates.find(est => est.id === id);
    
    if (estimate) {
        // Load form values
        document.getElementById('houseSize').value = estimate.houseSize;
        document.getElementById('damageType').value = estimate.baseCostPerMeter;
        document.getElementById('city').value = estimate.cityMultiplier;
        document.getElementById('finishLevel').value = estimate.finishMultiplier;
        
        // Load extras
        const extrasNames = estimate.extras?.map(e => e.name) || [];
        document.getElementById('solarPanels').checked = extrasNames.includes('ألواح شمسية');
        document.getElementById('lift').checked = extrasNames.includes('مصعد');
        document.getElementById('garden').checked = extrasNames.includes('حديقة');
        document.getElementById('security').checked = extrasNames.includes('نظام أمان');
        
        // Recalculate
        calculateCost();
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('savedEstimatesModal')).hide();
        
        showNotification('تم تحميل التقدير بنجاح', 'success');
    }
}

function deleteEstimate(id) {
    if (confirm('هل أنت متأكد من حذف هذا التقدير؟')) {
        let estimates = loadSavedEstimates();
        estimates = estimates.filter(est => est.id !== id);
        localStorage.setItem('baytnaEstimates', JSON.stringify(estimates));
        updateSavedCount();
        showSavedEstimates();
        showNotification('تم حذف التقدير بنجاح', 'success');
    }
}

function shareEstimate() {
    if (!window.currentEstimate) {
        alert('يرجى حساب التكلفة أولاً');
        return;
    }
    
    const est = window.currentEstimate;
    const shareText = `تقدير تكاليف إعادة الإعمار من منصة بيتنا:
    
المساحة: ${est.houseSize} م²
التكلفة الأساسية: ${formatNumber(est.baseCost)} شيكل
معامل الموقع: ${est.cityMultiplier.toFixed(2)}x
معامل التشطيب: ${est.finishMultiplier.toFixed(2)}x
الإضافات: ${est.extrasTotal > 0 ? formatNumber(est.extrasTotal) + ' شيكل' : 'لا يوجد'}
الإجمالي النهائي: ${formatNumber(est.finalTotal)} شيكل

تاريخ الحساب: ${est.date} ${est.time}

موقع بيتنا: baytna.ps`;

    if (navigator.share) {
        navigator.share({
            title: 'تقدير تكاليف إعادة الإعمار - بيتنا',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('تم نسخ التقدير إلى الحافظة', 'success');
        });
    }
}

function formatNumber(num) {
    return new Intl.NumberFormat('ar-EG').format(Math.round(num));
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Make functions available globally
window.loadEstimate = loadEstimate;
window.deleteEstimate = deleteEstimate;