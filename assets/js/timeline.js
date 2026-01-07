// Timeline JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize timeline
    loadTimelineProgress();
    updateProgressDisplay();
    
    // Event Listeners
    document.getElementById('startJourney').addEventListener('click', startJourney);
    document.getElementById('resetTimeline').addEventListener('click', resetTimeline);
    document.getElementById('prevStage').addEventListener('click', goToPreviousStage);
    document.getElementById('nextStage').addEventListener('click', goToNextStage);
    document.getElementById('markAllComplete').addEventListener('click', markAllComplete);
    document.getElementById('printProgress').addEventListener('click', printProgress);
    
    // Checkbox event listeners
    document.querySelectorAll('.timeline-checklist input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateTaskProgress(this);
            updateProgressDisplay();
            saveTimelineProgress();
        });
    });
    
    // Update active stage on scroll
    window.addEventListener('scroll', updateActiveStage);
    updateActiveStage(); // Initial call
    
    // Smooth scroll for internal links
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Timeline data
const timelineStages = [
    {
        id: 1,
        title: "مرحلة التقييم والمعاينة",
        tasks: 3,
        duration: "3-5 أيام",
        cost: "500-1,500 شيكل"
    },
    {
        id: 2,
        title: "مرحلة التصميم والتراخيص",
        tasks: 3,
        duration: "2-4 أسابيع",
        cost: "2,000-5,000 شيكل"
    },
    {
        id: 3,
        title: "مرحلة الأعمال الإنشائية",
        tasks: 3,
        duration: "4-8 أسابيع",
        cost: "20,000-50,000 شيكل"
    },
    {
        id: 4,
        title: "مرحلة الأعمال الكهربائية",
        tasks: 3,
        duration: "1-2 أسبوع",
        cost: "5,000-15,000 شيكل"
    },
    {
        id: 5,
        title: "مرحلة الأعمال الصحية",
        tasks: 3,
        duration: "1-2 أسبوع",
        cost: "8,000-20,000 شيكل"
    },
    {
        id: 6,
        title: "مرحلة التشطيبات الداخلية",
        tasks: 3,
        duration: "3-6 أسابيع",
        cost: "15,000-40,000 شيكل"
    },
    {
        id: 7,
        title: "مرحلة التجهيزات النهائية",
        tasks: 3,
        duration: "1-2 أسبوع",
        cost: "10,000-25,000 شيكل"
    },
    {
        id: 8,
        title: "مرحلة الاستلام النهائي",
        tasks: 3,
        duration: "2-3 أيام",
        cost: "1,000-3,000 شيكل"
    }
];

let currentStage = 1;
const totalStages = timelineStages.length;
const totalTasks = timelineStages.reduce((sum, stage) => sum + stage.tasks, 0);

function startJourney() {
    // Activate first stage
    setActiveStage(1);
    
    // Scroll to first stage
    document.querySelector('[data-step="1"]').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
    
    showNotification('أهلاً بك في رحلة إعادة الإعمار!', 'success');
}

function resetTimeline() {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع التقدم؟ سيتم حذف جميع البيانات المحفوظة.')) {
        // Reset all checkboxes
        document.querySelectorAll('.timeline-checklist input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.disabled = false;
        });
        
        // Reset stage states
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.remove('active', 'completed');
        });
        
        // Reset current stage
        currentStage = 1;
        setActiveStage(1);
        
        // Clear localStorage
        localStorage.removeItem('baytnaTimelineProgress');
        
        // Update display
        updateProgressDisplay();
        
        showNotification('تم إعادة تعيين الجدول الزمني بنجاح', 'success');
    }
}

