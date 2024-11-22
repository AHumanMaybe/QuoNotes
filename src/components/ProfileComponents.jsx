import { useAuth } from "../contexts/authContext";
import {initializeApp} from "firebase/app";
import {collection, getDocs, getDoc, doc, getFirestore, updateDoc, setDoc, deleteField} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import CollectionSelection from "./CollectionSelection.jsx";
import { getStorage, ref, deleteObject, getDownloadURL} from "firebase/storage";


const firebaseConfig = {
removed
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function ProfileCard() {

    const { currentUser,  userLoggedIn } = useAuth();
    if(!userLoggedIn)
    {
        return;
    }

    const email = currentUser.email;
    const creationTime = Math.floor(currentUser.metadata.createdAt);
    const time = new Date(creationTime);

    //console.log(currentUser);

    //console.log(time);

    return (
        <>
        <div className="border-4 border-bgd w-5/6 justify-center rounded rounded-lg items-center grid grid-rows-4">
            <h2 className="text-8xl text-bgl" >Welcome!</h2>
            <div className="flex justify-center">
                <img className="w-64 h-64 rounded rounded-full bg-bgl"></img>
            </div>
            <div>
                <p className="text-xl text-bgl">
                    {email}
                </p>
                <p className="text-xl text-bgl">
                    Studying Since {time.getFullYear().toString()}
                </p>
            </div>      
        </div>
            
        </>
    )
}

export function CollectionsCard() {

    const { currentUser,  userLoggedIn } = useAuth();
    if(!userLoggedIn)
    {
        return;
    }

    const [collection, setCollection] = useState('');
    const [collectionList, setCollectionList] = useState([]);
    const uid = currentUser.uid;

    useEffect(() =>
    {
        async function getCollections() {

            //handle the initial load
            if(collectionList.length === 0)
            {
                //TODO: Check this for database call efficiency
                console.log("ProfileComponents | Database Call");
                const docRef = doc(db, `users/${uid}`);
                const docSnap = await getDoc(docRef);
                const colArr = docSnap.data().collections;
                if(docSnap.exists() && JSON.stringify(colArr) !== JSON.stringify(collectionList))
                {
                    console.log("Items from database: " + colArr);
                    console.log("Local items array: " + collectionList);
                    setCollectionList(colArr);
                }
                return;
            }
            else
            {

            }
        }
        getCollections();
        },
        [collectionList]);

    const onSubmit = async (e) => {
        console.log("Adding Collection...");
        e.preventDefault();
        const docRef = doc(db, `users/${uid}`);
        const docSnap = await getDoc(docRef);
        console.log(docRef);

        if(docSnap.exists() && collection !== "") {
            try {
                const collectionsArr = docSnap.data().collections;
                if(!collectionsArr.includes(collection)) //only add a collection if it does not already exist
                {
                    collectionsArr.push(collection);
                    setCollectionList(collectionsArr);
                    await setDoc(docRef,{collections: collectionsArr}, {merge: true});
                }

            } catch (error) {
                console.log('Push to collection FAILED :(', error);
            }
        }
        else
        {
            try {
                const collectionsArr = [];
                collectionsArr.push(collection);
                await setDoc(docRef,{collections: collectionsArr}, {merge: true});

                console.log('New collection set created :)');
            } catch (error) {
                console.log('Failed creating collection set :(', error);
            }
        }

    }

    //TODO: when components exist for collections in the list, dont check by using the 'e' event, just pass the collection name back
    const deleteItem = async (e) => {
        console.log("Deleting collection: " + e.target.textContent);
        console.log("Index of item: " + e.target.getAttribute("data-index"));
        const toDeleteText = e.target.textContent.trim();
        const toDeleteIndex = e.target.getAttribute("data-index");

        if(toDeleteText !== collectionList[toDeleteIndex].trim())
        {
            console.log(toDeleteText)
            console.log(collectionList[toDeleteIndex].trim())
            return;
        }
        else
        {
            console.log("Match!")
        }

        if(collectionList.includes(toDeleteText))
        {

            const docRef = doc(db, `users/${uid}`);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists())
            {
                const collectionsArr = docSnap.data().collections.filter(function(e) {return e !== toDeleteText});
                await setDoc(docRef, {collections: collectionsArr}, {merge: true});
                setCollectionList(collectionsArr);
            }

            console.log("Collection " + toDeleteText + " is deleted.");
        }
        else
        {
            console.log("Collection " + toDeleteText + " does not exist.");
        }
    }

    return (
        <>
        <div className="flex w-5/6 items-center text-bgl rounded rounded-lg border-4 border-bgd p-8">
                <div className="flex justify-start w-1/2 grid grid-rows-">
                    <span className="text-4xl">Create New Collections Here</span>
                    <form className="" onSubmit={onSubmit}>
                        <input type="text" className="bg-bgd p-2.5 full text-white" placeholder="Enter New Collection Name" value={collection} onChange={(e) => setCollection(e.target.value.trim())}/>
                        <button className="flex items-center justify-center text-white text-xl bg-textcl w-24 h-12 rounded hover:bg-textclh">
                            Create
                        </button>
                    </form>
                </div>
                <div className="rounded rounded-lg w-1 h-full bg-bgd"/>
                <div className="flex justify-start w-1/2 text-xl pl-8">
                    <div className="pr-4">
                        <p className="text-3xl">
                            Your Collections:
                        </p>
                        <p className="text-lg">
                            Click on a Collection Name to <span className="text-qr">Delete</span> it
                        </p>
                    </div>
                    <ul className="w-1/2 max-h-32 justify-center content-center rounded text-lg pb-4 border-2 border-bgd overflow-y-auto">
                        {collectionList.map((item, index) => (
                        <li className="hover:text-2xl hover:text-qr pl-2 pt-2" key={index} data-index={index} onClick = {deleteItem}> 
                            {item} 
                            <div className="rounded rounded-lg w-5/6 h-0.5 bg-bgd"/>
                        </li>) )}
                    </ul>
                </div>
                
        </div>

        </>
    )
}

