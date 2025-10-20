import os

class Settings:
    PROJECT_NAME: str = "TrackMy"
    API_V1_STR: str = "/api"
    
    POSTGRES_USER: str = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "db")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", 5432))

    SECRET_KEY = "your-secret-key"  # This should be random and secure in real apps
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30


    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        # Use environment variables if available, otherwise use Supabase defaults
        user = os.getenv("POSTGRES_USER") or "postgres.zfrqgpyspgmuzpxijmhh"
        password = os.getenv("POSTGRES_PASSWORD") or "rainbowpizzacat"
        host = os.getenv("POSTGRES_HOST") or "aws-1-us-east-2.pooler.supabase.com"
        port = os.getenv("POSTGRES_PORT") or "6543"
        db = os.getenv("POSTGRES_DB") or "postgres"

        return f"postgresql://{user}:{password}@{host}:{port}/{db}"

settings = Settings()
