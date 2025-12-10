// Presentation Navigation Script

let currentSlide = 1;
const totalSlides = 9;

// Initialize presentation
document.addEventListener('DOMContentLoaded', function() {
    updateSlide();
    updateProgress();
    updateDots();
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            changeSlide(1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            changeSlide(-1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSlide(1);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSlide(totalSlides);
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            changeSlide(1); // Swipe left - next slide
        }
        if (touchEndX > touchStartX + 50) {
            changeSlide(-1); // Swipe right - previous slide
        }
    }
    
    // Auto-play option (can be toggled)
    // Uncomment to enable auto-play
    // setInterval(() => {
    //     if (currentSlide < totalSlides) {
    //         changeSlide(1);
    //     }
    // }, 10000); // 10 seconds per slide
});

function changeSlide(direction) {
    const newSlide = currentSlide + direction;
    
    if (newSlide < 1) {
        currentSlide = totalSlides;
    } else if (newSlide > totalSlides) {
        currentSlide = 1;
    } else {
        currentSlide = newSlide;
    }
    
    updateSlide();
    updateProgress();
    updateDots();
}

function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
        currentSlide = slideNumber;
        updateSlide();
        updateProgress();
        updateDots();
    }
}

function updateSlide() {
    // Hide all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    const currentSlideElement = document.querySelector(`[data-slide="${currentSlide}"]`);
    if (currentSlideElement) {
        currentSlideElement.classList.add('active');
        
        // Re-trigger animations for current slide
        const animatedElements = currentSlideElement.querySelectorAll('[class*="animate-"]');
        animatedElements.forEach((el, index) => {
            el.style.animation = 'none';
            setTimeout(() => {
                el.style.animation = null;
            }, 10);
        });
    }
    
    // Update slide indicator (if exists)
    const slideIndicator = document.getElementById('current-slide');
    if (slideIndicator) {
        slideIndicator.textContent = currentSlide;
    }
    
    // Update navigation active state
    updateNavActiveState();
}

function updateNavActiveState() {
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-external)');
    navLinks.forEach((link, index) => {
        if (index + 1 === currentSlide) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function updateProgress() {
    const progressBar = document.getElementById('progress-fill');
    if (progressBar) {
        const progress = (currentSlide / totalSlides) * 100;
        progressBar.style.width = progress + '%';
    }
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index + 1 === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Add smooth scroll behavior
document.querySelectorAll('.slide').forEach(slide => {
    slide.style.scrollBehavior = 'smooth';
});

// Add click handlers for overview cards to navigate to relevant slides
document.addEventListener('DOMContentLoaded', function() {
    const overviewCards = document.querySelectorAll('.overview-card');
    if (overviewCards.length >= 4) {
        overviewCards[0].addEventListener('click', () => goToSlide(4)); // Technical
        overviewCards[1].addEventListener('click', () => goToSlide(5)); // Functional
        overviewCards[2].addEventListener('click', () => goToSlide(6)); // Integrity
        overviewCards[3].addEventListener('click', () => goToSlide(7)); // Accuracy
    }
});

// Fullscreen Presentation Mode
function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        // Enter fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        document.body.classList.add('fullscreen-mode');
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        document.body.classList.remove('fullscreen-mode');
    }
}

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
        document.body.classList.remove('fullscreen-mode');
    }
});

document.addEventListener('webkitfullscreenchange', function() {
    if (!document.webkitFullscreenElement) {
        document.body.classList.remove('fullscreen-mode');
    }
});

document.addEventListener('msfullscreenchange', function() {
    if (!document.msFullscreenElement) {
        document.body.classList.remove('fullscreen-mode');
    }
});

// Download Code as ZIP
async function downloadCode() {
    // Check if JSZip is loaded
    if (typeof JSZip === 'undefined') {
        alert('Loading download library... Please try again in a moment.');
        return;
    }
    
    const zip = new JSZip();
    
    // List of files to include
    const files = [
        { name: 'index.html', url: 'index.html' },
        { name: 'presentation-styles.css', url: 'presentation-styles.css' },
        { name: 'presentation-script.js', url: 'presentation-script.js' },
        { name: 'Validation_Checklist.html', url: 'Validation_Checklist.html' },
        { name: 'checklist-styles.css', url: 'checklist-styles.css' },
        { name: 'checklist-script.js', url: 'checklist-script.js' },
        { name: 'apps-logo.svg', url: 'apps-logo.svg' },
        { name: 'Context.md', url: 'Context.md' },
        { name: 'README_Presentation.md', url: 'README_Presentation.md' },
        { name: 'README_Checklist.md', url: 'README_Checklist.md' },
        { name: 'CHANGELOG.md', url: 'CHANGELOG.md' },
        { name: 'HOSTING_GUIDE.md', url: 'HOSTING_GUIDE.md' }
    ];
    
    try {
        // Show loading message
        const loadingMsg = document.createElement('div');
        loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:20px 40px;border-radius:10px;z-index:10000;';
        loadingMsg.textContent = 'Preparing download...';
        document.body.appendChild(loadingMsg);
        
        // Fetch all files
        const filePromises = files.map(async (file) => {
            try {
                const response = await fetch(file.url);
                if (response.ok) {
                    const content = await response.text();
                    zip.file(file.name, content);
                    return { success: true, name: file.name };
                } else {
                    console.warn(`Could not fetch ${file.name}`);
                    return { success: false, name: file.name };
                }
            } catch (error) {
                console.error(`Error fetching ${file.name}:`, error);
                // Try to get current page content for HTML file
                if (file.name === 'index.html') {
                    zip.file(file.name, document.documentElement.outerHTML);
                    return { success: true, name: file.name };
                }
                return { success: false, name: file.name };
            }
        });
        
        await Promise.all(filePromises);
        
        // Generate ZIP
        const blob = await zip.generateAsync({type: 'blob'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Report_Validation_Standards.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Remove loading message
        document.body.removeChild(loadingMsg);
        
        alert('Download complete! Check your downloads folder.');
    } catch (error) {
        console.error('Error creating ZIP:', error);
        alert('Error creating ZIP file. Please ensure you are accessing the site via HTTP/HTTPS (not file://).\n\nFor local testing, use a local server or host on GitHub Pages.');
    }
}

