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

    // Parse markdown-like formatting (bold, bullet points)
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
                        <strong key={partIndex} className="font-semibold">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                return part;
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
                : 'bg-gradient-to-r from-violet-600 to-indigo-600'
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
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm'
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
