import { motion } from "framer-motion"
import React, { useState } from "react"
//This is Q|A formatted flashcard

function FlashCard({ question, answer }){
    //handle hover animation
    const [showAnswer, setShowAnswer] = useState(false);

    //handle show answer or not
    const toggleAnswer = () => {
        setShowAnswer(!showAnswer)
    }
    return(<>
        <div onClick={toggleAnswer} className="flex w-full justify-center items-center pt-6">
            <div className="flex flex-row w-5/6 h-128 bg-bgd rounded-xl justify-around items-center shadow-xl">
                <div className="flex text-bgl w-5/6 max-h-64 justify-center text-2xl p-4 overflow-y-scroll">
                    {showAnswer ? answer:question}
                </div>
            </div>
        </div>
    </>)
}

export default FlashCard