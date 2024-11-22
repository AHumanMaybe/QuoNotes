import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/authContext";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
   removed
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


function FlashSetSelection({ onFlashChange }){
    const { currentUser, userLoggedIn } = useAuth();

    const [flashsets, setFlashsets] = useState([]);

        useEffect(() => {
        const fetchCollections = async () => {
            if (currentUser && userLoggedIn) {
                const flashcardSetsRef = doc(db, `users/${currentUser.uid}/items/flashcardSets`);
                const docSnapshot = await getDoc(flashcardSetsRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const flashsetNames = Object.keys(data); // Get the names of the flashcard sets
                    setFlashsets(flashsetNames);
                }
            }
        };

        fetchCollections()
    }, [currentUser, userLoggedIn]);

    const handleChange = (e) => {
        onFlashChange(e.target.value);
    };

    return (
    <>
    {userLoggedIn && currentUser.emailVerified ? (
        <select name="flashset" id="flashset" className="bg-gray-50 h-full text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-bgd dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange}>
            <option selected>Select a Flashcard Set</option>
            {flashsets.map((flashset, index) => (
                <option key={index} value={flashset}>{flashset}</option>
            ))}
        </select>
    ):(
        <select name="flashset" id="flashset" className="bg-gray-50 h-full text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-bgd dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 opacity-20" onChange={handleChange}>
                <option selected>Please Login or Verify your Email</option>
        </select>
    )}
            
    </>    
    );

}

export default FlashSetSelection;
