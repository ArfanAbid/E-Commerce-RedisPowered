import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import storeData from "../data/shopmart.json";

const getContext = (query) => {
    const q = query.toLowerCase();
    const has = (...words) => words.some((w) => q.includes(w));
    const { store, currentOffers, categories, policies, sellerProgram, orderTracking, faq } = storeData;

    const parts = [];

    // Store contact — always a short anchor
    parts.push(`Support: ${store.contact.supportAgent} ${store.contact.phone} | Hours: ${store.contact.workingHours}`);

    if (has("offer", "sale", "discount", "deal", "promo", "coupon", "code", "today", "best")) {
        parts.push(
            "OFFERS:\n" +
            currentOffers.map((o) =>
                `- ${o.title}: ${o.description}${o.code ? ` (Code: ${o.code})` : ""}${o.validUntil ? ` | Valid: ${o.validUntil}` : ""}`
            ).join("\n")
        );
    }

    if (has("product", "popular", "trending", "category", "thing", "buy", "item")) {
        parts.push(
            "CATEGORIES:\n" +
            categories.map((c) => `- ${c.name}: ${c.topProducts.join(", ")}`).join("\n")
        );
    }

    if (has("return", "refund", "damage", "wrong", "exchange", "replace")) {
        const r = policies.returns;
        parts.push(
            `RETURNS: Window: ${r.window} | ${r.eligibility} | Process: ${r.process} | Damaged: ${r.damagedItem}`
        );
    }

    if (has("ship", "deliver", "how long", "fast", "free shipping", "arrive")) {
        const sh = policies.shipping;
        parts.push(
            `SHIPPING: Standard: ${sh.standard.duration}, ${sh.standard.cost} | Express: ${sh.express.duration}, ${sh.express.cost} | Coverage: ${sh.coverage}`
        );
    }

    if (has("track", "where", "status", "shipped", "out for delivery")) {
        const t = orderTracking;
        parts.push(
            `TRACKING: ${t.howToTrack}\nStatuses: ${t.statuses.map((s) => `${s.status}=${s.meaning}`).join(" | ")}`
        );
    }

    if (has("pay", "payment", "cod", "cash", "card", "jazz", "easypaisa", "online", "wallet")) {
        const p = policies.payments;
        parts.push(
            `PAYMENTS: ${p.availableMethods.join(", ")} | COD: ${p.codDetails} | Security: ${p.security}`
        );
    }

    if (has("cancel")) {
        const c = policies.cancellation;
        parts.push(`CANCELLATION: ${c.beforeShipment} | After shipping: ${c.afterShipment} | Refund: ${c.refundTimeline}`);
    }

    if (has("sell", "seller", "vendor", "register", "commission", "payout")) {
        const s = sellerProgram;
        parts.push(
            `SELLER: Register: ${s.howToRegister} | Requirements: ${s.requirements.join(", ")} | Commission: ${s.commission} | Payouts: ${s.payoutSchedule}`
        );
    }

    // Nothing topic-specific matched — fall back to FAQ only
    if (parts.length === 1) {
        parts.push("FAQ:\n" + faq.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n"));
    }

    return parts.join("\n\n");
};

const buildSystemPrompt = (context) =>
    `You are ShopBot, the virtual assistant for ShopMart. Answer using ONLY the data below. If not in the data, say you don't have that info and give the support contact. Never answer off-topic questions. Be concise.\n\nDATA:\n${context}`;


const BANNED_WORDS = ["sex", "politics", "violence", "religion"];

const QUESTIONS = [
    "What is the best sale offer on ShopMart today?",
    "How can I start selling on ShopMart?",
    "What are the popular things on ShopMart?",
    "Is cash on delivery better than online payment?",
];

const CustomerSupport = () => {
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");

    const handleSubmit = async (userQuery) => {
        const trimmed = userQuery.trim();
        if (!trimmed || isLoading) return;

        if (BANNED_WORDS.some((w) => trimmed.toLowerCase().includes(w))) {
            setResponse("I'm only able to help with questions about our store, products, and services.");
            return;
        }

        setResponse("");
        setIsLoading(true);

        const apiKey = import.meta.env.VITE_GROQ_API_KEY;

        if (!apiKey) {
            setResponse("Error: API key is not configured.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    max_tokens: 300,
                    messages: [
                        { role: "system", content: buildSystemPrompt(getContext(trimmed)) },
                        { role: "user", content: trimmed },
                    ],
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                const msg = data?.error?.message || res.statusText;
                console.error("Groq API error:", msg);
                setResponse(`Error: ${msg}`);
                return;
            }

            setResponse(data.choices[0].message.content);
        } catch (err) {
            console.error("Groq API error:", err);
            setResponse(`Network error: ${err.message}. Check your connection and try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const onKeyPress = (e) => {
            if (e.key === "Enter" && query.trim() && e.target.tagName !== "INPUT") {
                handleSubmit(query);
            }
        };
        document.addEventListener("keypress", onKeyPress);
        return () => document.removeEventListener("keypress", onKeyPress);
    }, [query]);

    return (
        <div className="min-h-screen text-gray-300 flex flex-col">
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="py-10 text-center"
            >
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
                        Customer Support
                    </h1>
                </div>
                <p className="text-gray-500 text-sm flex items-center justify-center gap-1.5 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Powered by Groq AI · ShopBot
                </p>
            </motion.div>

            <main className="flex-grow container mx-auto px-4 pb-12 max-w-4xl">
                {/* Search bar */}
                <motion.form
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    onSubmit={(e) => { e.preventDefault(); handleSubmit(query); }}
                    className="mb-8"
                >
                    <div className="flex shadow-lg rounded-xl overflow-hidden ring-1 ring-gray-700 focus-within:ring-2 focus-within:ring-emerald-500 transition-all duration-300">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            maxLength={200}
                            placeholder="Ask about products, orders, delivery, or offers..."
                            className="flex-grow px-6 py-4 bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none text-base"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !query.trim()}
                            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold transition-all duration-300 focus:outline-none disabled:opacity-50 text-base min-w-[90px] flex items-center justify-center"
                        >
                            {isLoading ? (
                                <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                            ) : (
                                "Ask"
                            )}
                        </button>
                    </div>
                    <p className="text-right text-xs text-gray-600 mt-1 pr-1">{query.length}/200</p>
                </motion.form>

                {/* Common questions */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="mb-8"
                >
                    <h2 className="text-xl font-semibold mb-4 text-emerald-400">Common Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {QUESTIONS.map((q, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { setQuery(q); handleSubmit(q); }}
                                className="text-left px-5 py-4 bg-gray-800 border border-gray-700 hover:border-emerald-500/60 rounded-xl transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-md text-sm text-gray-300 hover:text-white"
                            >
                                <span className="text-emerald-400 mr-2 font-bold">→</span>
                                {q}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Response area */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="rounded-xl border border-gray-700 bg-gray-800 shadow-xl overflow-hidden"
                >
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-gray-400 font-medium tracking-wide">ShopBot Response</span>
                    </div>
                    <div className="p-6 min-h-[200px] flex items-center">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full flex flex-col items-center justify-center gap-3"
                                >
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" />
                                    <p className="text-sm text-gray-500">ShopBot is thinking...</p>
                                </motion.div>
                            ) : response ? (
                                <motion.div
                                    key="response"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full"
                                >
                                    <p className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
                                        {response}
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.p
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-gray-500 italic text-base text-center w-full"
                                >
                                    Your response will appear here...
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </main>

            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center py-4 text-gray-600 text-xs"
            >
                © 2024 ShopMart Customer Support · Powered by Groq AI
            </motion.footer>
        </div>
    );
};

export default CustomerSupport;
