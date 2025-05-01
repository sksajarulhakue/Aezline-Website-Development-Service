// Blog Single Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog single page functionality
    initBlogSingle();
});

// Initialize blog single page functionality
function initBlogSingle() {
    // Initialize comment form
    initCommentForm();

    // Initialize reply buttons
    initReplyButtons();

    // Initialize share buttons
    initShareButtons();

    // Initialize reading progress indicator
    initReadingProgress();

    // Initialize table of contents
    initTableOfContents();

    // Initialize image lightbox
    initImageLightbox();

    // Initialize text-to-speech
    initTextToSpeech();

    // Initialize related posts slider
    initRelatedPostsSlider();

    // Initialize bookmark functionality
    initBookmarkButton();

    // Initialize code syntax highlighting
    initCodeHighlighting();
}

// Initialize comment form
function initCommentForm() {
    const commentForm = document.getElementById('comment-form');

    if (!commentForm) return;

    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('comment-name').value.trim();
        const email = document.getElementById('comment-email').value.trim();
        const message = document.getElementById('comment-message').value.trim();
        const saveInfo = document.getElementById('save-info').checked;

        // Validate form
        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Show loading state
        const submitButton = commentForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Create new comment element
            const commentsContainer = document.querySelector('.comments-list');
            const newComment = document.createElement('div');
            newComment.className = 'comment';

            // Use default avatar if no specific one is available
            newComment.innerHTML = `
                <div class="comment-avatar">
                    <img src="images/blog/avatar-default.jpg" alt="${name}">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <h4 class="comment-author">${name}</h4>
                        <div class="comment-date">Just now</div>
                    </div>
                    <div class="comment-body">
                        <p>${message}</p>
                    </div>
                    <div class="comment-actions">
                        <button class="reply-btn">Reply</button>
                    </div>
                </div>
            `;

            // Add new comment to the top of the list
            commentsContainer.appendChild(newComment);

            // Scroll to the new comment
            newComment.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Reset form
            if (!saveInfo) {
                commentForm.reset();
            } else {
                document.getElementById('comment-message').value = '';
            }

            // Update comment count
            const commentCount = document.querySelector('.section-title');
            if (commentCount) {
                const currentCount = parseInt(commentCount.textContent.match(/\d+/)[0]);
                commentCount.textContent = `Comments (${currentCount + 1})`;
            }

            // Restore button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;

            // Initialize reply button for new comment
            const newReplyBtn = newComment.querySelector('.reply-btn');
            if (newReplyBtn) {
                initSingleReplyButton(newReplyBtn);
            }

        }, 1500);
    });
}

// Initialize reply buttons
function initReplyButtons() {
    const replyButtons = document.querySelectorAll('.reply-btn');

    replyButtons.forEach(button => {
        initSingleReplyButton(button);
    });
}

