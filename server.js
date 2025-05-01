// Backend server for Aezline Website
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');

// Simple authentication middleware (for demo purposes)
const basicAuth = require('express-basic-auth');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));

// Session middleware
app.use(session({
    secret: 'aezline-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 } // 1 hour
}));

// Admin authentication middleware
const adminAuth = (req, res, next) => {
    // Check if user is logged in
    if (req.session && req.session.adminLoggedIn) {
        return next();
    } else {
        // For API requests, return 401 Unauthorized
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // For admin pages, redirect to login
        return res.redirect('/admin/login.html');
    }
};

// Protect admin routes
app.use('/admin/dashboard.html', adminAuth);
app.use('/admin/process-editor.html', adminAuth);
app.use('/admin/settings.html', adminAuth);

// Data file paths
const processStepsFile = path.join(__dirname, 'data/process-steps.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize process steps data if it doesn't exist
if (!fs.existsSync(processStepsFile)) {
    const initialProcessSteps = [
        {
            id: 1,
            title: "Initial Planning & Client Meeting",
            description: "Every successful project begins with understanding your unique vision. We conduct an in-depth discovery session to uncover your business goals, target audience, and competitive landscape. This strategic foundation ensures we build not just a website, but a powerful digital asset for your business.",
            highlight: "We'll explore your specific requirements for website type (corporate, e-commerce, portfolio), essential functionality, design preferences, and content strategy to create a comprehensive project roadmap.",
            icon: "fa-handshake"
        },
        {
            id: 2,
            title: "Pricing, Packages & Budget Discussion",
            description: "We believe in complete transparency when it comes to project costs. After analyzing your requirements, we'll present tailored pricing options that align with your budget while delivering maximum value. Our flexible approach includes both standardized packages and fully customized solutions to perfectly match your project scope.",
            highlight: "You'll receive a comprehensive proposal with detailed cost breakdown, project timeline with key milestones, and specific deliverables—ensuring you have complete clarity before making any commitment.",
            icon: "fa-file-invoice-dollar"
        },
        {
            id: 3,
            title: "Design Preview After Deal Confirmation",
            description: "Following proposal approval, our creative team transforms your vision into stunning visual concepts. We craft detailed mockups of your website's user interface, information architecture, and key page layouts. This critical design phase establishes the visual foundation for your entire digital presence, ensuring aesthetic appeal and optimal user experience.",
            highlight: "This collaborative stage includes up to two rounds of revisions based on your feedback, allowing us to refine colors, typography, imagery, and layout until the design perfectly captures your brand identity and project goals.",
            icon: "fa-paint-brush"
        },
        {
            id: 4,
            title: "Advance Payment (50%) to Start Project",
            description: "With designs approved, we formalize our partnership through a 50% advance payment of the total project cost. This initial investment secures your place in our development schedule and allows us to allocate the necessary technical resources to your project. Our fair payment structure balances commitment while protecting your investment.",
            highlight: "We offer multiple secure payment methods including bank transfer, major credit cards, and digital payment platforms. You'll receive a detailed invoice and payment confirmation for your financial records and project documentation.",
            icon: "fa-money-check-alt"
        },
        {
            id: 5,
            title: "Website Development & Demo Preview",
            description: "This is where your website truly comes to life. Our expert development team transforms approved designs into a fully functional website using clean, efficient code and industry best practices. We meticulously implement all features, content management systems, responsive layouts, and integrations while optimizing for performance, security, and search engines.",
            highlight: "Upon completion of the development phase, you'll receive access to a private staging environment where you can thoroughly test all functionality, review content, and experience your website exactly as it will appear to your visitors before it goes live.",
            icon: "fa-laptop-code"
        },
        {
            id: 6,
            title: "Final Approval & Remaining Payment (50%)",
            description: "After your thorough review of the staging site and implementation of any final adjustments, we'll request the remaining 50% payment to complete the project. This balanced payment structure ensures your complete satisfaction before the project concludes. Once payment is received, we prepare for the exciting launch phase of your new digital presence.",
            highlight: "Our technical team handles the entire deployment process, including domain configuration, SSL certificate installation, server optimization, and final quality assurance testing to ensure a flawless transition to your live environment with zero downtime.",
            icon: "fa-check-circle"
        },
        {
            id: 7,
            title: "Post-Delivery Support (7 Days)",
            description: "Our relationship doesn't end at launch. We provide 7 days of comprehensive post-delivery support to ensure your complete satisfaction and a smooth transition. During this period, our team remains fully available to address any questions, implement minor adjustments, fix any issues, and provide guidance on managing your new website.",
            highlight: "For continued success, we offer flexible website maintenance packages that include regular updates, security monitoring, performance optimization, content updates, and technical support. These services ensure your digital investment continues to deliver value long after launch.",
            icon: "fa-headset"
        }
    ];

    fs.writeFileSync(processStepsFile, JSON.stringify(initialProcessSteps, null, 2));
}

// API Routes

// Get all process steps
app.get('/api/process-steps', (req, res) => {
    try {
        const processSteps = JSON.parse(fs.readFileSync(processStepsFile, 'utf8'));
        res.json(processSteps);
    } catch (error) {
        console.error('Error reading process steps:', error);
        res.status(500).json({ error: 'Failed to retrieve process steps' });
    }
});

// Get a specific process step by ID
app.get('/api/process-steps/:id', (req, res) => {
    try {
        const processSteps = JSON.parse(fs.readFileSync(processStepsFile, 'utf8'));
        const step = processSteps.find(step => step.id === parseInt(req.params.id));

        if (!step) {
            return res.status(404).json({ error: 'Process step not found' });
        }

        res.json(step);
    } catch (error) {
        console.error('Error reading process step:', error);
        res.status(500).json({ error: 'Failed to retrieve process step' });
    }
});

// Admin route to update a process step (requires authentication)
app.put('/api/process-steps/:id', adminAuth, (req, res) => {
    try {
        const processSteps = JSON.parse(fs.readFileSync(processStepsFile, 'utf8'));
        const stepIndex = processSteps.findIndex(step => step.id === parseInt(req.params.id));

        if (stepIndex === -1) {
            return res.status(404).json({ error: 'Process step not found' });
        }

        // Update the step with new data
        processSteps[stepIndex] = {
            ...processSteps[stepIndex],
            ...req.body,
            id: parseInt(req.params.id) // Ensure ID doesn't change
        };

        fs.writeFileSync(processStepsFile, JSON.stringify(processSteps, null, 2));
        res.json(processSteps[stepIndex]);
    } catch (error) {
        console.error('Error updating process step:', error);
        res.status(500).json({ error: 'Failed to update process step' });
    }
});

// Login API endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Simple authentication for demo purposes
    // In production, use a proper authentication system with hashed passwords
    if (username === 'admin' && password === 'admin123') {
        req.session.adminLoggedIn = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Logout endpoint
app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login.html');
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the website`);
});
