import { TextLoader } from "langchain/document_loaders/fs/text"
import { CharacterTextSplitter } from "langchain/text_splitter"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { PGVector, DistanceStrategy } from "langchain/vectorstores/pgvector" 

embeddings = OpenAIEmbeddings()

connection_string = PGVector.connection_string_from_db_params(
    
)