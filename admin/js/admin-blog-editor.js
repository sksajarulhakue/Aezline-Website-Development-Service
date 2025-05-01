// Admin Blog Editor

document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog editor
    initBlogEditor();
});

// Initialize blog editor
function initBlogEditor() {
    // Initialize Quill editor
    initQuillEditor();

    // Initialize image upload preview
    initImageUpload();

    // Initialize tag input
    initTagInput();

    // Initialize excerpt character counter
    initExcerptCounter();

    // Initialize form submission
    initFormSubmission();

    // Check if editing existing post
    checkForExistingPost();
}

// Initialize excerpt character counter
function initExcerptCounter() {
    const excerptTextarea = document.getElementById('blog-excerpt');
    if (!excerptTextarea) return;

    // Create counter element
    const counterContainer = document.createElement('div');
    counterContainer.className = 'excerpt-counter';
    counterContainer.innerHTML = '<span>0</span>/160 characters';

    // Insert counter after textarea
    excerptTextarea.parentNode.insertBefore(counterContainer, excerptTextarea.nextSibling);

    // Update counter on input
    excerptTextarea.addEventListener('input', function() {
        const count = this.value.length;
        const counterSpan = counterContainer.querySelector('span');
        counterSpan.textContent = count;

        // Add warning class if over limit
        if (count > 160) {
            counterContainer.classList.add('warning');
        } else {
            counterContainer.classList.remove('warning');
        }
    });

    // Trigger initial count
    excerptTextarea.dispatchEvent(new Event('input'));
}

// Quill editor instance
let quill;

// Initialize Quill editor
function initQuillEditor() {
    // Create Quill editor if the container exists
    const editorContainer = document.getElementById('blog-editor');
    if (!editorContainer) return;

    // Quill toolbar options
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image']
    ];

    // Initialize Quill
    quill = new Quill('#blog-editor', {
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: 'Write your blog post content here...',
        theme: 'snow'
    });

    // Update hidden textarea with Quill content on change
    quill.on('text-change', function() {
        const contentTextarea = document.getElementById('blog-content');
        if (contentTextarea) {
            contentTextarea.value = quill.root.innerHTML;
        }
    });
}

// Initialize image upload preview
function initImageUpload() {
    const imageInput = document.getElementById('blog-image');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');

    if (!imageInput || !imagePreview || !previewImg) return;

    imageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();

            reader.onload = function(e) {
                previewImg.src = e.target.result;
                imagePreview.style.display = 'block';
            };

            reader.readAsDataURL(this.files[0]);
        } else {
            previewImg.src = '#';
            imagePreview.style.display = 'none';
        }
    });
}

// Initialize tag input
function initTagInput() {
    const tagInput = document.getElementById('tag-input');
    const tagInputField = document.getElementById('tag-input-field');
    const tagsHiddenInput = document.getElementById('blog-tags');

    if (!tagInput || !tagInputField || !tagsHiddenInput) return;

    // Current tags array
    let tags = [];

    // Add tag on Enter key
    tagInputField.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            const tag = this.value.trim();

            if (tag && !tags.includes(tag)) {
                // Add tag to array
                tags.push(tag);

                // Update hidden input
                tagsHiddenInput.value = JSON.stringify(tags);

                // Create tag element
                const tagElement = document.createElement('div');
                tagElement.className = 'tag';
                tagElement.innerHTML = `
                    ${tag}
                    <span class="remove-tag" data-tag="${tag}">×</span>
                `;

                // Add tag element before input field
                tagInput.insertBefore(tagElement, tagInputField);

                // Clear input field
                this.value = '';
            }
        }
    });

    // Remove tag on click
    tagInput.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-tag')) {
            const tag = e.target.getAttribute('data-tag');

            // Remove tag from array
            tags = tags.filter(t => t !== tag);

            // Update hidden input
            tagsHiddenInput.value = JSON.stringify(tags);

            // Remove tag element
            e.target.parentNode.remove();
        }
    });
}

