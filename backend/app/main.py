from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import settings
from app.core.database import Base
from app.core.database import engine
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.products import router as product_router
from app.api.routes.inventory import router as inventory_router
from app.api.routes.sales import router as sales_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.ai import router as ai_router
from app.seed import seed_admin
import app.models.user
import app.models.product
import app.models.stock_movement
import app.models.sale


Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):

    seed_admin()

    yield


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # "http://localhost:3000",
        "https://buildlabs-capstone-1.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(product_router, prefix="/api/v1")
app.include_router(inventory_router, prefix="/api/v1")
app.include_router(sales_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(ai_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "Smart Inventory Tracker API"}