// Initialize a single reply button
function initSingleReplyButton(button) {
    button.addEventListener('click', function() {
        // Get comment author
        const commentAuthor = this.closest('.comment-content').querySelector('.comment-author').textContent;

        // Create reply form if it doesn't exist
        if (!document.querySelector('.reply-form')) {
            const replyForm = document.createElement('div');
            replyForm.className = 'reply-form';
            replyForm.innerHTML = `
                <form class="comment-form" id="reply-form">
                    <div class="form-group">
                        <label for="reply-message">Reply to ${commentAuthor}</label>
                        <textarea id="reply-message" name="message" rows="3" required></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary cancel-reply">Cancel</button>
                        <button type="submit" class="btn btn-primary">Post Reply</button>
                    </div>
                </form>
            `;

            // Insert reply form after the comment actions
            this.closest('.comment-actions').after(replyForm);

            // Focus on textarea
            document.getElementById('reply-message').focus();

            // Add cancel button event listener
            document.querySelector('.cancel-reply').addEventListener('click', function() {
                replyForm.remove();
            });

            // Add submit event listener
            document.getElementById('reply-form').addEventListener('submit', function(e) {
                e.preventDefault();

                // Get reply message
                const replyMessage = document.getElementById('reply-message').value.trim();

                if (!replyMessage) return;

                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                submitButton.disabled = true;

                // Simulate API call
                setTimeout(() => {
                    // Create new reply
                    const comment = this.closest('.comment');
                    const newReply = document.createElement('div');
                    newReply.className = 'comment reply';

                    // Use author image if available, otherwise use default
                    const authorImage = document.querySelector('.article-author-bio .author-image img');
                    const authorName = document.querySelector('.article-author-bio h4');

                    newReply.innerHTML = `
                        <div class="comment-avatar">
                            <img src="${authorImage ? authorImage.src : 'images/blog/avatar-default.jpg'}" alt="${authorName ? authorName.textContent : 'You'}">
                        </div>
                        <div class="comment-content">
                            <div class="comment-header">
                                <h4 class="comment-author">${authorName ? authorName.textContent : 'You'}</h4>
                                <div class="comment-date">Just now</div>
                            </div>
                            <div class="comment-body">
                                <p>${replyMessage}</p>
                            </div>
                            <div class="comment-actions">
                                <button class="reply-btn">Reply</button>
                            </div>
                        </div>
                    `;

                    // Insert new reply after the comment
                    comment.after(newReply);

                    // Remove reply form
                    replyForm.remove();

                    // Scroll to the new reply
                    newReply.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Update comment count
                    const commentCount = document.querySelector('.section-title');
                    if (commentCount) {
                        const currentCount = parseInt(commentCount.textContent.match(/\d+/)[0]);
                        commentCount.textContent = `Comments (${currentCount + 1})`;
                    }

                    // Initialize reply button for new reply
                    const newReplyBtn = newReply.querySelector('.reply-btn');
                    if (newReplyBtn) {
                        initSingleReplyButton(newReplyBtn);
                    }

                }, 1500);
            });
        } else {
            // Remove existing reply form
            document.querySelector('.reply-form').remove();
        }
    });
}

// Initialize share buttons
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-button');

    if (!shareButtons.length) return;

    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Get article info
            const articleTitle = document.querySelector('.article-title').textContent;
            const articleUrl = window.location.href;

            // Determine share URL based on platform
            let shareUrl = '';

            if (this.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
            } else if (this.classList.contains('twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(articleUrl)}`;
            } else if (this.classList.contains('linkedin')) {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
            } else if (this.classList.contains('pinterest')) {
                // Get featured image
                const featuredImage = document.querySelector('.article-featured-image img');
                const imageUrl = featuredImage ? featuredImage.src : '';

                shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(articleUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(articleTitle)}`;
            }

            // Open share dialog
            if (shareUrl) {
                window.open(shareUrl, 'share-dialog', 'width=800,height=600');
            }
        });
    });
}

// Initialize reading progress indicator
function initReadingProgress() {
    // Create progress bar if it doesn't exist
    if (!document.querySelector('.reading-progress')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .reading-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 0;
                height: 4px;
                background-color: var(--primary-color, #3b82f6);
                z-index: 1000;
                transition: width 0.1s ease;
            }

            body.dark-mode .reading-progress {
                background-color: var(--primary-color, #3b82f6);
            }
        `;
        document.head.appendChild(style);
    }

    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const articleBody = document.querySelector('.article-body');
        if (!articleBody) return;

        const windowHeight = window.innerHeight;
        const fullHeight = articleBody.offsetHeight;
        const scrolled = window.scrollY - articleBody.offsetTop + windowHeight;

        let percent = Math.min(100, Math.max(0, (scrolled / fullHeight) * 100));

        document.querySelector('.reading-progress').style.width = `${percent}%`;
    });
}

