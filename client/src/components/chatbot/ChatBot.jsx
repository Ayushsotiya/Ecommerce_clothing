import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MessageCircle, X, Send, Loader2, Trash2, Sparkles } from 'lucide-react';
import {
    toggleChat,
    addMessage,
    setConversationId,
    setLoading,
    setError,
    clearChat,
    addNegotiatedPrice,
    setPreFilledMessage
} from '@/slice/chatSlice';
import { applyNegotiatedPrice } from '@/slice/cartSlice';
import { sendChatMessage } from '@/services/operations/chatApi';
import ChatMessage from './ChatMessage';

const ChatBot = () => {
    const dispatch = useDispatch();
    const { isOpen, messages, conversationId, isLoading, error } = useSelector((state) => state.chat);
    const { token } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle pre-filled message
    const { preFilledMessage } = useSelector((state) => state.chat);
    useEffect(() => {
        if (preFilledMessage) {
            setInputMessage(preFilledMessage);
            // Clear it from state so it doesn't persist
            dispatch(setPreFilledMessage(null));
        }
    }, [preFilledMessage, dispatch]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();

        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        // Add user message to chat
        dispatch(addMessage({
            id: Date.now(),
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        }));

        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const result = await sendChatMessage(userMessage, conversationId, token);

            if (result.success) {
                // Update conversation ID
                if (result.conversationId) {
                    dispatch(setConversationId(result.conversationId));
                }

                // Add AI response
                dispatch(addMessage({
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: result.response,
                    timestamp: new Date().toISOString(),
                    usage: result.usage,
                    negotiation: result.negotiation || null
                }));

                // Handle accepted negotiation
                if (result.negotiation && 
                    (result.negotiation.status === 'accepted' || result.negotiation.status === 'final_offer_accepted')) {
                    const neg = result.negotiation;
                    
                    // Store in chat state
                    dispatch(addNegotiatedPrice({
                        productId: neg.productId,
                        price: neg.negotiatedPrice,
                        token: neg.token,
                        productName: neg.productName,
                        originalPrice: neg.originalPrice,
                        discount: neg.discount,
                        expiresAt: neg.expiresAt
                    }));
                    
                    // Apply to cart if product is in cart
                    const cartItem = cart.find(item => item._id === neg.productId);
                    if (cartItem) {
                        dispatch(applyNegotiatedPrice({
                            productId: neg.productId,
                            negotiatedPrice: neg.negotiatedPrice,
                            negotiationToken: neg.token,
                            discount: neg.discount
                        }));
                    }
                }
            } else {
                dispatch(setError(result.error));
                // Add error message
                dispatch(addMessage({
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: `Sorry, I encountered an error: ${result.error}. Please try again.`,
                    timestamp: new Date().toISOString(),
                    isError: true
                }));
            }
        } catch (err) {
            dispatch(setError(err.message));
            dispatch(addMessage({
                id: Date.now() + 1,
                role: 'assistant',
                content: 'Sorry, something went wrong. Please try again later.',
                timestamp: new Date().toISOString(),
                isError: true
            }));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleClearChat = () => {
        dispatch(clearChat());
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                onClick={() => dispatch(toggleChat())}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${isOpen
                    ? 'bg-red-500 hover:bg-red-600 rotate-0'
                    : 'bg-gradient-to-r from-yellow-600 to-indigo-600 hover:from-yellow-700 hover:to-indigo-700'
                    }`}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white" />
                )}

                {/* Pulse animation when closed */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500"></span>
                    </span>
                )}
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-24 right-6 z-50 w-[380px] h-[550px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right ${isOpen
                    ? 'scale-100 opacity-100 pointer-events-auto'
                    : 'scale-95 opacity-0 pointer-events-none'
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-600 to-indigo-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Shopping Assistant</h3>
                            <p className="text-white/70 text-xs">Ask me about products & orders</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClearChat}
                        className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                        title="Clear chat"
                    >
                        <Trash2 className="w-4 h-4 text-white/80" />
                    </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-600/20 to-indigo-600/20 flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 text-yellow-500" />
                            </div>
                            <h4 className="text-gray-900 font-medium mb-2">How can I help you?</h4>
                            <p className="text-gray-500 text-sm mb-6">
                                I can help you find products, check your orders, and answer questions about our store.
                            </p>
                            <div className="space-y-2 w-full">
                                <button
                                    onClick={() => setInputMessage("Show me trending shirts")}
                                    className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    🔍 Show me trending shirts
                                </button>
                                <button
                                    onClick={() => setInputMessage("What are my recent orders?")}
                                    className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    📦 What are my recent orders?
                                </button>
                                <button
                                    onClick={() => setInputMessage("Find products under $50")}
                                    className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    💰 Find products under $50
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <ChatMessage key={message.id} message={message} />
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
                                            <span className="text-sm text-gray-500">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!inputMessage.trim() || isLoading}
                            className="p-3 rounded-xl bg-gradient-to-r from-yellow-600 to-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-yellow-700 hover:to-indigo-700 transition-all transform active:scale-95"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {!token && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            💡 Log in to check your orders
                        </p>
                    )}
                </form>
            </div>
        </>
    );
};

export default ChatBot;
