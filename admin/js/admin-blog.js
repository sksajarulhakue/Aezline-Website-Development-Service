// Admin Blog Management

document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog management
    initBlogManagement();
});

// Initialize blog management
function initBlogManagement() {
    // Initialize blog data
    initBlogData();

    // Initialize blog search
    initBlogSearch();

    // Initialize blog actions
    initBlogActions();

    // Initialize delete modal
    initDeleteModal();

    // Initialize pagination
    initPagination();
}

// Blog posts data
let blogPosts = [
    {
        id: 1,
        title: "The Critical Role of Web Performance in User Experience and SEO",
        slug: "web-performance-user-experience-seo",
        category: "Development",
        date: "April 15, 2024",
        status: "published",
        excerpt: "Website performance has evolved from a technical consideration to a critical business factor that directly impacts user experience, conversion rates, and search engine rankings.",
        content: "Website performance has evolved from a technical consideration to a critical business factor that directly impacts user experience, conversion rates, and search engine rankings. In today's fast-paced digital environment, users expect websites to load almost instantaneously, with studies showing that 53% of mobile users abandon sites that take longer than three seconds to load.\n\nGoogle's Core Web Vitals have formalized performance metrics as ranking factors, making optimization not just a user experience concern but an SEO necessity. These metrics focus on loading performance (Largest Contentful Paint), interactivity (First Input Delay), and visual stability (Cumulative Layout Shift).",
        featuredImage: "https://via.placeholder.com/800x500/f3f4f6/1f2937?text=Web+Performance",
        tags: ["Web Performance", "SEO", "Core Web Vitals", "Optimization"]
    },
    {
        id: 2,
        title: "Designing for Accessibility: Creating Inclusive Web Experiences",
        slug: "designing-accessibility-inclusive-web-experiences",
        category: "Design",
        date: "April 8, 2024",
        status: "published",
        excerpt: "Web accessibility is not merely a compliance checkbox but a fundamental aspect of ethical web development that ensures digital experiences are available to everyone.",
        content: "Web accessibility is not merely a compliance checkbox but a fundamental aspect of ethical web development that ensures digital experiences are available to everyone, regardless of their abilities or disabilities. With over one billion people worldwide living with some form of disability, designing accessible websites is both a social responsibility and a business imperative.\n\nThe Web Content Accessibility Guidelines (WCAG) provide a comprehensive framework for creating accessible content, organized around four principles: perceivable, operable, understandable, and robust. Meeting these guidelines not only serves users with disabilities but improves the experience for all users.",
        featuredImage: "https://via.placeholder.com/800x500/f3f4f6/1f2937?text=Accessibility",
        tags: ["Accessibility", "WCAG", "Inclusive Design", "UX"]
    },
    {
        id: 3,
        title: "Modern JavaScript Frameworks: Choosing the Right Tool for Your Project",
        slug: "modern-javascript-frameworks-choosing-right-tool",
        category: "Development",
        date: "March 30, 2024",
        status: "published",
        excerpt: "The JavaScript ecosystem continues to evolve rapidly, offering developers an expanding array of frameworks and libraries for building modern web applications.",
        content: "The JavaScript ecosystem continues to evolve rapidly, offering developers an expanding array of frameworks and libraries for building modern web applications. While this abundance of choice provides flexibility, it also creates the challenge of selecting the most appropriate tool for specific project requirements.\n\nEach framework has distinct philosophies, architectures, and trade-offs that make them better suited for particular use cases. Understanding these differences is crucial for making informed decisions that align with your project goals, team expertise, and long-term maintenance considerations.",
        featuredImage: "https://via.placeholder.com/800x500/f3f4f6/1f2937?text=JavaScript+Frameworks",
        tags: ["JavaScript", "Frameworks", "React", "Vue", "Angular"]
    }
];

