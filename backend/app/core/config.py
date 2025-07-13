import os

class Settings:
    PROJECT_NAME: str = "TrackMy"
    API_V1_STR: str = "/api"
    
    MYSQL_USER: str = os.getenv("MYSQL_USER")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD")
    MYSQL_DB: str = os.getenv("MYSQL_DATABASE")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "db")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", 3306))

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    )

settings = Settings()
