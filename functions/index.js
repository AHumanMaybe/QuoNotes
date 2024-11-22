const {onObjectFinalized, onObjectArchived} = require("firebase-functions/v2/storage");
const {initializeApp} = require("firebase-admin/app");
const {getStorage} = require("firebase-admin/storage");
const logger = require("firebase-functions/logger");
const path = require("path");

//pinecone and vector embeddings
const { Pinecone } = require("@pinecone-database/pinecone")
const { Document } = require("@langchain/core/documents")
const { OpenAIEmbeddings } = require("@langchain/openai")
const { ChatOpenAI } = require("@langchain/openai")
const { CharacterTextSplitter } = require("@langchain/textsplitters")
const { PineconeStore } = require("@langchain/pinecone")
const { defineString } = require("firebase-functions/params")

const { ChatPromptTemplate } = require("@langchain/core/prompts")
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents")
const { createRetrievalChain } = require("langchain/chains/retrieval")

const pinekey = defineString('PINECONE_API_KEY')
const pindex = defineString('PINECONE_INDEX')
const openapi = defineString('OPENAI_API_KEY')

//imports for query
const { onCall, HttpsError } = require("firebase-functions/v2/https")
const { getDatabase } = require("firebase-admin/database")

const functions = require('firebase-functions')
const admin = require('firebase-admin')

const vision = require("@google-cloud/vision");

const cors = require('cors')({
    origin: true
})

initializeApp();

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForFiles(bucket, prefix, maxAttempts = 10, delayMs = 5000) {
    let attempts = 0;
    let files = [];
    
    while (attempts < maxAttempts) {
        [files] = await bucket.getFiles({ prefix });
        
        if (files.length > 0) {
            return files; // Files found, return the array
        }

        attempts++;
        logger.log(`No files found. Waiting for ${delayMs}ms before retrying...`);
        await delay(delayMs); // Wait before the next attempt
    }

    throw new Error('Max attempts reached. Files not found.');
}

exports.textExtraction = onObjectFinalized({cpu: 2}, async (event) => {
    
    const pinecone = new Pinecone({
        apiKey: pinekey.value()
    })
    const pineconeIndex = pinecone.Index(pindex.value())
    
    
    const fileBucket = event.data.bucket; // Storage bucket containing the file.
    const filePath = event.data.name; // File path in the bucket.
    const contentType = event.data.contentType; // File content type.
    logger.log(contentType)
    
    //catch json writes and ignore them
    if (contentType.startsWith("application/octet-stream")){
        return
    }

    try { //TO PREVENT INFINITE LOOP
        logger.log('running try statement')

        const fileSize = event.data.size
        const fileSizeInMB = fileSize / (1024 * 1024)

        const owner = filePath.split('/')[1]
        const collection = filePath.split('/')[2]
        const filename = filePath.split('/')[4]

        const docID = `users/${owner}/tags/uploadcap`
        const docRef = admin.firestore().doc(docID)

        logger.log('found document ref')
        const totalSize = await docRef.get()
        let currentTotal = totalSize.exists ? totalSize.data().totalSize : 0
        let sizeThreshold = totalSize.exists ? totalSize.data().threshold : 1000 //TODO: change as necessary this will be the default value
        logger.log('ran if statement')

        //file upload limits
        if(sizeThreshold !== null && (currentTotal + fileSizeInMB) > sizeThreshold) {
            await fileBucket.file(filePath).delete()
            logger.log(`${owner} trying to exceed limit ${sizeThreshold} by ${sizeThreshold-currentTotal} so ${filename} has been deleted`)
            return
        }

        const newTotal = currentTotal + fileSizeInMB
        logger.log(`Current total ${newTotal}`)


        await docRef.set({ totalSize: newTotal, threshold: sizeThreshold }, { merge: true })

        logger.log('new size written')


        //collection management
        const writeDB = `users/${owner}/collections/${collection}`
        const writeref = admin.firestore().doc(writeDB)
        const docuid = filename.substring(0, 6)        
        //const docname = filename.substring(6) <- probably dont need this
        writeref.set({ [docuid]: `gs://${fileBucket}/user-notes/${owner}/${collection}/docs/${filename}`}, {merge: true})


        //text extraction and json writing
        const bucket = getStorage().bucket(fileBucket);
        const client = new vision.ImageAnnotatorClient();
        const newfilename = filename //to prevent 2nd run interference
        const gcsSourceUri = `gs://${fileBucket}/${filePath}`
        const gcsDestinationUri = `gs://${fileBucket}/user-notes/${owner}/${collection}/json/${newfilename.replace(/\.pdf$/i, "")}`
        
        if (contentType.startsWith("application/pdf")){

            logger.log('detected pdf filetype')

            const inputConfig = {
                mimeType: 'application/pdf',
                gcsSource: {
                    uri: gcsSourceUri,
                }
            }
            
            const outputConfig = {
                gcsDestination: {
                    uri: gcsDestinationUri,
                }
            }
            
            const features = [{type: "DOCUMENT_TEXT_DETECTION"}]
            const request = {
                requests: [
                    {
                        inputConfig: inputConfig,
                        features: features,
                        outputConfig: outputConfig,
                    }
                ]
            }
            
            const [operation] = await client.asyncBatchAnnotateFiles(request);
            const [filesResponse] = await operation.promise();
    
    
    
            logger.log('made operation and files response showing now:')
            logger.log(filesResponse.responses[0])
            const destinationUri = filesResponse.responses[0].outputConfig.gcsDestination.uri;
    
    
            const prefix = `user-notes/${owner}/collection/json/${newfilename.replace(/\.pdf$/i, "")}`;
            logger.log(`Looking for files with prefix: ${prefix}`);
            const jsonFiles = await waitForFiles(bucket, prefix);
            logger.log('Files found:', jsonFiles.map(file => file.name));
    
            let fullText = ""
            for (const file of jsonFiles) {
                const [fileContents] = await file.download();
                const jsonResponse = JSON.parse(fileContents.toString('utf8'));
                fullText += jsonResponse.responses[0].fullTextAnnotation.text;
            }
            //const data = await pdf(pdfBuffer);
            
            
            logger.log(`File Owned by ${owner}`)
            logger.log(fullText)
    
            //store and embed new documents
            
            const splitter = new CharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200, 
            })
    
            const docs = await splitter.splitText(fullText)
    
            const send = docs.map(text => new Document({
                metadata: { coll: collection, owner: owner, filename: newfilename },
                pageContent: text,
            }))
    
            logger.log('Sending OpenAI Embeddings to Pinecone...')
            await PineconeStore.fromDocuments(send, new OpenAIEmbeddings(), {
                pineconeIndex,
                maxConcurrency: 5,
            })
    
            logger.log('Inserted Succesfully!')
        } else if (contentType.startsWith("image/")) {
            logger.log("image type file detected")

            const [result] = await client.documentTextDetection(gcsSourceUri)
            const fullText = result.fullTextAnnotation
            logger.log(fullText.text)
    
            //store and embed new documents
            
            const splitter = new CharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200, 
            })
    
            const docs = await splitter.splitText(fullText.text)
    
            const send = docs.map(text => new Document({
                metadata: { coll: collection, owner: owner, filename: filename },
                pageContent: text,
            }))
    
            logger.log('Sending OpenAI Embeddings to Pinecone...')
            await PineconeStore.fromDocuments(send, new OpenAIEmbeddings(), {
                pineconeIndex,
                maxConcurrency: 5,
            })
    
            logger.log('Inserted Succesfully!')

        } else {
            logger.log('invalid file type :(')
            return
        }

    } catch(error){
        logger.log(error)
    }
    
})