// Initialize table of contents
function initTableOfContents() {
    const articleBody = document.querySelector('.article-body');
    if (!articleBody) return;

    // Get all headings in the article
    const headings = articleBody.querySelectorAll('h2');
    if (headings.length < 3) return; // Only create TOC if there are enough headings

    // Create TOC container
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    tocContainer.innerHTML = `
        <div class="toc-header">
            <h3>Table of Contents</h3>
            <button class="toc-toggle"><i class="fas fa-chevron-down"></i></button>
        </div>
        <div class="toc-content">
            <ul class="toc-list"></ul>
        </div>
    `;

    // Add TOC to the article
    articleBody.insertBefore(tocContainer, articleBody.querySelector('p'));

    const tocList = tocContainer.querySelector('.toc-list');

    // Add IDs to headings and create TOC items
    headings.forEach((heading, index) => {
        // Create ID from heading text
        const id = 'heading-' + index;
        heading.id = id;

        // Create TOC item
        const tocItem = document.createElement('li');
        tocItem.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
        tocList.appendChild(tocItem);

        // Add click event to scroll smoothly
        tocItem.querySelector('a').addEventListener('click', function(e) {
            e.preventDefault();
            const targetHeading = document.getElementById(id);
            window.scrollTo({
                top: targetHeading.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });

    // Add toggle functionality
    const tocToggle = tocContainer.querySelector('.toc-toggle');
    const tocContent = tocContainer.querySelector('.toc-content');

    tocToggle.addEventListener('click', function() {
        tocContent.classList.toggle('collapsed');
        this.querySelector('i').classList.toggle('fa-chevron-down');
        this.querySelector('i').classList.toggle('fa-chevron-up');
    });

    // Highlight current section on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;

        // Find the current heading
        let currentHeadingIndex = -1;
        headings.forEach((heading, index) => {
            if (scrollPosition >= heading.offsetTop - 150) {
                currentHeadingIndex = index;
            }
        });

        // Highlight current TOC item
        const tocItems = tocList.querySelectorAll('li');
        tocItems.forEach((item, index) => {
            if (index === currentHeadingIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });
}

// Initialize image lightbox
function initImageLightbox() {
    const articleImages = document.querySelectorAll('.article-image img');

    articleImages.forEach(image => {
        // Make images clickable
        image.style.cursor = 'zoom-in';

        // Add click event
        image.addEventListener('click', function() {
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'image-lightbox';

            // Create lightbox content
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${this.src}" alt="${this.alt}">
                    ${this.nextElementSibling ? `<div class="lightbox-caption">${this.nextElementSibling.textContent}</div>` : ''}
                    <button class="lightbox-close"><i class="fas fa-times"></i></button>
                </div>
            `;

            // Add to body
            document.body.appendChild(lightbox);
            document.body.classList.add('lightbox-open');

            // Add close button event
            lightbox.querySelector('.lightbox-close').addEventListener('click', function() {
                lightbox.remove();
                document.body.classList.remove('lightbox-open');
            });

            // Close on click outside image
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    lightbox.remove();
                    document.body.classList.remove('lightbox-open');
                }
            });
        });
    });
}

// Initialize text-to-speech
function initTextToSpeech() {
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) return;

    const articleTitle = document.querySelector('.article-title');
    const articleBody = document.querySelector('.article-body');

    if (!articleTitle || !articleBody) return;

    // Create text-to-speech button
    const ttsButton = document.createElement('button');
    ttsButton.className = 'tts-button';
    ttsButton.innerHTML = '<i class="fas fa-volume-up"></i> Listen to Article';
    ttsButton.title = 'Listen to this article';

    // Add button after article title
    const articleMeta = document.querySelector('.article-meta');
    if (articleMeta) {
        articleMeta.after(ttsButton);
    }

    // Variables for speech synthesis
    let speaking = false;
    let paused = false;
    let utterance = null;

    // Add click event
    ttsButton.addEventListener('click', function() {
        if (!speaking && !paused) {
            // Start speaking
            startSpeech();
        } else if (speaking && !paused) {
            // Pause speaking
            window.speechSynthesis.pause();
            paused = true;
            speaking = false;
            ttsButton.innerHTML = '<i class="fas fa-play"></i> Continue Listening';
        } else if (!speaking && paused) {
            // Resume speaking
            window.speechSynthesis.resume();
            paused = false;
            speaking = true;
            ttsButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }
    });

    // Function to start speech
    function startSpeech() {
        // Get text to speak
        const title = articleTitle.textContent;
        const paragraphs = articleBody.querySelectorAll('p');
        let text = title + '. ';

        paragraphs.forEach(p => {
            text += p.textContent + ' ';
        });

        // Create utterance
        utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Add events
        utterance.onstart = function() {
            speaking = true;
            ttsButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
        };

        utterance.onend = function() {
            speaking = false;
            paused = false;
            ttsButton.innerHTML = '<i class="fas fa-volume-up"></i> Listen to Article';
        };

        utterance.onerror = function() {
            speaking = false;
            paused = false;
            ttsButton.innerHTML = '<i class="fas fa-volume-up"></i> Listen to Article';
            console.error('Speech synthesis error');
        };

        // Start speaking
        window.speechSynthesis.speak(utterance);
    }

    // Cancel speech when navigating away
    window.addEventListener('beforeunload', function() {
        if (speaking || paused) {
            window.speechSynthesis.cancel();
        }
    });
}

// Initialize related posts slider
function initRelatedPostsSlider() {
    const relatedPostsGrid = document.querySelector('.related-posts-grid');
    if (!relatedPostsGrid) return;

    // Add navigation buttons
    const prevButton = document.createElement('button');
    prevButton.className = 'related-posts-nav prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';

    const nextButton = document.createElement('button');
    nextButton.className = 'related-posts-nav next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';

    // Add buttons to related posts section
    const relatedPosts = document.querySelector('.related-posts');
    relatedPosts.style.position = 'relative';
    relatedPosts.appendChild(prevButton);
    relatedPosts.appendChild(nextButton);

    // Add scroll functionality
    let scrollAmount = 0;
    const scrollStep = 300;

    nextButton.addEventListener('click', function() {
        scrollAmount += scrollStep;
        if (scrollAmount > relatedPostsGrid.scrollWidth - relatedPostsGrid.clientWidth) {
            scrollAmount = relatedPostsGrid.scrollWidth - relatedPostsGrid.clientWidth;
        }
        relatedPostsGrid.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    prevButton.addEventListener('click', function() {
        scrollAmount -= scrollStep;
        if (scrollAmount < 0) {
            scrollAmount = 0;
        }
        relatedPostsGrid.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Update button states on scroll
    relatedPostsGrid.addEventListener('scroll', function() {
        if (this.scrollLeft <= 0) {
            prevButton.classList.add('disabled');
        } else {
            prevButton.classList.remove('disabled');
        }

        if (this.scrollLeft >= this.scrollWidth - this.clientWidth) {
            nextButton.classList.add('disabled');
        } else {
            nextButton.classList.remove('disabled');
        }
    });

    // Initial button state
    prevButton.classList.add('disabled');
    if (relatedPostsGrid.scrollWidth <= relatedPostsGrid.clientWidth) {
        nextButton.classList.add('disabled');
    }
}

// Initialize bookmark button
function initBookmarkButton() {
    const articleTitle = document.querySelector('.article-title');
    if (!articleTitle) return;

    // Get article info
    const title = articleTitle.textContent;
    const excerpt = document.querySelector('.article-intro')?.textContent || '';
    const image = document.querySelector('.article-featured-image img')?.src || '';
    const category = document.querySelector('.article-category')?.textContent || '';
    const url = window.location.href;

    // Get saved bookmarks
    const savedBookmarks = localStorage.getItem('blogBookmarks');
    const bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];

    // Check if article is already bookmarked
    const isBookmarked = bookmarks.some(bookmark => bookmark.title === title);

    // Create bookmark button
    const bookmarkButton = document.createElement('button');
    bookmarkButton.className = 'article-bookmark-button';
    bookmarkButton.innerHTML = isBookmarked ?
        '<i class="fas fa-bookmark"></i> Bookmarked' :
        '<i class="far fa-bookmark"></i> Bookmark Article';
    bookmarkButton.title = isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks';

    // Add button to article header
    const articleHeader = document.querySelector('.article-header .container');
    if (articleHeader) {
        articleHeader.appendChild(bookmarkButton);
    }

    // Add click event
    bookmarkButton.addEventListener('click', function() {
        // Toggle bookmark
        const postData = {
            title: title,
            excerpt: excerpt,
            image: image,
            link: url,
            category: category,
            date: new Date().toISOString()
        };

        const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.title === title);

        if (bookmarkIndex === -1) {
            // Add to bookmarks
            bookmarks.push(postData);
            bookmarkButton.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';
            bookmarkButton.title = 'Remove from bookmarks';

            // Show toast notification
            showToast('Article added to bookmarks', 'success');
        } else {
            // Remove from bookmarks
            bookmarks.splice(bookmarkIndex, 1);
            bookmarkButton.innerHTML = '<i class="far fa-bookmark"></i> Bookmark Article';
            bookmarkButton.title = 'Add to bookmarks';

            // Show toast notification
            showToast('Article removed from bookmarks', 'info');
        }

        // Save to localStorage
        localStorage.setItem('blogBookmarks', JSON.stringify(bookmarks));
    });
}

// Initialize code syntax highlighting
function initCodeHighlighting() {
    const codeBlocks = document.querySelectorAll('pre code');
    if (!codeBlocks.length) return;

    // Add syntax highlighting classes
    codeBlocks.forEach(block => {
        // Add line numbers
        const lines = block.textContent.split('\n');
        let numberedLines = '';

        lines.forEach((line, index) => {
            if (index < lines.length - 1 || line.trim() !== '') {
                numberedLines += `<div class="code-line"><span class="line-number">${index + 1}</span>${line}</div>`;
            }
        });

        block.innerHTML = numberedLines;

        // Add copy button
        const pre = block.parentElement;
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
        pre.appendChild(copyButton);

        // Add copy functionality
        copyButton.addEventListener('click', function() {
            const code = lines.join('\n');
            navigator.clipboard.writeText(code).then(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            }).catch(err => {
                console.error('Could not copy code: ', err);
            });
        });
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Add icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle toast-icon"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle toast-icon"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle toast-icon"></i>';
            break;
    }

    toast.innerHTML = `${icon}${message}`;

    // Add to container
    toastContainer.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Newsletter subscription for sidebar (reusing from blog.js)
document.addEventListener('DOMContentLoaded', function() {
    const sidebarForm = document.getElementById('sidebar-newsletter-form');

    if (sidebarForm) {
        sidebarForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = document.getElementById('sidebar-newsletter-email');
            const messageContainer = document.getElementById('sidebar-newsletter-message');

            if (!emailInput || !messageContainer) return;

            const email = emailInput.value.trim();

            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                messageContainer.textContent = 'Please enter a valid email address.';
                messageContainer.className = 'newsletter-message error';
                return;
            }

            // Simulate API call
            messageContainer.textContent = 'Subscribing...';
            messageContainer.className = 'newsletter-message info';

            setTimeout(() => {
                // Success message
                messageContainer.textContent = 'Thank you for subscribing to our newsletter!';
                messageContainer.className = 'newsletter-message success';

                // Clear input
                emailInput.value = '';

                // Clear message after 5 seconds
                setTimeout(() => {
                    messageContainer.textContent = '';
                    messageContainer.className = 'newsletter-message';
                }, 5000);
            }, 1500);
        });
    }
});
