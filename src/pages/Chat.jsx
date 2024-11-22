import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";

//chatbox is container for messages and input fields
function Chat(){
    return(<>
        <div className="flex w-full h-screen">
            <ChatBox/>
        </div>
        
    </>)
}

export default Chat