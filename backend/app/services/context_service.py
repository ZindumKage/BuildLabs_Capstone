class ContextService:

    @staticmethod
    def resolve(question: str, history: list):

        q = question.lower().strip()

        follow_ups = [
            "list them",
            "show them",
            "which ones",
            "display them",
            "show details",
            "tell me more",
            "what are they",
            "price of it",
            "how much is it",
            "what is its price",
            "stock of it",
            "how many left",
        ]

        if q not in follow_ups:
            return None

        for msg in reversed(history):

            content = (
                msg.get("content", "")
                if isinstance(msg, dict)
                else getattr(msg, "content", "")
            )

            content_lower = content.lower()

            if "best selling product" in content_lower:

                product_name = content.split(" is ")[0]

                if "price" in q:
                    return {
                        "intent": "product_price",
                        "product_name": product_name,
                    }

                if "stock" in q or "left" in q:
                    return {
                        "intent": "stock_remaining",
                        "product_name": product_name,
                    }

            if "items were sold today" in content_lower:
                return {"intent": "sales_today_details"}

            if "items have been sold this month" in content_lower:
                return {"intent": "sales_month_details"}
            
            if "items were sold yesterday" in content_lower:
                return {"intent": "sales_yesterday_details"}

        return None