// Initialize form submission
function initFormSubmission() {
    const blogForm = document.getElementById('blog-form');
    const saveDraftBtn = document.getElementById('save-draft-btn');

    if (!blogForm) return;

    // Save as draft
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            // Set status to draft
            const statusSelect = document.getElementById('blog-status');
            if (statusSelect) {
                statusSelect.value = 'draft';
            }

            // Submit form
            submitBlogForm('draft');
        });
    }

    // Submit form
    blogForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitBlogForm('published');
    });
}

// Submit blog form
function submitBlogForm(status) {
    // Get form elements
    const titleInput = document.getElementById('blog-title');
    const categorySelect = document.getElementById('blog-category');
    const statusSelect = document.getElementById('blog-status');
    const excerptTextarea = document.getElementById('blog-excerpt');
    const contentTextarea = document.getElementById('blog-content');
    const tagsHiddenInput = document.getElementById('blog-tags');
    const imageInput = document.getElementById('blog-image');
    const previewImg = document.getElementById('preview-img');

    // Validate required fields
    if (!titleInput.value.trim()) {
        showAlert('Please enter a title for the blog post.', 'warning');
        titleInput.focus();
        return;
    }

    if (!categorySelect.value) {
        showAlert('Please select a category for the blog post.', 'warning');
        categorySelect.focus();
        return;
    }

    if (!excerptTextarea.value.trim()) {
        showAlert('Please enter an excerpt for the blog post.', 'warning');
        excerptTextarea.focus();
        return;
    }

    // Update content textarea with Quill content
    if (quill) {
        contentTextarea.value = quill.root.innerHTML;
    }

    if (!contentTextarea.value.trim()) {
        showAlert('Please enter content for the blog post.', 'warning');
        if (quill) quill.focus();
        return;
    }

    // Set status
    if (statusSelect) {
        statusSelect.value = status;
    }

    // Get existing blog posts from localStorage
    let blogPosts = [];
    const storedBlogPosts = localStorage.getItem('blogPosts');

    if (storedBlogPosts) {
        blogPosts = JSON.parse(storedBlogPosts);
    }

    // Check if editing existing post
    const postId = getPostIdFromUrl();
    let isNewPost = !postId;

    // Create slug from title
    const slug = createSlug(titleInput.value);

    // Get current date
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    // Parse tags
    let tags = [];
    if (tagsHiddenInput.value) {
        try {
            tags = JSON.parse(tagsHiddenInput.value);
        } catch (error) {
            console.error('Error parsing tags:', error);
        }
    }

    // Get image URL
    let imageUrl = '';
    if (previewImg && previewImg.src && previewImg.src !== window.location.href) {
        imageUrl = previewImg.src;
    } else {
        // Default image if none selected - use a placeholder image service
        imageUrl = 'https://via.placeholder.com/800x500/f3f4f6/1f2937?text=Blog+Post+Image';
    }

    // Create blog post object
    const blogPost = {
        id: isNewPost ? generatePostId(blogPosts) : parseInt(postId),
        title: titleInput.value.trim(),
        slug: slug,
        category: categorySelect.value,
        date: formattedDate,
        status: statusSelect.value,
        excerpt: excerptTextarea.value.trim(),
        content: contentTextarea.value,
        featuredImage: imageUrl,
        tags: tags
    };

    // Add or update post in array
    if (isNewPost) {
        // Add new post
        blogPosts.push(blogPost);
    } else {
        // Update existing post
        const postIndex = blogPosts.findIndex(p => p.id.toString() === postId.toString());

        if (postIndex !== -1) {
            blogPosts[postIndex] = blogPost;
        } else {
            // Post not found, add as new
            blogPosts.push(blogPost);
        }
    }

    // Save to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));

    // Show success message
    const actionText = isNewPost ? 'created' : 'updated';
    const statusText = status === 'published' ? 'published' : 'saved as draft';

    showAlert(`Blog post successfully ${actionText} and ${statusText}.`, 'success');

    // Redirect to blog list after a delay
    setTimeout(() => {
        window.location.href = 'blog.html';
    }, 2000);
}

