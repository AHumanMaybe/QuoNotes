import ManualCards from "../components/ManualCards";
import React, { useState } from "react";
import { initializeApp } from "firebase/app"
import { useEffect } from "react";
import { getFirestore, collection, addDoc, writeBatch, doc, setDoc, getDoc } from "firebase/firestore"
import { useAuth } from "../contexts/authContext";
import LoadAnim from "../components/LoadAnim";
import FlashSelectCard from "../components/FlashSelectCard";

const firebaseConfig = {
removed
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


function Manual() {
    const [flashsets, setFlashsets] = useState([]);
    const { currentUser, userLoggedIn } = useAuth();
     
    const [isLoading, setisLoading] = useState(false)

    useEffect(() => {
        const fetchCollections = async () => {
            if (currentUser && userLoggedIn) {
                const flashcardSetsRef = doc(db, `users/${currentUser.uid}/items/flashcardSets`);
                const docSnapshot = await getDoc(flashcardSetsRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const flashsetNames = Object.keys(data);
                    setFlashsets(flashsetNames);
                }
            }
        };

        fetchCollections();
    }, [currentUser, userLoggedIn]);

    const renderFlashSelectCards = () => {
      
      const rows = [];

      // Add the "+" card first
      const allCards = ['+'].concat(flashsets);

      for (let i = 0; i < allCards.length; i += 3) {
          rows.push(
              <div key={i} className="flex w-full justify-between p-6">
                  {allCards.slice(i, i + 3).map((flashset, index) => (
                      <FlashSelectCard key={index} index={index} input={flashset} />
                  ))}
              </div>
          );
      }
        return rows;
         
    };

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col h-2/3 overflow-y-scroll justify-around border-y-8 border-bgd w-5/6 h-5/6 p-8">
                {renderFlashSelectCards()}
            </div>
        </div>
    );
  }
  
  export default Manual;
