import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EcommerceAIAgent = () => {
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [conversationHistory, setConversationHistory] = useState([]);

    // Store Configuration - Customize this for your store
    const storeContext = {
        storeName: "ShopMart",
        description: "a leading e-commerce platform",
        categories: ["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty", "Automotive"],
        shippingPolicy: "Free shipping on orders over $50. Standard delivery 3-5 business days",
        returnPolicy: "30-day hassle-free return policy with free return shipping",
        paymentMethods: ["Credit/Debit Cards", "PayPal", "Cash on Delivery", "Bank Transfer", "Digital Wallets"],
        supportContact: "support@shopmart.com",
        phone: "1-800-SHOPMART",
        services: ["24/7 Customer Support", "Express Delivery", "Easy Returns", "Price Match Guarantee"],
        workingHours: "Customer support available Monday-Sunday, 8AM-10PM"
    };

    // Enhanced predefined questions for e-commerce
    const predefinedQuestions = [
        'What payment methods do you accept?',
        'How long does shipping take and what are the costs?',
        'What is your return and refund policy?',
        'Do you offer cash on delivery?',
        'How can I track my order status?',
        'What are your customer support hours?',
        'How do I cancel or modify my order?',
        'Do you have any current sales or promotions?',
        'How can I become a seller on your platform?',
        'What are your most popular product categories?',
        'Do you offer warranty on electronics?',
        'How do I create an account or reset my password?'
    ];

    // Comprehensive knowledge base for instant responses
    const knowledgeBase = {
        payment: `We accept multiple payment methods for your convenience:
• Credit/Debit Cards (Visa, MasterCard, American Express)
• PayPal and digital wallets
• Cash on Delivery (COD) - available in most areas
• Bank transfers and online banking
• Buy now, pay later options available
All transactions are secured with 256-bit SSL encryption.`,

        shipping: `Our shipping options:
• Standard Shipping: 3-5 business days
• Express Shipping: 1-2 business days (additional fee)
• Same-day delivery available in select cities
• FREE shipping on orders over $50
• International shipping available to 50+ countries
You'll receive tracking information via email once your order ships.`,

        returns: `Our customer-friendly return policy:
• 30-day return window from delivery date
• Items must be in original condition with tags
• Free return shipping for defective items
• Refunds processed within 5-7 business days
• Exchange option available for size/color changes
• No questions asked for damaged or wrong items`,

        cod: `Cash on Delivery (COD) is available:
• Available in most cities and towns
• Small COD processing fee may apply
• Payment accepted in local currency
• Inspect items before payment
• COD orders cannot be cancelled once shipped
• Maximum COD limit: $500 per order`,

        tracking: `Track your order easily:
• Use your order number on our tracking page
• Check "My Orders" section in your account
• Tracking SMS and email updates
• Real-time delivery status
• Estimated delivery time updates
• Contact support if tracking shows no updates for 48+ hours`,

        support: `Our customer support:
• Available ${storeContext.workingHours}
• Phone: ${storeContext.phone}
• Email: ${storeContext.supportContact}
• Live chat on website and mobile app
• Social media support on Facebook/Twitter
• Average response time: Under 2 hours`,

        cancel: `Order cancellation process:
• Cancel within 1 hour of placement for instant cancellation
• After 1 hour: Contact support immediately
• If order hasn't shipped: Full refund processed
• If order shipped: Return process applies
• Cancellation fees may apply for COD orders
• Refunds take 3-5 business days to process`,

        seller: `Become a seller on ${storeContext.storeName}:
• Register as a business seller
• Provide business documentation
• Complete seller verification process
• List your products with competitive pricing
• Commission rates start from 8-15% depending on category
• Access to seller dashboard and analytics
• Marketing and promotional tools available`,

        popular: `Our most popular categories:
• Electronics: Smartphones, laptops, accessories
• Fashion: Clothing, shoes, jewelry for all ages
• Home & Garden: Furniture, decor, appliances
• Beauty: Skincare, makeup, personal care
• Sports: Fitness equipment, outdoor gear
• Books: Fiction, non-fiction, educational
Check our "Trending Now" section for current bestsellers!`,

        promotions: `Current offers and promotions:
• New customer discount: 15% off first order
• Flash sales every Friday with up to 70% off
• Free shipping weekends
• Seasonal clearance sales
• Bundle deals on electronics and fashion
• Loyalty program with reward points
• Subscribe to our newsletter for exclusive deals!`
    };

    // Enhanced relevance checking
    const isRelevantQuery = (query) => {
        const relevantKeywords = [
            // Shopping & Orders
            'order', 'buy', 'purchase', 'cart', 'checkout', 'payment', 'pay',
            // Shipping & Delivery
            'shipping', 'delivery', 'ship', 'track', 'tracking', 'deliver',
            // Returns & Refunds
            'return', 'refund', 'exchange', 'cancel', 'cancellation',
            // Products & Categories
            'product', 'item', 'category', 'electronics', 'fashion', 'price',
            // Account & Support
            'account', 'login', 'register', 'support', 'help', 'customer service',
            // Store Policies
            'policy', 'warranty', 'guarantee', 'cod', 'cash on delivery',
            // Sales & Promotions
            'sale', 'discount', 'offer', 'deal', 'promotion', 'coupon',
            // Seller Related
            'sell', 'seller', 'vendor', 'merchant', 'business',
            // General Store
            'store', 'shop', 'marketplace', 'platform', 'website'
        ];
        
        const queryLower = query.toLowerCase();
        return relevantKeywords.some(keyword => queryLower.includes(keyword));
    };

    // Smart response matching
    const getQuickResponse = (query) => {
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes('payment') || lowerQuery.includes('pay')) {
            return knowledgeBase.payment;
        }
        if (lowerQuery.includes('shipping') || lowerQuery.includes('delivery') || lowerQuery.includes('ship')) {
            return knowledgeBase.shipping;
        }
        if (lowerQuery.includes('return') || lowerQuery.includes('refund') || lowerQuery.includes('exchange')) {
            return knowledgeBase.returns;
        }
        if (lowerQuery.includes('cod') || lowerQuery.includes('cash on delivery')) {
            return knowledgeBase.cod;
        }
        if (lowerQuery.includes('track') || lowerQuery.includes('tracking')) {
            return knowledgeBase.tracking;
        }
        if (lowerQuery.includes('support') || lowerQuery.includes('contact') || lowerQuery.includes('help')) {
            return knowledgeBase.support;
        }
        if (lowerQuery.includes('cancel')) {
            return knowledgeBase.cancel;
        }
        if (lowerQuery.includes('sell') || lowerQuery.includes('seller') || lowerQuery.includes('vendor')) {
            return knowledgeBase.seller;
        }
        if (lowerQuery.includes('popular') || lowerQuery.includes('trending') || lowerQuery.includes('category')) {
            return knowledgeBase.popular;
        }
        if (lowerQuery.includes('sale') || lowerQuery.includes('discount') || lowerQuery.includes('offer') || lowerQuery.includes('promotion')) {
            return knowledgeBase.promotions;
        }
        
        return null;
    };

    // Build advanced system prompt
    const buildSystemPrompt = () => {
        return `You are the official AI customer support agent for "${storeContext.storeName}", ${storeContext.description}.

STORE INFORMATION:
• Store Name: ${storeContext.storeName}
• Product Categories: ${storeContext.categories.join(", ")}
• Shipping Policy: ${storeContext.shippingPolicy}
• Return Policy: ${storeContext.returnPolicy}
• Payment Methods: ${storeContext.paymentMethods.join(", ")}
• Support Contact: ${storeContext.supportContact}
• Phone: ${storeContext.phone}
• Working Hours: ${storeContext.workingHours}

EXPERTISE AREAS:
🛍️ PRODUCT SUPPORT
- Product recommendations and comparisons
- Stock availability and restocking updates
- Category browsing and popular items
- Specifications and feature explanations

💰 SALES & OFFERS
- Current promotions and discount codes
- Flash sales and limited-time deals
- Bulk purchase discounts and bundle offers
- Seasonal sales events and clearance

📦 ORDER & SHIPPING
- Order status tracking and updates
- Delivery timeframes and shipping options
- Shipping costs and free shipping eligibility
- Address changes and delivery instructions

💳 PAYMENTS & REFUNDS
- Payment method guidance and security
- Transaction issues and failed payments
- Refund processing and timelines
- Cash on delivery availability and limits

🔄 RETURNS & EXCHANGES
- Return eligibility and step-by-step procedures
- Exchange process and requirements
- Refund vs store credit options
- Damaged or defective item handling

👤 ACCOUNT & SELLER SUPPORT
- Account registration and login assistance
- Profile and preference management
- How to become a seller on our platform
- Seller tools and dashboard guidance

RESPONSE STANDARDS:
✅ Always prioritize customer satisfaction and problem-solving
✅ Provide step-by-step guidance when needed
✅ Reference specific store policies and information
✅ Offer multiple solutions when possible
✅ Use clear, friendly, and professional language
✅ Keep responses concise but comprehensive (2-4 sentences max)
✅ End with helpful follow-up when appropriate

BOUNDARY ENFORCEMENT:
❌ Only answer e-commerce and shopping-related questions
❌ Politely redirect non-shopping questions: "I specialize in helping with shopping, orders, and store services. How can I assist you with your ${storeContext.storeName} experience today?"
❌ Do not provide personal advice unrelated to shopping
❌ Do not discuss topics outside of e-commerce scope

ESCALATION PATH:
For complex issues requiring human intervention: "I'd like to connect you with our specialized support team at ${storeContext.supportContact} or ${storeContext.phone} for personalized assistance with this matter."

TONE: Friendly, professional, helpful, and solution-oriented. Always aim to enhance the customer's shopping experience.`;
    };

    const handleSubmit = async (userQuery) => {
        setIsLoading(true);
        
        // Add user query to conversation
        setConversationHistory(prev => [...prev, { type: 'user', content: userQuery }]);
        
        // Check if query is relevant to e-commerce
        if (!isRelevantQuery(userQuery)) {
            const redirectResponse = `I specialize in helping with shopping, orders, payments, shipping, returns, and store services. How can I assist you with your ${storeContext.storeName} experience today? 

You can ask me about:
• Product information and recommendations
• Order tracking and delivery
• Payment methods and refunds
• Returns and exchanges
• Current sales and promotions
• How to become a seller`;
            
            setResponse(redirectResponse);
            setConversationHistory(prev => [...prev, { type: 'agent', content: redirectResponse }]);
            setIsLoading(false);
            return;
        }

        // Try quick response first for common queries
        const quickResponse = getQuickResponse(userQuery);
        if (quickResponse) {
            setResponse(quickResponse);
            setConversationHistory(prev => [...prev, { type: 'agent', content: quickResponse }]);
            setIsLoading(false);
            return;
        }

        // Use AI for more complex queries
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

        if (!apiKey) {
            console.error("API Key is missing or not loaded.");
            const fallbackResponse = `I'm experiencing technical difficulties right now. For immediate assistance, please:

• Email us at ${storeContext.supportContact}
• Call us at ${storeContext.phone}
• Use the live chat on our website
• Check our FAQ section for common questions

Our support team is available ${storeContext.workingHours} and will be happy to help you!`;
            
            setResponse(fallbackResponse);
            setConversationHistory(prev => [...prev, { type: 'agent', content: fallbackResponse }]);
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: buildSystemPrompt() },
                    { role: "user", content: userQuery }
                ],
                max_tokens: 300,
                temperature: 0.7,
                top_p: 0.9,
                frequency_penalty: 0.1,
                presence_penalty: 0.1
            };

            const result = await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!result.ok) {
                throw new Error(`API Error: ${result.statusText}`);
            }

            const data = await result.json();
            const aiResponse = data.choices[0].message.content;
            
            setResponse(aiResponse);
            setConversationHistory(prev => [...prev, { type: 'agent', content: aiResponse }]);
            
        } catch (error) {
            console.error("Error during API call:", error);
            const errorResponse = `I'm having trouble connecting right now. Please try again in a moment, or contact our support team directly:

📧 Email: ${storeContext.supportContact}
📞 Phone: ${storeContext.phone}
💬 Live chat available on our website

Our team is ready to help you ${storeContext.workingHours}`;
            
            setResponse(errorResponse);
            setConversationHistory(prev => [...prev, { type: 'agent', content: errorResponse }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQueryChange = (e) => setQuery(e.target.value);

    const handlePredefinedQuestionClick = (question) => {
        setQuery(question);
        handleSubmit(question);
    };

    const clearConversation = () => {
        setConversationHistory([]);
        setResponse("");
        setQuery("");
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter' && query.trim() && !isLoading) {
                handleSubmit(query);
                setQuery("");
            }
        };

        document.addEventListener('keypress', handleKeyPress);
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, [query, isLoading]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-gray-100">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="py-8 px-4"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text text-white">
                        🤖 {storeContext.storeName} AI Assistant
                    </h1>
                    <p className="text-xl text-gray-300 mb-2">
                        Smart Customer Support • Available 24/7
                    </p>
                    <p className="text-sm text-gray-400">
                        Get instant help with orders, shipping, returns, and more
                    </p>
                </div>
            </motion.header>

            <main className="container mx-auto px-4 pb-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Chat Interface */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Input Form */}
                        <motion.form
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (query.trim() && !isLoading) {
                                    handleSubmit(query);
                                    setQuery("");
                                }
                            }}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                        >
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={handleQueryChange}
                                    placeholder="Ask me about products, orders, shipping, returns, payments..."
                                    className="flex-grow px-6 py-4 bg-gray-700/80 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700 text-lg transition-all duration-300 placeholder-gray-400"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !query.trim()}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-lg min-w-[120px]"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-2"></span>
                                            Thinking...
                                        </span>
                                    ) : (
                                        "Ask AI 🚀"
                                    )}
                                </button>
                            </div>
                        </motion.form>

                        {/* Response Area */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 min-h-[400px]"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-semibold text-blue-400 flex items-center">
                                        💬 AI Assistant Response
                                        <div className="ml-3 flex items-center">
                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="ml-2 text-sm text-green-400">Online</span>
                                        </div>
                                    </h3>
                                    {conversationHistory.length > 0 && (
                                        <button
                                            onClick={clearConversation}
                                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
                                        >
                                            🗑️ Clear Chat
                                        </button>
                                    )}
                                </div>

                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center justify-center py-16"
                                        >
                                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                                            <p className="text-gray-400 text-lg">AI is analyzing your question...</p>
                                        </motion.div>
                                    ) : response ? (
                                        <motion.div
                                            key="response"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-4"
                                        >
                                            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 rounded-xl border-l-4 border-blue-500">
                                                <pre className="text-gray-100 leading-relaxed whitespace-pre-wrap font-sans text-base">
                                                    {response}
                                                </pre>
                                            </div>
                                            <div className="text-center pt-4">
                                                <p className="text-sm text-gray-400">
                                                    💡 Need more help? Ask another question or contact our support team!
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="welcome"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center py-16"
                                        >
                                            <div className="text-6xl mb-4">🛍️</div>
                                            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
                                                Welcome to {storeContext.storeName}!
                                            </h3>
                                            <p className="text-gray-400 text-lg mb-6">
                                                I'm your AI shopping assistant. I can help you with:
                                            </p>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm text-gray-300">
                                                <div className="flex items-center"><span className="mr-2">📦</span>Order Tracking</div>
                                                <div className="flex items-center"><span className="mr-2">💳</span>Payment Help</div>
                                                <div className="flex items-center"><span className="mr-2">🚚</span>Shipping Info</div>
                                                <div className="flex items-center"><span className="mr-2">↩️</span>Returns & Refunds</div>
                                                <div className="flex items-center"><span className="mr-2">🏷️</span>Sales & Offers</div>
                                                <div className="flex items-center"><span className="mr-2">🛒</span>Product Questions</div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Questions */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                        >
                            <h3 className="text-xl font-semibold mb-4 text-purple-400 flex items-center">
                                ⚡ Quick Questions
                            </h3>
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {predefinedQuestions.map((question, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handlePredefinedQuestionClick(question)}
                                        className="w-full text-left px-4 py-3 bg-gray-700/60 hover:bg-gray-600/80 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-200 hover:text-white"
                                        disabled={isLoading}
                                    >
                                        {question}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Store Information */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                        >
                            <h3 className="text-xl font-semibold mb-4 text-green-400 flex items-center">
                                🏪 Store Information
                            </h3>
                            <div className="space-y-3 text-sm text-gray-300">
                                <div>
                                    <span className="font-semibold text-blue-400">Categories:</span>
                                    <p className="mt-1">{storeContext.categories.join(', ')}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-blue-400">Services:</span>
                                    <p className="mt-1">{storeContext.services.join(', ')}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-blue-400">Support:</span>
                                    <p className="mt-1">{storeContext.workingHours}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-blue-400">Contact:</span>
                                    <p className="mt-1">{storeContext.supportContact}</p>
                                    <p>{storeContext.phone}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* AI Status */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/50 rounded-2xl p-6"
                        >
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-3">
                                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse mr-2"></div>
                                    <span className="text-green-400 font-semibold">AI Agent Active</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-2">
                                    Specialized E-commerce Support
                                </p>
                                <div className="text-xs text-gray-500">
                                    Response Time: &lt; 3 seconds
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="border-t border-gray-700 bg-gray-900/50 py-6 text-center"
            >
                <p className="text-gray-400 text-sm">
                    © 2024 {storeContext.storeName} - AI-Powered Customer Support | 
                    <span className="text-blue-400 ml-1">Enhancing Your Shopping Experience</span>
                </p>
            </motion.footer>
        </div>
    );
};

export default EcommerceAIAgent;