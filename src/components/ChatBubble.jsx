function ChatBubble({ text, className }){
    //text block element for each sent message
    return(<>
        <div className={className}>
            <div className="">{text}</div>
        </div>
    </>)
}

export default ChatBubble