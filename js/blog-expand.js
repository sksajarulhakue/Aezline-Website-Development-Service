// Blog Expand Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog article expansion
    initBlogExpand();

    // Initialize URL parameter handling
    handleUrlParameters();
});

// Initialize blog article expansion
function initBlogExpand() {
    const articles = document.querySelectorAll('.blog-article');
    const readMoreButtons = document.querySelectorAll('.read-more');

    // Set initial state for all articles (collapsed)
    articles.forEach(article => {
        const content = article.querySelector('.article-content');
        const title = article.querySelector('.article-title').textContent;

        // Store the full content
        article.setAttribute('data-full-content', content.innerHTML);

        // Create a shortened version (first paragraph only)
        const firstParagraph = content.querySelector('p:first-child');
        if (firstParagraph) {
            // Truncate the text if it's too long
            let shortText = firstParagraph.textContent;
            if (shortText.length > 200) {
                shortText = shortText.substring(0, 200) + '...';
            }

            // Replace content with shortened version
            content.innerHTML = `<p>${shortText}</p>`;
        }

        // Add a unique ID to the article based on the title
        const articleId = createSlug(title);
        article.id = articleId;
    });

    // Add click event to read more buttons
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const article = this.closest('.blog-article');
            const content = article.querySelector('.article-content');
            const fullContent = article.getAttribute('data-full-content');
            const articleId = article.id;

            // Check if article is already expanded
            if (article.classList.contains('expanded')) {
                // Collapse the article
                const firstParagraph = document.createElement('div');
                firstParagraph.innerHTML = fullContent;
                let shortText = firstParagraph.querySelector('p:first-child').textContent;
                if (shortText.length > 200) {
                    shortText = shortText.substring(0, 200) + '...';
                }

                content.innerHTML = `<p>${shortText}</p>`;
                article.classList.remove('expanded');
                this.innerHTML = 'Read Full Article <i class="fas fa-arrow-right"></i>';

                // Remove the article ID from the URL
                updateUrl('');

                // Scroll to the top of the article
                article.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Expand the article
                content.innerHTML = fullContent;

                // Add a link to the full article page at the end
                const articleTitle = article.querySelector('.article-title').textContent;
                let fullArticleLink = '';

                if (articleTitle.includes('Performance')) {
                    fullArticleLink = 'blog-performance.html';
                } else if (articleTitle.includes('Accessibility')) {
                    fullArticleLink = 'blog-accessibility.html';
                } else if (articleTitle.includes('JavaScript Frameworks')) {
                    fullArticleLink = 'blog-frameworks.html';
                } else {
                    fullArticleLink = 'blog-single.html';
                }

                const viewFullArticleLink = document.createElement('div');
                viewFullArticleLink.className = 'view-full-article';
                viewFullArticleLink.innerHTML = `<a href="${fullArticleLink}" class="full-article-link">View Full Article Page <i class="fas fa-external-link-alt"></i></a>`;
                content.appendChild(viewFullArticleLink);

                article.classList.add('expanded');
                this.innerHTML = 'Show Less <i class="fas fa-arrow-up"></i>';

                // Add the article ID to the URL
                updateUrl(articleId);

                // Scroll to the top of the article
                article.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Handle URL parameters for direct access to expanded articles
function handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('article');

    if (articleId) {
        // First try to find by ID
        let article = document.getElementById(articleId);

        // If not found by ID, try to find by matching slug with title
        if (!article) {
            const articles = document.querySelectorAll('.blog-article');
            articles.forEach(art => {
                const title = art.querySelector('.article-title').textContent;
                const slug = createSlug(title);
                if (slug === articleId || articleId.includes(slug) || slug.includes(articleId)) {
                    article = art;
                }
            });
        }

        if (article) {
            const readMoreButton = article.querySelector('.read-more');
            if (readMoreButton) {
                // Simulate a click on the read more button
                readMoreButton.click();
            }
        }
    }
}

// Update URL with article ID
function updateUrl(articleId) {
    if (articleId) {
        const url = new URL(window.location);
        url.searchParams.set('article', articleId);
        window.history.pushState({}, '', url);
    } else {
        const url = new URL(window.location);
        url.searchParams.delete('article');
        window.history.pushState({}, '', url);
    }
}

// Create a URL-friendly slug from a string
function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim();                  // Trim leading/trailing whitespace
}

// Add CSS styles for expanded articles
function addExpandStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .blog-article {
            transition: all 0.3s ease;
        }

        .blog-article.expanded {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 30px;
            margin: 30px -30px;
            border-radius: 12px;
            background-color: var(--card-bg, #ffffff);
        }

        .blog-article.expanded .article-content {
            max-height: none;
            overflow: visible;
        }

        .view-full-article {
            margin-top: 30px;
            text-align: center;
        }

        .full-article-link {
            display: inline-flex;
            align-items: center;
            background-color: var(--primary-color, #3b82f6);
            color: white;
            padding: 12px 25px;
            border-radius: 30px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .full-article-link i {
            margin-left: 8px;
        }

        .full-article-link:hover {
            background-color: var(--primary-dark, #2563eb);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
        }

        @media (max-width: 768px) {
            .blog-article.expanded {
                padding: 20px;
                margin: 20px -20px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Call the function to add styles
addExpandStyles();
