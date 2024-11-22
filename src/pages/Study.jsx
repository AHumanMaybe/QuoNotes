import React, { useState, useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useNavigate } from 'react-router-dom';

import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, writeBatch, doc, setDoc, getDoc } from "firebase/firestore"

import { useAuth } from "../contexts/authContext";
import CollectionSelection from "../components/CollectionSelection";

import LoadAnim from "../components/LoadAnim";

// TODO: save as environment variable 
// Your Firebase configuration
const firebaseConfig = {
  removed
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Study() {

    const navigate = useNavigate()

    const [isLoading, setisLoading] = useState(false)

    const [selectedCollection, setSelectedCollection] = useState('default')
    const [selectedFlashSet, setSelectedFlashSet] = useState('')

    const [hasNotes, setHasNotes] = useState(false)

    const { currentUser, userLoggedIn } = useAuth()
    
    const [input, setInput] = useState('');
    const [data, setData] = useState([]);

    const [error, setError] = useState(''); // State for error message

    const functions = getFunctions();
    const createFlashcards = httpsCallable(functions, 'createFlashcards');


    const checkNotes = async () => {
        const docRef = doc(db, `users/${currentUser.uid}/tags/uploadcap`)
        const docTotal = await getDoc(docRef)

        if (docTotal.exists && docTotal.data().totalSize > 0) {
            setHasNotes(true)
        } else {
            setHasNotes(false)
        }
        console.log(hasNotes)
    }

    useEffect(() => {
        checkNotes()
    }, [db])

    const formName = () => {
        if (input.trim() === "") { // Check if input is empty or just whitespace
            setError("Invalid name: name cannot be empty");
            return false;
        }
        if (input === "." || input === "..") {
            setError("Invalid name: cannot be '.' or '..'");
            return false;
        }
        if (input.includes("/")) {
            setError("Invalid name: cannot contain '/'");
            return false;
        }
        const forbiddenPattern = /^__.*__$/;
        if (forbiddenPattern.test(input)) {
            setError("Invalid name: cannot match pattern '__.*__'");
            return false;
        }
        const encoder = new TextEncoder();
        const encodedName = encoder.encode(input);
        if (encodedName.length > 150) {
            setError("Invalid name: must be no longer than 1,500 bytes");
            return false;
        }

        setError(''); // Clear error if all checks pass
        return true;
    };

    const genCards = async (e) => {
        e.preventDefault();

        setisLoading(true)

        if (!userLoggedIn) return;

        if (!formName()) {
            // Error message is already set in formName()
            return;
        }

        try {

            const response = await createFlashcards({ owner: currentUser.uid, coll: selectedCollection });
            setData(response.data);

            const flashcardData = {
                [input]: response.data.qs.map((question, index) => ({
                    [question]: response.data.as[index],
                }))
            };

            const docRef = doc(db, `users/${currentUser.uid}/items/flashcardSets`)
            await setDoc(docRef, flashcardData, { merge: true})
            console.log('Flashcards successfully added to Firestore');

            setisLoading(false)
            
            navigate(`/flashcards/${currentUser.uid}/${input}`)

        } catch (error) {
            console.log('Error Occured Calling createFlashcards function', error);
            setData({ qs: ['error'], as: ['error'] });
        }
    };

    const gotoManual = () => {

        if (!userLoggedIn) return;

        if (!formName()) {
            // Error message is already set in formName()
            return;
        }

        navigate(`/flashcards/${currentUser.uid}/${input}`)
    }

    
    return (
        <>  
        {isLoading ? (
            <div className="flex min-h-screen min-w-full justify-center items-center"><LoadAnim/></div>
        ) :(<div className="min-h-screen content-center">
                <div className="flex flex-col w-full min-h-full py-8 md:py-32 justify-center">
                    <div className="flex w-full justify-center">
                        <div className="flex flex-row w-1/2 justify-between border border-bgd rounded-lg bg-bgd ">
                                    <div className=""><CollectionSelection onCollectionChange={setSelectedCollection} /></div>
                                    <input className="bg-bgd p-2.5 w-64 md:w-128 text-white" value={input} onChange={(e) => setInput(e.target.value)} placeholder="flashcard set name here" />
                                    <div className="flex h-full p-1.5 items-center">{userLoggedIn && hasNotes ? (<button className="bg-bgl rounded-lg w-10 h-5/6 md:w-32 md:h-14 text-bgd text-lg md:text-lg pb-2 font-semibold" onClick={genCards}>Auto Generate</button>):(<></>)}</div>   
                                    <div className="flex h-full p-1.5 items-center">{userLoggedIn ? (<button className="bg-bgl rounded-lg w-10 h-5/6 md:w-32 md:h-14 text-bgd text-lg md:text-lg pb-2 font-semibold" onClick={gotoManual}>Manual Create</button>):(<></>)}</div> 
                        </div>
                    </div>
                    {userLoggedIn ? (<div className="flex w-full justify-center text-bgl text-2xl pt-6">Select a note collection and name your new set!</div>):(<div className="flex w-full justify-center text-bgl text-2xl pt-6">Please Login or Verify your Email!</div>)}
                    
                </div>
                {error && (
                    <div className="flex justify-center">
                        <span className="text-qr text-lg">{error}</span>
                    </div>
                )}
        </div>)
        }
        </>
    );
}

export default Study;