// Check if editing existing post
function checkForExistingPost() {
    const postId = getPostIdFromUrl();

    if (!postId) return;

    // Get blog posts from localStorage
    const storedBlogPosts = localStorage.getItem('blogPosts');

    if (!storedBlogPosts) return;

    const blogPosts = JSON.parse(storedBlogPosts);
    const post = blogPosts.find(p => p.id.toString() === postId.toString());

    if (!post) return;

    // Fill form with post data
    fillFormWithPostData(post);
}

// Fill form with post data
function fillFormWithPostData(post) {
    const titleInput = document.getElementById('blog-title');
    const categorySelect = document.getElementById('blog-category');
    const statusSelect = document.getElementById('blog-status');
    const excerptTextarea = document.getElementById('blog-excerpt');
    const tagsHiddenInput = document.getElementById('blog-tags');
    const tagInput = document.getElementById('tag-input');
    const tagInputField = document.getElementById('tag-input-field');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');

    // Set form values
    if (titleInput) titleInput.value = post.title;
    if (categorySelect) categorySelect.value = post.category;
    if (statusSelect) statusSelect.value = post.status;
    if (excerptTextarea) excerptTextarea.value = post.excerpt;

    // Set Quill editor content
    if (quill) {
        quill.root.innerHTML = post.content;

        // Update hidden textarea
        const contentTextarea = document.getElementById('blog-content');
        if (contentTextarea) {
            contentTextarea.value = post.content;
        }
    }

    // Set tags
    if (tagsHiddenInput && tagInput && tagInputField && post.tags) {
        // Set hidden input value
        tagsHiddenInput.value = JSON.stringify(post.tags);

        // Create tag elements
        post.tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.innerHTML = `
                ${tag}
                <span class="remove-tag" data-tag="${tag}">×</span>
            `;

            // Add tag element before input field
            tagInput.insertBefore(tagElement, tagInputField);
        });
    }

    // Set featured image
    if (imagePreview && previewImg && post.featuredImage) {
        previewImg.src = post.featuredImage;
        imagePreview.style.display = 'block';
    }

    // Update page title
    document.title = `Edit Blog Post - ${post.title} - Aezline Admin`;

    // Update header title
    const headerTitle = document.querySelector('.admin-header-title h1');
    if (headerTitle) {
        headerTitle.textContent = `Edit Blog Post: ${post.title}`;
    }
}

// Get post ID from URL
function getPostIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Generate new post ID
function generatePostId(posts) {
    if (!posts.length) return 1;

    // Find highest ID and increment by 1
    const highestId = Math.max(...posts.map(p => p.id));
    return highestId + 1;
}

// Create slug from string
function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim();                  // Trim leading/trailing whitespace
}

// Format date
function formatDate(date) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('blog-alert-container');
    if (!alertContainer) return;

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `admin-alert admin-alert-${type}`;

    // Set alert icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'danger') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';

    alert.innerHTML = `
        <div class="admin-alert-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="admin-alert-content">
            <div class="admin-alert-message">${message}</div>
        </div>
        <button class="admin-alert-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add alert to container
    alertContainer.appendChild(alert);

    // Add close button functionality
    const closeBtn = alert.querySelector('.admin-alert-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            alert.remove();
        });
    }

    // Auto-remove alert after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Add CSS styles for blog editor
document.head.insertAdjacentHTML('beforeend', `
<style>
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .form-help {
        font-size: 0.85rem;
        color: var(--admin-text-muted);
        margin-top: 5px;
    }

    .excerpt-counter {
        font-size: 0.85rem;
        color: var(--admin-text-muted);
        text-align: right;
        margin-top: 5px;
    }

    .excerpt-counter.warning {
        color: var(--admin-warning);
        font-weight: 500;
    }

    .ql-editor {
        min-height: 300px;
        max-height: 600px;
        overflow-y: auto;
    }

    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
            gap: 0;
        }
    }
</style>
`);
