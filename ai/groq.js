import dotenv from "dotenv";
dotenv.config();
import {ChatGroq} from '@langchain/groq'

const llm= new ChatGroq({
    apiKey:process.env.GROQ_API_KEY,
    model:"llama-3.3-70b-versatile",
    temperature: 0.2
})

export const askGroq=async(prompt)=>{
    const response= await llm.invoke(prompt)
    return response.content;
}