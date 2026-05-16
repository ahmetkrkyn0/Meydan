import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"), override=True)
import google.generativeai as genai
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

for model_name in ["models/text-embedding-004", "models/gemini-embedding-001"]:
    try:
        result = genai.embed_content(model=model_name, content="test", task_type="retrieval_document")
        print(model_name + ": " + str(len(result["embedding"])) + " boyut - OK")
    except Exception as e:
        print(model_name + ": HATA - " + str(e))
