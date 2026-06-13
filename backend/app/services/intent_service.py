import re


class IntentService:
    PHRASES = {
        "best_selling_product": [
            "best selling product",
            "top selling product",
            "most sold product",
            "highest selling product",
            "best seller",
        ],
        "low_stock_products": [
            "low stock",
            "low inventory",
            "running low",
            "almost out of stock",
            "reorder products",
            "products low in stock",
        ],
        "sales_today": [
            "sales today",
            "sold today",
            "items sold today",
            "today sales",
            "how many products were sold today",
        ],
        "sales_this_month": [
            "sales this month",
            "monthly sales",
            "sold this month",
        ],
        "revenue_today": [
            "revenue today",
            "income today",
            "earnings today",
            "money made today",
        ],
        "revenue_this_month": [
            "revenue this month",
            "monthly revenue",
            "earnings this month",
        ],
        "total_products": [
            "total products",
            "number of products",
            "count products",
            "product count",
        ],
        "total_stock": [
            "total stock",
            "inventory count",
            "stock available",
        ],
        "recent_sales": [
            "recent sales",
            "latest sales",
            "last sales",
        ],
        "recent_products": [
            "recent products",
            "latest products",
            "new products",
        ],
        "out_of_stock_products": [
            "out of stock",
            "products out of stock",
            "items unavailable",
        ],
        "highest_stock_product": [
            "highest stock",
            "most stock",
            "largest inventory",
        ],
        "lowest_stock_product": [
            "lowest stock",
            "least stock",
            "smallest inventory",
        ],
        "sales_today_details": [
            "show sales today",
            "list sales today",
            "products sold today",
            "what was sold today",
        ],
        "sales_yesterday": [
            "sales yesterday",
            "sold yesterday",
            "items sold yesterday",
            "how many products were sold yesterday",
        ],
        "sales_yesterday_details": [
            "show sales yesterday",
            "list sales yesterday",
            "products sold yesterday",
            "what was sold yesterday",
        ],
        "sales_month_details": [
            "show sales this month",
            "list sales this month",
            "products sold this month",
        ],
        "dashboard_summary": [
            "dashboard summary",
            "business summary",
            "inventory summary",
            "summary",
        ],
        "product_price": [
            "price of",
            "how much is",
            "product price",
            "cost of",
        ],
    }

    @staticmethod
    def detect(question: str):

        q = question.lower().strip()

        # PRODUCT / SALES REGEX FIRST

        patterns = [
            (
                "sales_yesterday",
                [
                    r"how many .* sold yesterday",
                    r"sales yesterday",
                    r"sold yesterday",
                    r"items sold yesterday",
                    r"how many products were sold yesterday",
                ],
            ),
            (
                "sales_today",
                [
                    r"how many .* sold today",
                    r"sales today",
                    r"sold today",
                    r"items sold today",
                    r"how many products were sold today",
                ],
            ),
            (
                "stock_remaining",
                [
                    r"how many (.+) are left",
                    r"how much (.+) is left",
                    r"current stock of (.+)",
                    r"stock remaining for (.+)",
                ],
            ),
            (
                "stock_forecast",
                [
                    r"when will (.+) run out",
                    r"forecast for (.+)",
                    r"how long will (.+) last",
                    r"predict stock for (.+)",
                ],
            ),
            (
                "product_sales",
                [
                    r"sales for (.+)",
                    r"units sold for (.+)",
                    r"how many (.+) sold",
                ],
            ),
            (
                "product_revenue",
                [
                    r"revenue from (.+)",
                    r"earnings from (.+)",
                ],
            ),
            (
                "product_price",
                [
                    r"price of (.+)",
                    r"cost of (.+)",
                    r"how much is (.+)",
                ],
            ),
        ]

        for intent, regexes in patterns:
            for pattern in regexes:
                match = re.search(pattern, q)

                if match:
                    result = {"intent": intent}

                    if match.groups():
                        result["product_name"] = match.group(1).strip()

                    return result

        # SIMPLE PHRASE MATCHING AFTER REGEX

        for intent, phrases in IntentService.PHRASES.items():
            for phrase in phrases:
                if phrase in q:
                    return {"intent": intent}

        return None
