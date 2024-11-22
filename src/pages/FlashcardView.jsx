import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import BoolButton from "../components/BoolButton";
import ManualCards from '../components/ManualCards';

import { useAuth } from "../contexts/authContext";
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, writeBatch, doc, setDoc, getDoc } from "firebase/firestore"


// TODO: save as environment variable 
// Your Firebase configuration
const firebaseConfig = {
removed
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


function FlashcardView() {
    const { setId } = useParams();
    const { userId } = useParams()

    const [isChecked, setIsChecked] = useState(false);
    const { currentUser, userLoggedIn } = useAuth()

    const [data, setData] = useState([]);

    const [rows, setRows] = useState([['', '']]);

    const loadCards = async () => {

        if (!userLoggedIn) return

        try {
            const docRef = doc(db, `users/${currentUser.uid}/items/flashcardSets`);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const flashcardData = docSnap.data()[setId];
                const questions = [];
                const answers = [];
                const loadedRows = flashcardData.map((item) => {
                    const question = Object.keys(item)[0];
                    const answer = item[question];
                    questions.push(question);
                    answers.push(answer);
                    return [question, answer];
                });

                setRows(loadedRows);
                setData({ qs: questions, as: answers });
                console.log('Flashcards successfully loaded from Firestore');
            } else {
                console.log('No such document!');
            }
    
        } catch (error) {
            console.log('Error loading flashcards from Firestore', error);
        }
    };

    useEffect(() => {
        loadCards();
    }, [userId, setId, db])

    const writeCards = async () =>{
        if (!userLoggedIn) return;

        try {
            
            const flashcardData = {
                [setId]: rows.map(([question, answer]) => ({
                    [question]: answer,
                }))
            };

            const docRef = doc(db, `users/${currentUser.uid}/items/flashcardSets`)
            await setDoc(docRef, flashcardData, { merge: true });
            console.log('Flashcards successfully added to Firestore');

            loadCards()
        } catch (error) {
            console.log(error)
        }
    }

    const handleInputChange = (value, rowIndex, colIndex) => {
        const newRows = [...rows];
        newRows[rowIndex][colIndex] = value;
        setRows(newRows);
    };

    const handleAddRow = () => {
        setRows([...rows, ['', '']]); // Add a new row with two empty inputs
    };    

    const handleDeleteRow = (index) => {
        const newRows = rows.filter((_, rowIndex) => rowIndex !== index);
        setRows(newRows);
    };

    const toggleChecked = () => {
        setIsChecked(!isChecked);
    };

    


    return (
        <div className="flex flex-col w-full h-screen items-center justify-center">
            <div className="text-bgl text-6xl pb-6">
                {setId}
            </div>
            {!isChecked ? (
                <div className="flex flex-col w-5/6 h-5/6 overflow-y-scroll border-y-8 border-bgd p-6">
                    {data.qs && data.qs.map((question, index) => (
                        <FlashCard key={index} question={question} answer={data.as[index]} />
                    ))}
                </div>
            ):(
                <div className="flex flex-col w-5/6 h-5/6 overflow-y-scroll border-y-8 border-bgd p-6">
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex w-full justify-around mb-4 items-center pt-4">
                            <div className="flex p-2 w-5/6 h-128 justify-center bg-bgd rounded-xl justify-around items-center shadow-xl">
                                {row.map((input, colIndex) => (
                                    <ManualCards
                                    key={colIndex}
                                    input={input}
                                    index={colIndex}
                                    onChange={(value) => handleInputChange(value, rowIndex, colIndex)}
                                    />
                                ))}
                                <button
                                    className="w-12 h-12 rounded-full bg-qr text-5xl text-white font-bold hover:opacity-80"
                                    onClick={() => handleDeleteRow(rowIndex)}
                                >
                                    -
                                </button>
                            </div>
                            
                        </div>
                    ))}
                    <button className="bg-clg rounded-lg p-4 mr-4 hover:opacity-80" onClick={handleAddRow}>Add Card</button>
                </div>)}
            
            <div className="flex justify-center items-center">
                {!isChecked ? (
                    <div className="flex flex-row items-center">
                        <div className="text-bgl text-5xl">Study</div>
                        <BoolButton isChecked={isChecked} toggleChecked={toggleChecked} />
                    </div>)
                :(
                    <div className="flex flex-row items-center">
                        <div className="text-bgl text-5xl">Edit</div>
                        <BoolButton isChecked={isChecked} toggleChecked={toggleChecked} />
                        <div className="p-1.5">{userLoggedIn ? (<button className="bg-textcl rounded-full w-10 h-10 md:w-14 md:h-14 leading-none text-white text-[2rem] md:text-[2.75rem] pb-2" onClick={writeCards}>+</button>):(<></>)}</div>
                    </div>)}
                
                
                
            </div>
            
            
        </div>
    );
}

export default FlashcardView;
