# Last Updated Production Code of QuoNotes

QuoNotes is now defunct and this repo contains an api-clean version of the most recent production code


## What is QuoNotes
  QuoNotes was a summer-long project from March through August of 2024 to create a web app to help students with studying


### QuoNotes Features
  - Auto creation of flashcard study sets from uploaded user notes
      - using Google Vision to read uploaded pdfs and images of handwritten notes
      - LangChain with Pinecone Database for similarity searches and provide contexts to ChatGPT taken from the uploaded notes
      - ChatGPT creates questions based on given note contexts and flashcard sets are saved in a Firestore Database while the uploaded notes are saved in Firebase Storage
   
  - Customized Tutoring Assistant
      - chat box where users can ask questions sent to ChatGPT and saved to Firestore Database for reload on session end
      - ChatGPT uses context of uploaded notes to answer questions users ask

  - Custom Notes Playlists
    - Users create "collections" which are essentially collections or playlists of uploaded notes allowing them to specify what topic a conversation is on or what to make flashcards on
    - Collections saved in Firestore Database
   
  - In-House Notetaking
      - Users can create notes, similar to google docs in function, however based in markdown instead of basic text editing
      - Notes are saved automatically using Firebase Realtime Database

  - Manual Flashcard creation
    - Users can create their own flashcard sets through an edit menu
    - Users can edit created flashcards (either ones they have made or that were automatically made)

  - Flashcard Visibility
    - using a system of flashcard set keys saved to Firestore Databse, users can choose to make their flashcard set visible publicly or private (only they can view it)
    - Public flashcard sets can be saved and edited privately by other users

  - Flashcard Searches
    - public flashcards can be searched using a normal search bar
    - search results matched by similarity to entered search string

  - User Accounts
    - user account customization
    - display name handling
    - account signout/signon
    - handle sessions throughout pages

  - Web App
    - QuoNotes uses ReactJS for the front end and used Firebase for various backend features as well as for live web hosting
   
### Notes
  - This repo is a duplicate of the private version with all sensitive information removed
