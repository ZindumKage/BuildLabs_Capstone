# import json
# from groq import Groq
# from app.core.config import settings
# from app.services.intent_service import IntentService
# from app.services.context_service import ContextService

# # Initialize the client globally
# client = Groq(api_key=settings.GROQ_API_KEY)


# class AIService:

#     @staticmethod
#     def detect_intent(question: str, history: list = None):
#         history = history or []
#         context_match = ContextService.resolve(question, history)
#         if context_match:
#             print("CONTEXT MATCH:", context_match)
#             return context_match

#         local_intent = IntentService.detect(question)
#         if local_intent:
#             print("LOCAL INTENT:", local_intent)
#             return local_intent

#         print("NO LOCAL MATCH -> GROQ")
#         return AIService.detect_with_groq(question)

#     @staticmethod
#     def detect_with_groq(question: str):
#         try:
#             response = client.chat.completions.create(
#                 model="llama-3.1-8b-instant",
#                 temperature=0,
#                 # Explicit JSON configuration requires max_tokens or max_completion_tokens
#                 max_tokens=100, 
#                 response_format={"type": "json_object"},
#                 messages=[
#                     {
#                         "role": "system",
#                         "content": """You are an intent classification engine. 
# Analyze the input and return a JSON object with the detected intent and entity arguments.

# Valid intents:
# best_selling_product, low_stock_products, sales_today, sales_this_month, 
# revenue_today, revenue_this_month, total_products, total_stock, recent_sales, 
# recent_products, out_of_stock_products, highest_stock_product, lowest_stock_product, 
# sales_today_details, sales_month_details, stock_remaining, stock_forecast, 
# product_sales, product_revenue, product_details, dashboard_summary.

# Rules:
# 1. Return ONLY a valid JSON object matching the examples.
# 2. Do not include markdown block ticks like ```json.
# 3. If no intent matches, return {"intent": "unknown"}.

# Examples:
# {"intent": "sales_today"}
# {"intent": "stock_remaining", "product_name": "Rice"}
# {"intent": "product_sales", "product_name": "Rice"}""",
#                     },
#                     {
#                         "role": "user",
#                         "content": question,
#                     },
#                 ],
#             )

#             content = response.choices[0].message.content.strip()
#             print("GROQ RESPONSE:", content)

#             parsed = json.loads(content)
#             if not isinstance(parsed, dict) or "intent" not in parsed:
#                 return {"intent": "unknown"}

#             return parsed

#         except Exception as e:
#             print("GROQ ERROR:", str(e))
#             return {"intent": "unknown"}


import json
import requests

from app.core.config import settings
from app.services.intent_service import IntentService
from app.services.context_service import ContextService


class AIService:

    @staticmethod
    def detect_intent(question: str, history: list = None):
        history = history or []

        context_match = ContextService.resolve(question, history)
        if context_match:
            print("CONTEXT MATCH:", context_match)
            return context_match

        local_intent = IntentService.detect(question)
        if local_intent:
            print("LOCAL INTENT:", local_intent)
            return local_intent

        print("NO LOCAL MATCH -> HYPERBOLIC")
        return AIService.detect_with_hyperbolic(question)

    @staticmethod
    def detect_with_hyperbolic(question: str):

        try:

            response = requests.post(
                "https://api.hyperbolic.xyz/v1/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {settings.HYPERBOLIC_API_KEY}",
                },
                json={
                    "model": "meta-llama/Llama-3.2-3B-Instruct",
                    "messages": [
                        {
                            "role": "system",
                            "content": """
You are an inventory intent classification engine.

Analyze the user's question and return ONLY valid JSON.

Valid intents:

best_selling_product
low_stock_products
sales_today
sales_yesterday
sales_this_month
sales_today_details
sales_yesterday_details
sales_month_details
revenue_today
revenue_this_month
total_products
total_stock
recent_sales
recent_products
out_of_stock_products
highest_stock_product
lowest_stock_product
stock_remaining
stock_forecast
product_sales
product_revenue
product_details
product_price
dashboard_summary

Rules:

1. Return ONLY JSON.
2. Never return markdown.
3. Never return explanations.
4. If a product is mentioned, include product_name.
5. If no intent matches, return:

{"intent":"unknown"}

Examples:

{"intent":"sales_today"}

{"intent":"sales_yesterday"}

{"intent":"low_stock_products"}

{"intent":"stock_remaining","product_name":"Rice"}

{"intent":"product_price","product_name":"Coca Cola"}

{"intent":"product_sales","product_name":"Rice"}
""",
                        },
                        {
                            "role": "user",
                            "content": question,
                        },
                    ],
                    "max_tokens": 100,
                    "temperature": 0,
                    "top_p": 1,
                },
                timeout=30,
            )

            response.raise_for_status()

            data = response.json()

            content = (
                data["choices"][0]["message"]["content"]
                .strip()
            )

            print("HYPERBOLIC RESPONSE:", content)

            parsed = json.loads(content)

            if (
                not isinstance(parsed, dict)
                or "intent" not in parsed
            ):
                return {"intent": "unknown"}

            return parsed

        except Exception as e:
            print("HYPERBOLIC ERROR:", str(e))
            return {"intent": "unknown"}