// Initialize blog data
function initBlogData() {
    // Show loading indicator
    const loadingElement = document.getElementById('blog-loading');
    const tableElement = document.getElementById('blog-posts-table');

    if (loadingElement) loadingElement.style.display = 'flex';
    if (tableElement) tableElement.style.display = 'none';

    // Simulate loading delay (remove in production)
    setTimeout(() => {
        // Check if blog data exists in localStorage
        const storedBlogPosts = localStorage.getItem('blogPosts');

        if (!storedBlogPosts) {
            // If not, initialize with default data
            localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        } else {
            // If exists, use stored data
            blogPosts = JSON.parse(storedBlogPosts);
        }

        // Render blog posts
        renderBlogPosts();

        // Hide loading indicator and show table and pagination
        if (loadingElement) loadingElement.style.display = 'none';
        if (tableElement) tableElement.style.display = 'table';

        // Show pagination
        const paginationElement = document.getElementById('blog-pagination');
        if (paginationElement) paginationElement.style.display = 'flex';
    }, 800); // Simulate network delay
}

// Render blog posts
function renderBlogPosts(posts = null, paginated = true) {
    const blogPostsTable = document.getElementById('blog-posts-table');
    if (!blogPostsTable) return;

    const tbody = blogPostsTable.querySelector('tbody');
    if (!tbody) return;

    // Clear existing rows
    tbody.innerHTML = '';

    // Store filtered posts for pagination
    if (posts !== null) {
        filteredPosts = posts;
    } else {
        filteredPosts = null;
    }

    // Use filtered posts if provided, otherwise use all posts
    const allPostsToRender = filteredPosts || blogPosts;

    if (allPostsToRender.length === 0) {
        // No posts found
        const noPostsRow = document.createElement('tr');
        noPostsRow.innerHTML = `
            <td colspan="5" style="text-align: center; padding: 30px;">
                No blog posts found. <a href="blog-new.html">Create your first post</a>.
            </td>
        `;
        tbody.appendChild(noPostsRow);

        // Reset pagination
        if (paginated) {
            currentPage = 1;
            updatePagination();
        }

        return;
    }

    // Calculate pagination
    let postsToRender = allPostsToRender;

    if (paginated) {
        // Reset to page 1 if not explicitly paginating (e.g., on search)
        if (posts !== null && !paginated) {
            currentPage = 1;
        }

        // Calculate start and end indices for current page
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;

        // Get posts for current page
        postsToRender = allPostsToRender.slice(startIndex, endIndex);
    }

    // Add rows for each post
    postsToRender.forEach(post => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', post.id);

        row.innerHTML = `
            <td class="admin-blog-title">${post.title}</td>
            <td>${post.category}</td>
            <td>${post.date}</td>
            <td><span class="admin-blog-status ${post.status}">${post.status.charAt(0).toUpperCase() + post.status.slice(1)}</span></td>
            <td class="admin-blog-actions">
                <button class="edit-btn" title="Edit Post" data-id="${post.id}"><i class="fas fa-edit"></i> Edit</button>
                <button class="view-btn" title="View" data-id="${post.id}"><i class="fas fa-eye"></i></button>
                <button class="delete-btn" title="Delete" data-id="${post.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Update pagination if needed
    if (paginated) {
        updatePagination();
    }

    // Re-initialize blog actions after rendering
    initBlogActions();
}

// Initialize blog search
function initBlogSearch() {
    const searchInput = document.getElementById('blog-search');
    const searchBtn = document.getElementById('blog-search-btn');
    const clearBtn = document.getElementById('blog-search-clear');

    if (!searchInput || !searchBtn) return;

    // Search on button click
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        searchBlogPosts(query);

        // Show clear button if there's a query
        if (query && clearBtn) {
            clearBtn.style.display = 'block';
        }
    });

    // Search on Enter key
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            searchBlogPosts(query);

            // Show clear button if there's a query
            if (query && clearBtn) {
                clearBtn.style.display = 'block';
            }
        }
    });

    // Clear search
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            // Clear search input
            searchInput.value = '';

            // Hide clear button
            this.style.display = 'none';

            // Reset search results
            searchBlogPosts('');

            // Focus search input
            searchInput.focus();
        });
    }
}

// Search blog posts
function searchBlogPosts(query) {
    // Reset to page 1 when searching
    currentPage = 1;

    if (!query) {
        // If empty query, show all posts
        filteredPosts = null;
        renderBlogPosts(null, true);
        return;
    }

    // Filter posts by title, category, content, or tags
    const filteredPosts = blogPosts.filter(post => {
        const lowerQuery = query.toLowerCase();
        return (
            post.title.toLowerCase().includes(lowerQuery) ||
            post.category.toLowerCase().includes(lowerQuery) ||
            post.content.toLowerCase().includes(lowerQuery) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        );
    });

    // Show search results message
    const resultsCount = filteredPosts.length;
    const message = resultsCount > 0
        ? `Found ${resultsCount} post${resultsCount !== 1 ? 's' : ''} matching "${query}".`
        : `No posts found matching "${query}".`;

    showAlert(message, resultsCount > 0 ? 'info' : 'warning');

    // Render filtered posts
    renderBlogPosts(filteredPosts, true);
}

// Initialize blog actions
function initBlogActions() {
    console.log('Initializing blog actions');

    // Edit buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    console.log('Found edit buttons:', editButtons.length);

    editButtons.forEach(button => {
        console.log('Adding click event to button with data-id:', button.getAttribute('data-id'));

        // Remove any existing event listeners
        button.removeEventListener('click', handleEditClick);

        // Add new event listener
        button.addEventListener('click', handleEditClick);
    });

    // View buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    console.log('Found view buttons:', viewButtons.length);

    viewButtons.forEach(button => {
        console.log('Adding click event to view button with data-id:', button.getAttribute('data-id'));

        // Remove any existing event listeners
        button.removeEventListener('click', handleViewClick);

        // Add new event listener
        button.addEventListener('click', handleViewClick);
    });

    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    console.log('Found delete buttons:', deleteButtons.length);

    deleteButtons.forEach(button => {
        console.log('Adding click event to delete button with data-id:', button.getAttribute('data-id'));

        // Remove any existing event listeners
        button.removeEventListener('click', handleDeleteClick);

        // Add new event listener
        button.addEventListener('click', handleDeleteClick);
    });
}

// Handle edit button click
function handleEditClick() {
    console.log('Edit button clicked');
    const postId = this.getAttribute('data-id');
    console.log('Post ID:', postId);
    window.location.href = `blog-edit.html?id=${postId}`;
}

// Handle view button click
function handleViewClick() {
    console.log('View button clicked');
    const postId = this.getAttribute('data-id');
    console.log('Post ID:', postId);

    const post = blogPosts.find(p => p.id.toString() === postId);
    if (post) {
        // Open the blog post in a new tab using the blog.html page with article parameter
        window.open(`../blog.html?article=${post.slug}`, '_blank');
    }
}

// Handle delete button click
function handleDeleteClick() {
    console.log('Delete button clicked');
    const postId = this.getAttribute('data-id');
    console.log('Post ID:', postId);

    const post = blogPosts.find(p => p.id.toString() === postId);
    if (post) {
        // Show delete confirmation modal
        showDeleteModal(post);
    }
}

// Initialize delete modal
function initDeleteModal() {
    const deleteModal = document.getElementById('delete-modal');
    const deleteModalClose = document.getElementById('delete-modal-close');
    const deleteCancelBtn = document.getElementById('delete-cancel-btn');
    const deleteConfirmBtn = document.getElementById('delete-confirm-btn');

    if (!deleteModal || !deleteModalClose || !deleteCancelBtn || !deleteConfirmBtn) return;

    // Close modal on close button click
    deleteModalClose.addEventListener('click', function() {
        hideDeleteModal();
    });

    // Close modal on cancel button click
    deleteCancelBtn.addEventListener('click', function() {
        hideDeleteModal();
    });

    // Close modal on clicking outside
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            hideDeleteModal();
        }
    });

    // Delete post on confirm button click
    deleteConfirmBtn.addEventListener('click', function() {
        const postId = this.getAttribute('data-post-id');
        deletePost(postId);
        hideDeleteModal();
    });
}

// Show delete confirmation modal
function showDeleteModal(post) {
    const deleteModal = document.getElementById('delete-modal');
    const deletePostTitle = document.querySelector('.delete-post-title');
    const deleteConfirmBtn = document.getElementById('delete-confirm-btn');

    if (!deleteModal || !deletePostTitle || !deleteConfirmBtn) return;

    // Set post title in modal
    deletePostTitle.textContent = `"${post.title}"`;

    // Set post ID on confirm button
    deleteConfirmBtn.setAttribute('data-post-id', post.id);

    // Show modal
    deleteModal.classList.add('show');

    // Prevent scrolling on body
    document.body.style.overflow = 'hidden';
}

// Hide delete confirmation modal
function hideDeleteModal() {
    const deleteModal = document.getElementById('delete-modal');
    if (!deleteModal) return;

    // Hide modal
    deleteModal.classList.remove('show');

    // Allow scrolling on body
    document.body.style.overflow = '';
}

// Delete post
function deletePost(postId) {
    // Find post index
    const postIndex = blogPosts.findIndex(p => p.id.toString() === postId.toString());

    if (postIndex === -1) return;

    // Get post title for alert message
    const postTitle = blogPosts[postIndex].title;

    // Remove post from array
    blogPosts.splice(postIndex, 1);

    // Update localStorage
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));

    // Re-render blog posts
    renderBlogPosts();

    // Show success alert
    showAlert(`Blog post "${postTitle}" has been deleted successfully.`, 'success');
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

// Pagination variables
let currentPage = 1;
let postsPerPage = 5;
let filteredPosts = null;

// Initialize pagination
function initPagination() {
    const prevButton = document.querySelector('.admin-pagination-prev');
    const nextButton = document.querySelector('.admin-pagination-next');
    const paginationInfo = document.querySelector('.admin-pagination-info');

    if (!prevButton || !nextButton || !paginationInfo) return;

    // Update pagination on first load
    updatePagination();

    // Previous page button
    prevButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderBlogPosts(filteredPosts, true);
            updatePagination();
        }
    });

    // Next page button
    nextButton.addEventListener('click', function() {
        const posts = filteredPosts || blogPosts;
        const totalPages = Math.ceil(posts.length / postsPerPage);

        if (currentPage < totalPages) {
            currentPage++;
            renderBlogPosts(filteredPosts, true);
            updatePagination();
        }
    });
}

// Update pagination buttons and info
function updatePagination() {
    const prevButton = document.querySelector('.admin-pagination-prev');
    const nextButton = document.querySelector('.admin-pagination-next');
    const paginationInfo = document.querySelector('.admin-pagination-info');

    if (!prevButton || !nextButton || !paginationInfo) return;

    const posts = filteredPosts || blogPosts;
    const totalPages = Math.ceil(posts.length / postsPerPage);

    // Update pagination info
    paginationInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;

    // Update button states
    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages || totalPages === 0;
}

// Add CSS styles for blog management
document.head.insertAdjacentHTML('beforeend', `
<style>
    .admin-search-box {
        display: flex;
        align-items: center;
        position: relative;
    }

    .admin-search-box input {
        padding: 8px 15px;
        border: 1px solid var(--admin-border);
        border-radius: 5px;
        font-size: 0.9rem;
        width: 250px;
        transition: all 0.3s ease;
    }

    .admin-search-box input:focus {
        border-color: var(--admin-primary);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        outline: none;
        width: 300px;
    }

    .admin-search-box button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--admin-text-muted);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .admin-search-box #blog-search-btn {
        right: 10px;
    }

    .admin-search-box #blog-search-clear {
        right: 35px;
    }

    .admin-search-box button:hover {
        color: var(--admin-primary);
    }

    .admin-search-box #blog-search-clear:hover {
        color: var(--admin-danger);
    }

    .admin-pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid var(--admin-border);
    }

    .admin-pagination button {
        background: none;
        border: 1px solid var(--admin-border);
        border-radius: 5px;
        padding: 8px 15px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .admin-pagination button:not(:disabled):hover {
        background-color: var(--admin-bg);
        border-color: var(--admin-primary);
        color: var(--admin-primary);
    }

    .admin-pagination button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .admin-pagination-info {
        font-size: 0.9rem;
        color: var(--admin-text-muted);
    }

    @media (max-width: 768px) {
        .admin-search-box input {
            width: 150px;
        }

        .admin-search-box input:focus {
            width: 200px;
        }
    }

    @media (max-width: 576px) {
        .admin-pagination {
            flex-direction: column;
            gap: 10px;
        }
    }
</style>
`);
