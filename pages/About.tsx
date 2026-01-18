import React from 'react';

const About: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-16 animate-fadeIn min-h-screen">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-purple">
                    About Aura Downloader
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                    The backstory and mission behind the tool.
                </p>
            </div>

            <div className="space-y-12">
                {/* Mission Section */}
                <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 transform hover:scale-[1.01] transition-transform duration-300">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-rounded text-3xl">lightbulb</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                        Aura Downloader was born out of a simple need: to provide a clean, fast, and privacy-focused way for creators and educators to archive online video content.
                        In an internet filled with ad-cluttered and unsafe downloader sites, we wanted to build a sanctuary—a "Pro" tool that respects your time and data.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
                        <span className="material-symbols-rounded text-4xl text-accent-purple mb-4">security</span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Privacy First</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            We don't track what you download. No logs, no history storage, no selling your data.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
                        <span className="material-symbols-rounded text-4xl text-primary mb-4">bolt</span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Built with modern tech like React and Node.js to ensure the fastest processing speeds possible.
                        </p>
                    </div>
                </div>

                {/* Developer Section */}
                <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-colors duration-700"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent-purple p-1 shadow-lg">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                <span className="material-symbols-rounded text-4xl text-white">code</span>
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold mb-2">Built by Aryan</h2>
                            <p className="text-gray-400 mb-6 max-w-md">
                                A passionate developer dedicated to building high-quality, Free web tools.
                                Always looking for feedback to make Aura even better.
                            </p>
                            <a
                                href="mailto:aryanraut53@gmail.com"
                                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 hover:scale-105 transition-all font-bold backdrop-blur-sm"
                            >
                                <span className="material-symbols-rounded">mail</span>
                                Get in Touch
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
