import { motion } from "framer-motion"
import React, { useState } from "react"
import { getStorage, ref, uploadBytes, getMetadata } from "firebase/storage";
import { useAuth } from "../contexts/authContext";
import CollectionSelection from "./CollectionSelection";

function Upload(){

    const storage = getStorage()

    const { currentUser, userLoggedIn } = useAuth()

    const [file, setFile] = useState(null)    

    const [scaled, setscale] = useState(false);
    const [colored, setcolor] = useState(false);

    const [selectedCollection, setSelectedCollection] = useState('default')
    
    const handleFileChange = async (event)=>{
        if (!userLoggedIn) return

        const selectedFile = event.target.files[0]
        const storageRef = ref(storage, `user-notes/${currentUser.uid}/${selectedCollection}/docs/${selectedFile.name}`)
        setFile(selectedFile)

        if (selectedFile) {
            try {
                
                uploadBytes(storageRef, selectedFile).then((snapshot) => {
                    console.log('File Uploaded Successfully')
                    console.log(`${selectedCollection}`)
                })
            }catch (err) {
                console.log('Error : ', err)
            }
            
        }
        
    };

    //once called, handles animation and color change of upload border
    const handleDragOver = (event) => {
        event.preventDefault();
        setscale(!scaled);
        setcolor(!colored);
    };

    //once called, handles animation and color change of upload border and does basic file transfer
    const handleDrop = async (event) => {
        event.preventDefault();
        setscale(false);
        setcolor(colored);

        const selectedFile = event.target.files[0]
        const storageRef = ref(storage, `user-notes/${currentUser.uid}/${selectedCollection}/docs/${selectedFile.name}`)
        setFile(selectedFile)

        if (selectedFile) {
            try {
                uploadBytes(storageRef, selectedFile).then((snapshot) => {
                    console.log('File Uploaded Successfully')
                    console.log(`${selectedCollection}`)
                })
            }catch (err) {
                console.log('Error : ', err)
            }
        }
    }
    return (<>
    {userLoggedIn ? (<>
    <div className="flex w-full pt-32 justify-center text-bgl text-5xl">Upload&nbsp;<span>Your&nbsp;</span> Notes Below</div>
    <div className="flex justify-center items-center h-full w-full pt-8 text-bgl text-xl">
            <motion.label whileHover={{ scale: scaled ? 1.1 : 1}} 
                    onMouseEnter={() => setscale(!scaled)} 
                    onMouseLeave={() => setscale(!scaled)} className="flex justify-center border-dashed border-4 border-bgd rounded-lg p-32 h-5/6 w-2/3"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}>
                <input 
                    type="file"  
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} // Hide the input visually
                />
                {userLoggedIn ? (<span className="justify-center">drag and drop or click to upload</span>) : (<span>please login or register an account :)</span>)}
                
            </motion.label>
        </div>
        <div className="flex justify-center p-8">
            <div className="w-64 border border-bgd rounded-lg bg-bgd"><CollectionSelection onCollectionChange={setSelectedCollection}/></div>
        </div>
        </>):(<>    
        <div className="flex w-full pt-32 justify-center text-bgl text-5xl">Please &nbsp;<span>Login</span></div>
        <div className="flex justify-center items-center h-full w-full pt-8 text-bgl text-xl">
                <motion.label whileHover={{ scale: scaled ? 1.1 : 1}} 
                        onMouseEnter={() => setscale(!scaled)} 
                        onMouseLeave={() => setscale(!scaled)} className="flex justify-center border-dashed border-4 border-bgd rounded-lg p-32 h-5/6 w-2/3"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}>
                    <span>Please Login!</span>   
                </motion.label>
        </div>
        <div className="flex justify-center p-8">
            <div className="w-64 border border-bgd rounded-lg bg-bgd"><CollectionSelection onCollectionChange={setSelectedCollection}/></div>
        </div></>)}

        </>
    );
}

export default Upload