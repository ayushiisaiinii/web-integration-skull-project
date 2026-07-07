from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

Base = declarative_base()

class Job(Base):
    __tablename__ = "jobs"

    job_id = Column(String, primary_key=True)
    status = Column(String)
    model = Column(String, nullable=True)
    volume_path = Column(String, nullable=True)
    mask_path = Column(String, nullable=True)

    # NEW
    stl_path = Column(String, nullable=True)
    obj_path = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

engine = create_engine("sqlite:///jobs.db")
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)