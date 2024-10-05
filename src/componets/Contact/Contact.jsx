// src/components/Contact.jsx
import { useState } from 'react';

const Contact = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission (e.g., send email or store in database)
        alert('Message sent!');
        setForm({ name: '', email: '', message: '' });
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="input input-bordered w-full"
                        placeholder="Your Name"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="input input-bordered w-full"
                        placeholder="your.email@example.com"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="message">
                        Message
                    </label>
                    <textarea
                        name="message"
                        id="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        className="textarea textarea-bordered w-full"
                        rows={5}
                        placeholder="Your message..."
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full">
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default Contact;
