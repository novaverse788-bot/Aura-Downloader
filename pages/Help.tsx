import React, { useState } from 'react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-5 flex justify-between items-center bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
            >
                <span className="font-bold text-lg text-gray-800 dark:text-gray-200 pr-4">{question}</span>
                <span className={`material-symbols-rounded text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}>
                    expand_more
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 bg-gray-50 dark:bg-[#141414] ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-5 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-800">
                    {answer}
                </div>
            </div>
        </div>
    );
};

const Help: React.FC = () => {
    const faqs = [
        {
            question: "Is Aura Downloader free to use?",
            answer: "Yes! Aura Downloader is 100% free to use. You can download as many videos as you like without any hidden fees or subscription charges."
        },
        {
            question: "Is it legal to download YouTube videos?",
            answer: "It is generally legal to download videos for personal, offline use (Fair Use), especially if the content is your own or creative commons. However, distributing copyrighted material without permission is illegal. Aura Downloader strictly prohibits using this tool for copyright infringement. We serve as a technical tool (DVR) for time-shifting content you have legal access to."
        },
        {
            question: "Do I need to install any software?",
            answer: "No. Aura Downloader works entirely in your browser. You do not need to install any extensions or software on your computer or phone."
        },
        {
            question: "Why did my download fail?",
            answer: "Downloads can fail for a few reasons: 1) The video is private or age-restricted. 2) The video has been deleted. 3) Our server is under heavy load. 4) Your internet connection was interrupted. Please try refreshing the page and trying again."
        },
        {
            question: "What formats and qualities are supported?",
            answer: "We support MP4 video downloads in 1080p (Full HD), 720p (HD), and 480p. For audio, we support MP3 conversions in 320kbps (High Quality), 192kbps, and 128kbps."
        },
        {
            question: "Where are the files saved?",
            answer: "Files are saved to your device's default 'Downloads' folder. On mobile, they may appear in your browser's download manager or your 'Files' app."
        },
        {
            question: "Does Aura Downloader store my personal data?",
            answer: "No. We process your request efficiently and do not store any personal logs or specific download history on our servers. Your privacy is paramount."
        },
        {
            question: "Can I download Live streams?",
            answer: "Live streams can only be downloaded after the stream has ended and the video has been processed by YouTube into a regular video."
        },
        {
            question: "Why is there no audio in my 1080p video?",
            answer: "Sometimes YouTube separates video and audio streams for higher qualities. Our backend automatically merges them for you, so you should always get a complete file. If you find a file without audio, please report it as a bug."
        },
        {
            question: "How can I contact support?",
            answer: "Since this is a free tool, we offer limited direct support. However, if you are a developer or have a business inquiry, you can reach out via our GitHub repository issues page."
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-16 animate-fadeIn">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-purple">
                    Help Center
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                    Frequently Asked Questions & Support
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>

            <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-accent-purple/10 border border-primary/20 text-center">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Still have questions?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                    We're constantly improving. If you found a bug or have a feature request, we'd love to hear from you.
                </p>
                <a
                    href="mailto:aryanraut53@gmail.com"
                    className="inline-block px-8 py-3 rounded-xl bg-white dark:bg-[#1e1e1e] text-primary font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-700"
                >
                    Contact Developer
                </a>
            </div>
        </div>
    );
};

export default Help;
