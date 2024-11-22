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

function CollectionSelection({ onCollectionChange }){
    const { currentUser, userLoggedIn } = useAuth();

    const [collections, setCollections] = useState([]);
    
    // Auth observer for flashcard management
    useEffect(() => {
        const fetchCollections = async () => {
            if (currentUser && userLoggedIn) {
                const userDoc = doc(db, `users/${currentUser.uid}`);
                const docSnapshot = await getDoc(userDoc);
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    if (userData.collections && Array.isArray(userData.collections)) {
                        setCollections(userData.collections);
                    }
                }
            }
        };

        fetchCollections()
    }, [currentUser, userLoggedIn]);

    const handleChange = (e) => {
        onCollectionChange(e.target.value);
    };

    return (
    <>
    {userLoggedIn ? (
            <select name="collection" id="collection" className="bg-bgd h-full text-bgl text-sm  focus:ring-textcl focus:border-textcl block w-full p-2.5" onChange={handleChange}>
                    <option value={"default"} selected>default</option>
                    {collections.map((collection, index) => (
                        <option key={index} value={collection}>{collection}</option>
                    ))}
            </select>
        ):(
            <select name="collection" id="collection" className="bg-bgd h-full text-bgl text-sm  focus:ring-textcl focus:border-textcl block w-full p-2.5" onChange={handleChange}>
                    <option selected>Please Login</option>
            </select>)}
            
    </>    
    );

}

export default CollectionSelection;
