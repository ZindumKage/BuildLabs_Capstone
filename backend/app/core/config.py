from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str

    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    SECRET_KEY: str
    HYPERBOLIC_API_KEY: str

    OPENAI_API_KEY: str 
    GROQ_API_KEY: str
    HYPERBOLIC_API_KEY: str 
    
    
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

 
settings = Settings()