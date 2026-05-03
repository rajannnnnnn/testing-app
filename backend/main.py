from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
claude_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class ChatRequest(BaseModel):
    message: str
    provider: str

@app.post("/chat")
async def chat(req: ChatRequest):

    if req.provider == "openai":
        res = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": req.message}]
        )
        return {"reply": res.choices[0].message.content}

    if req.provider == "claude":
        res = claude_client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=500,
            messages=[{"role": "user", "content": req.message}]
        )
        return {"reply": res.content[0].text}

    return {"error": "invalid provider"}
