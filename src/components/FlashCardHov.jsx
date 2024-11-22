import { motion } from "framer-motion"
import React, { useState } from "react"
//This is Q--hover-->A formatted flashcard


function FlashCardHov({ question, answer }){
    const [scaled, setscale] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    //handle show answer or not
    const toggleAnswer = () => {
        setShowAnswer(!showAnswer)
    }

    return(<>
        <div className="Row">
            <motion.div onClick={toggleAnswer} whileHover={{scale: scaled? 1.2: 1}} onMouseEnter={()=>setscale(!scaled)} onMouseLeave={()=>setscale(!scaled)} className="flashcard">
                <div className="flashtext">
                    {showAnswer ? answer:question}
                </div>
            </motion.div>
        </div>
        <div className="carddivider"></div>
    </>)
}

export default FlashCardHov