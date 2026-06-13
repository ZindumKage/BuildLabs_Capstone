from pydantic import BaseModel




class AIQueryResponse(BaseModel):
    answer: str
    
class ChatMessage(BaseModel):

    role: str

    content: str

class AIQueryRequest(BaseModel):

    question: str

    history: list[ChatMessage] = []