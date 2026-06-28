document.addEventListener('DOMContentLoaded', () => {
    const images = Array.from(document.querySelectorAll('.photo-grid .photo-item img'));
    if (images.length === 0) return;

    // Create lightbox HTML dynamically
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-close" aria-label="Fermer">&times;</div>
        <div class="lightbox-arrow lightbox-prev" aria-label="Image précédente">&#10094;</div>
        <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="Agrandissement photo">
            <div class="lightbox-counter"></div>
        </div>
        <div class="lightbox-arrow lightbox-next" aria-label="Image suivante">&#10095;</div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        if (currentIndex < 0 || currentIndex >= images.length) return;
        const img = images[currentIndex];
        
        // Add a temporary loading state
        lightboxImg.style.opacity = '0.3';
        
        const tempImg = new Image();
        tempImg.onload = () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || 'Photographie';
            lightboxImg.style.opacity = '1';
        };
        tempImg.src = img.src;
        
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
    }

    // Event listeners
    images.forEach((img, index) => {
        const item = img.closest('.photo-item');
        if (item) {
            item.addEventListener('click', () => openLightbox(index));
        } else {
            img.addEventListener('click', () => openLightbox(index));
        }
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });
    lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });

    // Close on click outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50; // min distance in px
        if (touchEndX < touchStartX - threshold) {
            showNext(); // swipe left -> next image
        } else if (touchEndX > touchStartX + threshold) {
            showPrev(); // swipe right -> prev image
        }
    }
});
