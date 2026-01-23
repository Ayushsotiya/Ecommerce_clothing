import { User, Sparkles } from 'lucide-react';

const ChatMessage = ({ message }) => {
    const isUser = message.role === 'user';
    const isError = message.isError;

    // Format timestamp
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Check if URL is an image (handles file extensions and Cloudinary URLs)
    const isImageUrl = (url) => {
        // Check for common image extensions
        const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i;
        // Check for Cloudinary or other image CDN patterns
        const cloudinaryPattern = /cloudinary\.com|res\.cloudinary|\/image\/upload/i;
        return imageExtensions.test(url) || cloudinaryPattern.test(url);
    };

    // Check if it's a relative product URL
    const isProductUrl = (url) => {
        return /^\/product\/[a-zA-Z0-9]+/.test(url);
    };

    // Render a URL appropriately (as image or link)
    const renderUrl = (url, key, isRelative = false) => {
        const trimmedUrl = url.trim();
        
        if (isImageUrl(trimmedUrl)) {
            return (
                <img
                    key={key}
                    src={trimmedUrl}
                    alt="Product"
                    className="max-w-full h-auto rounded-lg my-2 max-h-40 object-cover"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            );
        }
        
        // Product link (relative URL)
        if (isRelative || isProductUrl(trimmedUrl)) {
            return (
                <a
                    key={key}
                    href={trimmedUrl}
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    View Product
                </a>
            );
        }
        
        // Regular external link
        return (
            <a
                key={key}
                href={trimmedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all"
            >
                {trimmedUrl}
            </a>
        );
    };

    // Process text to find and render URLs (both full and relative)
    const processUrls = (text, keyPrefix) => {
        if (typeof text !== 'string') return text;
        
        // Combined regex: matches full URLs (https://...) OR relative product URLs (/product/...)
        const urlRegex = /(https?:\/\/[^\s]+|\/product\/[a-zA-Z0-9]+)/g;
        const parts = text.split(urlRegex);
        
        if (parts.length === 1) return text;
        
        return parts.map((part, idx) => {
            // Check if this part is a URL
            if (/^https?:\/\//.test(part) || /^\/product\//.test(part)) {
                const isRelative = /^\/product\//.test(part);
                return renderUrl(part, `${keyPrefix}-url-${idx}`, isRelative);
            }
            return part;
        });
    };

    // Parse markdown-like formatting (bold, bullet points, URLs, images)
    const formatContent = (content) => {
        if (!content) return null;

        // Split by newlines and process each line
        const lines = content.split('\n');

        return lines.map((line, index) => {
            // Process bold text (**text**)
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            const processedLine = parts.map((part, partIndex) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <strong key={`bold-${index}-${partIndex}`} className="font-semibold">
                            {processUrls(part.slice(2, -2), `bold-${index}-${partIndex}`)}
                        </strong>
                    );
                }
                // Process URLs in regular text
                return processUrls(part, `text-${index}-${partIndex}`);
            });

            // Check if line starts with bullet point indicators
            const isBullet = line.trim().match(/^[-•]\s|^\d+\.\s/);

            return (
                <span key={index} className={isBullet ? 'block ml-4' : 'block'}>
                    {processedLine}
                    {index < lines.length - 1 && <br />}
                </span>
            );
        });
    };

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser
                ? 'bg-gray-200'
                : 'bg-gradient-to-r from-yellow-600 to-indigo-600'
                }`}>
                {isUser ? (
                    <User className="w-4 h-4 text-gray-700" />
                ) : (
                    <Sparkles className="w-4 h-4 text-white" />
                )}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl px-4 py-3 ${isUser
                    ? 'bg-gradient-to-r from-yellow-600 to-indigo-600 text-white rounded-tr-sm'
                    : isError
                        ? 'bg-red-50 border border-red-200 text-red-600 rounded-tl-sm'
                        : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                    }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {formatContent(message.content)}
                    </div>
                </div>

                {/* Timestamp */}
                <div className={`flex items-center gap-2 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-gray-400">
                        {formatTime(message.timestamp)}
                    </span>
                    {message.usage && (
                        <span className="text-[10px] text-gray-300">
                            • {message.usage.remainingRequests} requests left
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
