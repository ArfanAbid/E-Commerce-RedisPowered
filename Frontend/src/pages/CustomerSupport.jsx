import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CustomerSupport = () => {
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");

    const questions = [
        'What is the best sale offer on ShopMart today?',
        'How can I start selling on ShopMart?',
        'What are the Popular Things on ShopMart?',
        'Is cash on delivery better than online payment?',
    ];

    const bannedWords = ["sex", "politics", "violence", "religion"];

    const handleSubmit = async (query) => {
        if (bannedWords.some((word) => query.toLowerCase().includes(word))) {
            setResponse("I'm only able to help with questions about our store, products, and services.");
            return;
        }

        setIsLoading(true);
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

        if (!apiKey) {
            console.error("API Key is missing or not loaded.");
            setResponse("Error: Missing API key.");
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                model: "llama3-8b-8192",
                messages: [
                            {
                            role: "system",
                            content: `
                            You are ShopBot — a professional virtual assistant for ShopMart, an online eCommerce platform similar to Daraz. Your job is to help customers with:

                            • Ongoing sales, discounts, and promotional offers  
                            • Popular products and trending categories  
                            • Order tracking and shipping information  
                            • Return, refund, and cancellation policies  
                            • Payment methods (cash on delivery, credit/debit card, wallet)  
                            • How to register as a seller or use the ShopMart platform

                            ❌ You MUST NOT answer any question unrelated to ShopMart. This includes topics like programming, education, politics, AI, religion, technology, or personal questions.

                            If a user asks an off-topic or inappropriate question, politely respond with:

                            > "I'm here to help with ShopMart-related questions like your orders, products, or services. Please ask something related to ShopMart."

                            ✅ Keep replies brief, helpful, and professional. Do not guess or invent answers. If you are unsure, refer the user to human support.

                            📞 For further assistance, you may contact our support representative:
                            **Arfan Abid – 0302 0103050**

                            `.trim()
                            }
,
                    { role: "user", content: query },
                ],
            };

            const result = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify(payload),
            });

            if (!result.ok) throw new Error(`API Error: ${result.statusText}`);

            const data = await result.json();
            setResponse(data.choices[0].message.content);
        } catch (error) {
            console.error("Error during API call:", error);
            setResponse("Sorry, there was an error processing your request.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleQueryChange = (e) => setQuery(e.target.value);

    const handlePredefinedQuestionClick = (question) => {
        setQuery(question);
        handleSubmit(question);
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter' && query.trim()) {
                handleSubmit(query);
            }
        };
        document.addEventListener('keypress', handleKeyPress);
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, [query]);

    return (
        <div className="min-h-screen text-gray-300 flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="py-8"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
                    Customer Support
                </h1>
            </motion.div>
            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
                <motion.form
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (query.trim()) handleSubmit(query);
                    }}
                    className="mb-8"
                >
                    <div className="flex shadow-lg">
                        <input
                            type="text"
                            value={query}
                            onChange={handleQueryChange}
                            maxLength={200}
                            placeholder="Ask about products, orders, delivery, or offers..."
                            className="flex-grow px-6 py-4 bg-gray-700 text-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg transition-all duration-300"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-r-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 text-lg"
                        >
                            {isLoading ? (
                                <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></span>
                            ) : (
                                "Ask"
                            )}
                        </button>
                    </div>
                </motion.form>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-semibold mb-4 text-emerald-400">
                        Common Questions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {questions.map((question, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePredefinedQuestionClick(question)}
                                className="text-left px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md"
                            >
                                {question}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="rounded-lg p-6 min-h-[200px] transition-all duration-300 ease-in-out bg-gray-700 shadow-xl"
                >
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex justify-center items-center h-full"
                            >
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
                            </motion.div>
                        ) : response ? (
                            <motion.div
                                key="response"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-gray-300 space-y-4"
                            >
                                <p className="text-lg leading-relaxed">{response}</p>
                            </motion.div>
                        ) : (
                            <motion.p
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-gray-400 italic text-lg text-center"
                            >
                                Your response will appear here...
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center py-4 text-gray-500 text-sm"
            >
                © 2024 Customer Support. All rights reserved.
            </motion.footer>
        </div>
    );
};

export default CustomerSupport;
