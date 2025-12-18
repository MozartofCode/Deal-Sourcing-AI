function Message({ message }) {
  const isUser = message.role === 'user'
  const isError = message.isError

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-gray-800 text-white'
            : isError
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        {message.timestamp && (
          <div
            className={`text-xs mt-2 ${
              isUser ? 'text-gray-300' : 'text-gray-500'
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}

export default Message