exports.createFlashcards = onCall(async (request) => {
    logger.log('Successfully called function');
    
    const thisOwner = request.data.owner;
    const thisColl = request.data.coll;
    
    const setID = `users/${thisOwner}/tags/setCount`
    const setRef = admin.firestore().doc(setID)
    const setinfo = await setRef.get()
    let setLimit = setinfo.exists ? setinfo.data().setLimit : 10

    const curID = `users/${thisOwner}/items/flashcardSets`
    const curRef = admin.firestore().doc(curID)
    const curSnapshot = await curRef.get()
    const curCount = curSnapshot.size

    if(curCount !== null && (curCount + 1) > setLimit) {
        logger.log(`${thisOwner} trying to exceed flashcard limit`)
        return
    }

    const pinecone = new Pinecone({
        apiKey: pinekey.value()
    });
    const pineconeIndex = pinecone.Index(pindex.value());

    const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        { pineconeIndex }
    );

    const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
    const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            "You are a homework assistant designed to summarize answers based on the question and following context. \n\n{context}",
        ],
        ["human", "{input}"],
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
        llm: model,
        prompt: questionAnsweringPrompt,
    });

    

    // Log the inputs
    logger.log(`Owner: ${thisOwner}, Collection: ${thisColl}`);

    if (!thisOwner || !thisColl) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with the "owner" and "coll" arguments.');
    }

    logger.log(`Beginning Question Generation chain for user ${thisOwner} under ${thisColl} collection`);
    const chain = await createRetrievalChain({
        retriever: vectorStore.asRetriever({
            filter: { "owner": thisOwner, "coll": thisColl},
        }),
        combineDocsChain,
    });

    logger.log('chain const created successfully');

    // Perform a similarity search using the correct query format
    const questionsGenerate = await chain.invoke({
        input: "make a list of 5 questions separated by newline"
    });

    logger.log('questionsGenerate const made');

    const questions = questionsGenerate.answer.split('\n');

    logger.log(`${questions.length} questions generated successfully`);

    logger.log('seperating answers')
    let answers = [];
    for (let question of questions) {
        const answerResult = await chain.invoke({ input: question });
        answers.push(answerResult.answer);
    }

    logger.log(`${answers.length} answers generated successfully`);

    return { qs: questions, as: answers };

})

exports.addmessage = onCall(async (request) => {
    logger.log(pinekey.value())
    const pinecone = new Pinecone({
        apiKey: pinekey.value()
    })

    const filters = {
        "coll": request.data.collection, //THIS IS WHERE INSERT COLLECTION SPECIFICATION
        "owner": request.data.owner //THIS IS WHERE USER OWNER GOES
    }

    const pineconeIndex = pinecone.Index(pindex.value())
    const text = request.data.text

    logger.log(filters)
    logger.log('Queried text: ',text)
    
    const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        { pineconeIndex }
      );
    
    const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" })
    const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            "You are a homework assistant designed to summarize answers based on the question and following context. \n\n{context}",
        ],
        ["human", "{input}"],
    ])

    const combineDocsChain = await createStuffDocumentsChain({
        llm: model,
        prompt: questionAnsweringPrompt,
    })

    const chain = await createRetrievalChain({
        retriever: vectorStore.asRetriever({
            filter: filters,
        }),
        combineDocsChain,
    })

    const results = await chain.invoke({
        input: text,
    })

    /* Search the vector DB independently with metadata filters */
    // const results = await vectorStore.similaritySearch(text, 1, {
    // coll: "general",
    // });
    // results.forEach((result) => {
    //     logger.log("-".repeat(80))
    //     logger.log(result.pageContent)
    // })
    
    return { text: results }
})
