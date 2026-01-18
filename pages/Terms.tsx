import React from 'react';

const Terms: React.FC = () => {
    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-16 animate-fadeIn text-gray-800 dark:text-gray-200">
            <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-purple">
                Terms of Service
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">gavel</span>
                        1. Acceptance of Terms
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        By accessing and using Aura Downloader ("the Service"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">school</span>
                        2. Educational Purpose & Fair Use
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Aura Downloader is strictly intended for <strong>educational and personal use only</strong>. The Service allows users to create offline copies of content they already have the right to access. It is designed to facilitate fair use, such as critique, comment, news reporting, teaching, scholarship, and research.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">copyright</span>
                        3. Copyright & Intellectual Property
                    </h2>
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 rounded-r-lg">
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                            You agree NOT to use the Service to infringe upon the copyrights of others.
                        </p>
                    </div>
                    <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600 dark:text-gray-400">
                        <li>You typically only have the right to download content if you own the copyright, have permission from the copyright holder, or if the content is in the public domain.</li>
                        <li>You are solely responsible for ensuring that your use of the Service complies with all applicable copyright laws in your jurisdiction.</li>
                        <li>Aura Downloader does not host, store, or index any copyrighted material on its servers. All conversions are performed transiently.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">block</span>
                        4. Prohibited Activities
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">You agree NOT to:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                        <li>Use the Service for any illegal or unauthorized purpose.</li>
                        <li>Attempt to bypass any technological measures implemented by third-party platforms (e.g., download encrypted/DRM-protected content).</li>
                        <li>Use the Service to download content for commercial distribution or sale.</li>
                        <li>Overload, flood, or spam the Service's servers.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">link_off</span>
                        5. No Affiliation
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Aura Downloader is an independent tool and is <strong>NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with YouTube, Google LLC, or any of their subsidiaries or affiliates.</strong> The official YouTube website can be found at https://www.youtube.com. "YouTube" is a registered trademark of Google LLC.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">warning</span>
                        6. Limitation of Liability
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        The Service is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind. <strong>We shall not be held liable for any misuse of the Service, or for any damages resulting from the use of the Service.</strong> You use the Service entirely at your own risk. We are not responsible for any copyright violations committed by users of this tool.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">update</span>
                        7. Changes to Terms
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        We reserve the right to modify these terms at any time without notice. Your continued use of Aura Downloader signifies your acceptance of the updated terms.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Terms;
