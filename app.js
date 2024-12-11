const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Sample data
const services = [
    {
        id: 1,
        name: 'Cloud Solutions',
        description: 'Enterprise cloud architecture and migration services'
    },
    {
        id: 2,
        name: 'Digital Transformation',
        description: 'End-to-end digital transformation consulting'
    },
    {
        id: 3,
        name: 'Custom Software Development',
        description: 'Tailored software solutions for business needs'
    },
    {
        id: 4,
        name: 'AI & Machine Learning',
        description: 'Innovative AI solutions to enhance business processes'
    }
];

// Routes
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to TechConsult</h1>
        <p>Your trusted technology partner for digital transformation</p>
        <a href="/services">View Our Services</a>
        <br>
        <a href="/contact">Contact Us</a>
    `);
});

app.get('/services', (req, res) => {
    const servicesList = services.map(service => 
        `<div>
            <h2>${service.name}</h2>
            <p>${service.description}</p>
        </div>`
    ).join('');

    res.send(`
        <h1>Our Services</h1>
        ${servicesList}
        <br>
        <a href="/">Back to Home</a>
    `);
});

app.get('/contact', (req, res) => {
    res.send(`
        <h1>Contact Us</h1>
        <form action="/submit-contact" method="POST">
            <div>
                <label for="name">Name:</label><br>
                <input type="text" id="name" name="name" required>
            </div>
            <div>
                <label for="email">Email:</label><br>
                <input type="email" id="email" name="email" required>
            </div>
            <div>
                <label for="message">Message:</label><br>
                <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit">Send Message</button>
        </form>
        <br>
        <a href="/">Back to Home</a>
    `);
});

app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    // In a real application, you would handle this data (e.g., save to database, send email)
    console.log('Contact form submission:', { name, email, message });
    res.send(`
        <h1>Thank You!</h1>
        <p>We've received your message and will get back to you soon.</p>
        <a href="/">Back to Home</a>
    `);
});

// Error handling
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Page Not Found</h1>
        <a href="/">Back to Home</a>
    `);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`
        <h1>500 - Server Error</h1>
        <a href="/">Back to Home</a>
    `);
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
