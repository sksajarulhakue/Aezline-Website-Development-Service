// Slider Functionality

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize portfolio modal gallery
    if (document.querySelector('.modal-gallery')) {
        initModalGallery();
    }
});



// Portfolio Modal Gallery
function initModalGallery() {
    const modalGalleries = document.querySelectorAll('.modal-gallery');

    modalGalleries.forEach(gallery => {
        const images = gallery.querySelectorAll('img');

        if (images.length <= 1) return;

        // Create thumbnail navigation
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'gallery-thumbnails';

        images.forEach((img, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'gallery-thumbnail';
            if (index === 0) thumbnail.classList.add('active');

            const thumbImg = document.createElement('img');
            thumbImg.src = img.src;
            thumbImg.alt = img.alt;

            thumbnail.appendChild(thumbImg);
            thumbnailContainer.appendChild(thumbnail);

            // Hide all images except the first one
            if (index > 0) {
                img.style.display = 'none';
            }

            // Click event for thumbnails
            thumbnail.addEventListener('click', () => {
                // Hide all images
                images.forEach(image => {
                    image.style.display = 'none';
                });

                // Show selected image
                images[index].style.display = 'block';

                // Update active thumbnail
                document.querySelectorAll('.gallery-thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                thumbnail.classList.add('active');
            });
        });

        // Add navigation arrows
        const prevArrow = document.createElement('button');
        prevArrow.className = 'gallery-arrow gallery-prev';
        prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';

        const nextArrow = document.createElement('button');
        nextArrow.className = 'gallery-arrow gallery-next';
        nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';

        // Add navigation to gallery container
        gallery.appendChild(thumbnailContainer);
        gallery.appendChild(prevArrow);
        gallery.appendChild(nextArrow);

        // Add CSS for gallery navigation
        const style = document.createElement('style');
        style.textContent = `
            .modal-gallery {
                position: relative;
                margin-bottom: 20px;
            }

            .gallery-thumbnails {
                display: flex;
                justify-content: center;
                margin-top: 10px;
                gap: 10px;
                flex-wrap: wrap;
            }

            .gallery-thumbnail {
                width: 60px;
                height: 60px;
                border-radius: 5px;
                overflow: hidden;
                cursor: pointer;
                opacity: 0.6;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }

            .gallery-thumbnail.active {
                opacity: 1;
                border-color: var(--primary-color);
            }

            .gallery-thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .gallery-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: var(--primary-color);
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                z-index: 10;
                transition: all 0.3s ease;
            }

            .gallery-arrow:hover {
                background-color: var(--primary-dark);
                transform: translateY(-50%) scale(1.1);
            }

            .gallery-prev {
                left: 10px;
            }

            .gallery-next {
                right: 10px;
            }
        `;
        document.head.appendChild(style);

        // Set up gallery functionality
        let currentImage = 0;

        // Function to show a specific image
        function showImage(index) {
            if (index < 0) index = images.length - 1;
            if (index >= images.length) index = 0;

            currentImage = index;

            // Hide all images
            images.forEach(image => {
                image.style.display = 'none';
            });

            // Show current image
            images[currentImage].style.display = 'block';

            // Update active thumbnail
            document.querySelectorAll('.gallery-thumbnail').forEach((thumb, i) => {
                thumb.classList.toggle('active', i === currentImage);
            });
        }

        // Event listeners for arrows
        prevArrow.addEventListener('click', () => {
            showImage(currentImage - 1);
        });

        nextArrow.addEventListener('click', () => {
            showImage(currentImage + 1);
        });

        // Keyboard navigation
        document.addEventListener('keydown', e => {
            if (gallery.closest('.project-modal') && gallery.closest('.project-modal').classList.contains('active')) {
                if (e.key === 'ArrowLeft') {
                    showImage(currentImage - 1);
                } else if (e.key === 'ArrowRight') {
                    showImage(currentImage + 1);
                }
            }
        });
    });
}
