const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Create a test instance of the app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes (copy from main app for testing)
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
    }
];

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

app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    res.send(`
        <h1>Thank You!</h1>
        <p>We've received your message and will get back to you soon.</p>
        <a href="/">Back to Home</a>
    `);
});

// Test suite
describe('Tech Consulting App Tests', () => {
    // Test home page
    test('GET / should return homepage with welcome message', async () => {
        const response = await request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200);

        expect(response.text).toContain('Welcome to TechConsult');
        expect(response.text).toContain('View Our Services');
        expect(response.text).toContain('Contact Us');
    });

    // Test services page
    test('GET /services should return list of services', async () => {
        const response = await request(app)
            .get('/services')
            .expect('Content-Type', /html/)
            .expect(200);

        expect(response.text).toContain('Cloud Solutions');
        expect(response.text).toContain('Digital Transformation');
        expect(response.text).toContain('Custom Software Development');
    });

    // Test contact form submission
    test('POST /submit-contact should handle contact form submission', async () => {
        const contactData = {
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Looking forward to working with you!'
        };

        const response = await request(app)
            .post('/submit-contact')
            .send(contactData)
            .expect('Content-Type', /html/)
            .expect(200);

        expect(response.text).toContain('Thank You!');
        expect(response.text).toContain('We\'ve received your message');
    });

    // Test non-existent route
    test('GET /nonexistent should return 404', async () => {
        const response = await request(app)
            .get('/nonexistent')
            .expect(404);
    });
});