function setActiveStage(stageNumber) {
    // Update current stage
    currentStage = stageNumber;
    
    // Update all stages
    document.querySelectorAll('.timeline-item').forEach(item => {
        const itemStage = parseInt(item.getAttribute('data-step'));
        
        item.classList.remove('active', 'completed');
        
        if (itemStage < stageNumber) {
            item.classList.add('completed');
            // Enable all checkboxes in completed stages
            const checkboxes = item.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.disabled = false);
        } else if (itemStage === stageNumber) {
            item.classList.add('active');
            // Enable checkboxes for current stage
            const checkboxes = item.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.disabled = false);
        } else {
            // Disable checkboxes for future stages
            const checkboxes = item.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.disabled = true);
        }
    });
    
    // Update navigation buttons
    document.getElementById('prevStage').disabled = (stageNumber === 1);
    document.getElementById('nextStage').disabled = (stageNumber === totalStages);
    
    // Update display
    document.getElementById('activeStage').textContent = stageNumber;
    updateProgressDisplay();
}

function goToPreviousStage() {
    if (currentStage > 1) {
        setActiveStage(currentStage - 1);
        
        // Scroll to the stage
        document.querySelector(`[data-step="${currentStage}"]`).scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function goToNextStage() {
    // Check if current stage tasks are completed
    const currentStageElement = document.querySelector(`[data-step="${currentStage}"]`);
    const checkboxes = currentStageElement.querySelectorAll('input[type="checkbox"]');
    const completedTasks = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    if (completedTasks < checkboxes.length) {
        if (!confirm('لم تكمل جميع المهام في هذه المرحلة. هل تريد المتابعة إلى المرحلة التالية؟')) {
            return;
        }
    }
    
    if (currentStage < totalStages) {
        setActiveStage(currentStage + 1);
        
        // Scroll to the stage
        document.querySelector(`[data-step="${currentStage}"]`).scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function updateTaskProgress(checkbox) {
    const taskId = checkbox.getAttribute('data-task');
    const stageId = taskId.split('-')[0];
    const stageElement = document.querySelector(`[data-step="${stageId}"]`);
    
    // Get all checkboxes in this stage
    const stageCheckboxes = stageElement.querySelectorAll('input[type="checkbox"]');
    const completedTasks = Array.from(stageCheckboxes).filter(cb => cb.checked).length;
    
    // Update stage status if all tasks are completed
    if (completedTasks === stageCheckboxes.length && parseInt(stageId) === currentStage) {
        // Automatically move to next stage after a delay
        setTimeout(() => {
            if (currentStage < totalStages) {
                setActiveStage(currentStage + 1);
                showNotification(`مبروك! لقد أكملت المرحلة ${stageId}. تم التقدم إلى المرحلة ${currentStage}`, 'success');
            }
        }, 1000);
    }
}

function updateProgressDisplay() {
    // Calculate completed tasks
    const allCheckboxes = document.querySelectorAll('.timeline-checklist input[type="checkbox"]');
    const completedCheckboxes = Array.from(allCheckboxes).filter(cb => cb.checked);
    const completedTasks = completedCheckboxes.length;
    
    // Calculate completed stages
    const completedStages = timelineStages.filter(stage => {
        const stageCheckboxes = document.querySelectorAll(`[data-step="${stage.id}"] input[type="checkbox"]`);
        const completedStageTasks = Array.from(stageCheckboxes).filter(cb => cb.checked).length;
        return completedStageTasks === stage.tasks;
    }).length;
    
    // Calculate progress percentage
    const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
    
    // Update UI
    document.getElementById('completedStages').textContent = completedStages;
    document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;
    document.getElementById('progressFill').style.width = `${progressPercentage}%`;
    document.getElementById('progressFill').setAttribute('aria-valuenow', progressPercentage);
    document.getElementById('progressText').textContent = `${completedTasks} من ${totalTasks} مهمة مكتملة`;
    
    // Calculate estimated time
    const estimatedDays = calculateEstimatedTime(completedStages);
    document.getElementById('progressETA').textContent = `الوقت المقدر: ${estimatedDays} يوم`;
    
    // Update stage status badges
    timelineStages.forEach(stage => {
        const stageElement = document.querySelector(`[data-step="${stage.id}"]`);
        const statusBadge = stageElement.querySelector('.timeline-status');
        const stageCheckboxes = stageElement.querySelectorAll('input[type="checkbox"]');
        const completedStageTasks = Array.from(stageCheckboxes).filter(cb => cb.checked).length;
        
        if (completedStageTasks === stage.tasks) {
            statusBadge.textContent = 'مكتمل';
            statusBadge.className = 'timeline-status badge bg-success';
        } else if (parseInt(stage.id) === currentStage) {
            statusBadge.textContent = 'جاري التنفيذ';
            statusBadge.className = 'timeline-status badge bg-primary';
        } else if (parseInt(stage.id) < currentStage) {
            statusBadge.textContent = 'قيد التنفيذ';
            statusBadge.className = 'timeline-status badge bg-warning';
        } else {
            statusBadge.textContent = 'قيد الانتظار';
            statusBadge.className = 'timeline-status badge bg-secondary';
        }
    });
}

function calculateEstimatedTime(completedStages) {
    let totalDays = 0;
    
    // Add days for remaining stages
    for (let i = completedStages; i < timelineStages.length; i++) {
        const stage = timelineStages[i];
        const duration = stage.duration;
        
        // Parse duration string to get days
        if (duration.includes('أيام')) {
            const days = parseInt(duration.split('-')[0]);
            totalDays += days;
        } else if (duration.includes('أسبوع')) {
            const weeks = parseInt(duration.split('-')[0]);
            totalDays += weeks * 7;
        }
    }
    
    return totalDays;
}

function markAllComplete() {
    if (confirm('هل تريد تعيين جميع المهام كمكتملة؟ هذا سيحدد أنك أكملت جميع المراحل.')) {
        document.querySelectorAll('.timeline-checklist input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
            checkbox.disabled = false;
        });
        
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.add('completed');
            item.classList.remove('active');
        });
        
        currentStage = totalStages;
        setActiveStage(totalStages);
        updateProgressDisplay();
        saveTimelineProgress();
        
        showNotification('تهانينا! لقد أكملت جميع مراحل إعادة الإعمار!', 'success');
    }
}

function printProgress() {
    window.print();
}

function updateActiveStage() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const scrollPosition = window.scrollY + (window.innerHeight / 3);
    
    let activeStage = 1;
    
    timelineItems.forEach(item => {
        const itemTop = item.offsetTop;
        const itemHeight = item.offsetHeight;
        
        if (scrollPosition >= itemTop && scrollPosition < (itemTop + itemHeight)) {
            activeStage = parseInt(item.getAttribute('data-step'));
        }
    });
    
    if (activeStage !== currentStage) {
        // Only update if the stage is not locked (user has completed previous stages)
        const previousStagesCompleted = timelineStages
            .slice(0, activeStage - 1)
            .every(stage => {
                const stageCheckboxes = document.querySelectorAll(`[data-step="${stage.id}"] input[type="checkbox"]`);
                const completedStageTasks = Array.from(stageCheckboxes).filter(cb => cb.checked).length;
                return completedStageTasks === stage.tasks;
            });
        
        if (previousStagesCompleted || activeStage === 1) {
            setActiveStage(activeStage);
        }
    }
}

function saveTimelineProgress() {
    const progress = {
        currentStage: currentStage,
        tasks: {}
    };
    
    // Save all checkbox states
    document.querySelectorAll('.timeline-checklist input[type="checkbox"]').forEach(checkbox => {
        const taskId = checkbox.getAttribute('data-task');
        progress.tasks[taskId] = checkbox.checked;
    });
    
    localStorage.setItem('baytnaTimelineProgress', JSON.stringify(progress));
}

function loadTimelineProgress() {
    const savedProgress = localStorage.getItem('baytnaTimelineProgress');
    
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        currentStage = progress.currentStage || 1;
        
        // Load checkbox states
        Object.keys(progress.tasks || {}).forEach(taskId => {
            const checkbox = document.querySelector(`[data-task="${taskId}"]`);
            if (checkbox) {
                checkbox.checked = progress.tasks[taskId];
            }
        });
        
        // Set active stage
        setActiveStage(currentStage);
    } else {
        // Default to first stage
        setActiveStage(1);
    }
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

// Make functions available globally if needed
window.resetTimeline = resetTimeline;
window.markAllComplete = markAllComplete;
window.printProgress = printProgress;