import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-16 animate-fadeIn text-gray-800 dark:text-gray-200">
            <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-purple">
                Privacy Policy
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8">
                    <p className="text-lg font-medium text-primary-dark dark:text-primary">
                        <strong>TL;DR:</strong> We do not track you. We do not store your data. We do not sell your information. Your downloads are your business.
                    </p>
                </div>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Data Collection</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        We take your privacy seriously. Here is exactly what we collect:
                    </p>
                    <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600 dark:text-gray-400">
                        <li><strong>No Personal Data:</strong> We do not require you to create an account, provide an email, or share your name.</li>
                        <li><strong>No Download History Logs:</strong> We do not keep logs of which videos you download or your IP address on our permanent storage.</li>
                        <li><strong>Transient Processing:</strong> When you request a download, the link is processed by our servers in real-time to generate the file. Once the stream is complete, no copy of the video remains on our servers.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. Local Storage</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        We use your browser's "Local Storage" technology strictly for user experience preferences:
                    </p>
                    <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600 dark:text-gray-400">
                        <li><strong>Theme Preference:</strong> To remember if you prefer Dark Mode or Light Mode.</li>
                        <li><strong>History:</strong> Recent downloads are stored <em>only on your device</em> to create your "Recent Downloads" list. This data never leaves your browser. You can clear your browser cache to remove this at any time.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. Third-Party Services</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Our service interacts with public third-party APIs (like YouTube) to fetch video metadata (title, thumbnail, duration).
                    </p>
                    <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600 dark:text-gray-400">
                        <li>When you paste a link, a request is sent to these platforms to get details.</li>
                        <li>Please refer to <a href="https://policies.google.com/privacy" className="text-primary hover:underline">Google's Privacy Policy</a> for how they handle data.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. Cookies</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        We do not use tracking cookies, analytics cookies, or advertising cookies. The only "cookies" (technically Local Storage) used are essential for the site's functionality (like remembering your theme).
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Security</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        We use industry-standard HTTPS encryption to ensure that the connection between your device and our website is secure. This prevents unauthorized parties from seeing what you are downloading.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Privacy;