export function FilesCard() {

    const { currentUser,  userLoggedIn } = useAuth();
    if(!userLoggedIn)
    {
        return;
    }

    const uid = currentUser.uid;

    const [selectedCollection, setSelectedCollection] = useState('default');
    const [fileList, setFileList] = useState([]); //store the list of files in the collection
    const [collectionList, setCollectionList] = useState([]);

    const storage = getStorage();


    //this is copied from above section...
    useEffect(() => {
        async function getCollections() {
            //handle the initial load
            if(collectionList.length === 0)
            {
                //TODO: Check this for database call efficiency
                console.log("ProfileComponents | Database Call");
                const docRef = doc(db, `users/${uid}`);
                const docSnap = await getDoc(docRef);
                const colArr = docSnap.data().collections;
                if(docSnap.exists() && JSON.stringify(colArr) !== JSON.stringify(collectionList))
                {
                    console.log("Items from database: " + colArr);
                    console.log("Local items array: " + collectionList);
                    setCollectionList(colArr);
                }
                return;
            }
            else
            {
            }
        }
        getCollections();
        },
   [collectionList]);


    const onSubmit = async (e) => {}

    //TODO: when components exist for individual files in the list, pass values of the 'uid' instead of detecting by name
    const deleteFile = async (e) =>
    {
        const dataIndex = e.target.getAttribute("data-index");
        const filePath = e.target.textContent.trim(); //TODO: Do a lot of validation on this.
        const fileName = filePath.split('/').pop();
        const fileUID = e.target.getAttribute("file-uid");

        console.log("Deleting file: " + e.target.textContent  + "(" + fileName + ")");
        console.log("Index of item: " + dataIndex);
        console.log("UID of file: " + fileUID); //this uses a custom HTML tag to store the property

        if(!fileList[dataIndex].includes(fileUID))
        {
            console.log("No match found for " + e.target.getAttribute("file-uid"));
            return;
        }
        else
        {
            console.log("Match!")
        }

        const docRef = doc(db, `users/${uid}/collections/${selectedCollection}`);
        console.log("ProfileComponents | Database Call");

        await updateDoc(docRef, {[fileUID]: deleteField()});
        console.log("ProfileComponents | Database call!");

        const docSnap = await getDoc(docRef);
        setFileList(Object.entries(docSnap.data()));
        console.log("ProfileComponents | Database call!");

        const storage = getStorage();

        // Create a reference to the file to delete
        const fileRef = ref(storage, `user-notes/${currentUser.uid}/${selectedCollection}/docs/${fileName}`);

        console.log(fileRef);

        console.log("ProfileComponents | Storage call!");
        // Delete the file
        deleteObject(fileRef).then((url) => {
            console.log("Deletion successful");
        }).catch((error) => {
            console.log("Deletion FAILED");
        });

    }

    const handleCollectionSelection = async (collection) => {

        if(collection === "Select a Collection" || !collectionList.includes(collection))
        {
            return;
        }

        console.log("Loading file list from collection " + collection);
        const docRef = doc(db, `users/${uid}/collections/${collection}`);
        const docSnap = await getDoc(docRef);
        console.log("ProfileComponents | Database call!");

        setSelectedCollection(collection);
        setFileList(Object.entries(docSnap.data()));



        console.log(fileList);
    }
    console.log(fileList);

    return (
        <>
            <div className="flex w-5/6 items-center text-bgl rounded rounded-lg border-4 border-bgd p-8">
                <h2 className="text-4xl">
                    Manage Files
                </h2>
                <div className="w-1/2">
                    <form className="flex pl-4" onSubmit={onSubmit}>
                        <div className="w-1/2"><CollectionSelection onCollectionChange={handleCollectionSelection}/></div>
                    </form>
                </div>
                
                <div className="rounded rounded-lg w-1 h-full bg-bgd"/>
                <div className="flex pl-8">
                    <div className="w-full pr-4">
                        <p className="text-3xl">
                            Your Files:
                        </p>
                        <p className="text-lg">
                            Click on a File Name to <span className="text-qr">Delete</span> it
                        </p>
                    </div>
                    <ul className="p-4 text-lg max-h-32 justify-center content-center rounded text-lg pb-4 border-2 border-bgd overflow-y-auto">
                        {fileList.map((item, index) => ( <li className="hover:text-xl hover:text-qr pl-2 pt-2" key={index} data-index={index} file-uid={item[0]} onClick={deleteFile} > {item[1].slice(item[1].lastIndexOf('/') + 1)} <div className="rounded rounded-lg w-5/6 h-0.5 bg-bgd"/> </li>))}
                    </ul>
                </div>
                
            </div>

        </>
    )
}
