from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, String, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID as DB_UUID
from sqlalchemy.orm import relationship, declarative_base
from pydantic import BaseModel
from typing import List, Optional
import uuid
from uuid import UUID
import os

Base = declarative_base()
DATABASE_URL = "sqlite:///./test.db"  # Example database URL
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Session(Base):
    __tablename__ = "sessions"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    hubs = relationship("Hub", back_populates="session")
    model_config = {
        "from_attributes": True,
        "arbitrary_types_allowed": True  # Allow UUID and other arbitrary types
    }

class Hub(Base):
    __tablename__ = "hubs"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    file_name = Column(String, index=True)
    assistant_id = Column(String, index=True)
    session_id = Column(String, ForeignKey('sessions.id'))
    session = relationship("Session", back_populates="hubs")
    nodes = relationship("Node", back_populates="hub")
    model_config = {
        "from_attributes": True,
        "arbitrary_types_allowed": True  # Allow UUID and other arbitrary types
    }
class Node(Base):
    __tablename__ = "nodes"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    prompt = Column(Text)
    text = Column(Text)
    title = Column(String)
    thread_id = Column(String, index=True)
    parent_node_id = Column(String, ForeignKey('nodes.id'), nullable=True)
    hub_id = Column(String, ForeignKey('hubs.id'))

    # Relationships
    parent_node = relationship("Node", remote_side=[id], backref="children")
    hub = relationship("Hub", back_populates="nodes")
    images = relationship("Image", back_populates="node")

    questions = relationship("Question", back_populates="node", cascade="all, delete-orphan")
    model_config = {
        "from_attributes": True,
        "arbitrary_types_allowed": True  # Allow UUID and other arbitrary types
    }

class Question(Base):
    __tablename__ = "questions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    content = Column(Text, nullable=False)
    node_id = Column(String, ForeignKey('nodes.id'))

    # Relationship back to the node
    node = relationship("Node", back_populates="questions")
    model_config = {
        "from_attributes": True,
        "arbitrary_types_allowed": True  # Allow UUID and other arbitrary types
    }
class Image(Base):
    __tablename__ = "images"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    data = Column(Text)
    url = Column(Text)
    node_id = Column(String, ForeignKey('nodes.id'))

    node = relationship("Node", back_populates="images")
    model_config = {
        "from_attributes": True,
        "arbitrary_types_allowed": True  # Allow UUID and other arbitrary types
    }

    def generate_url(self):
        """Generate the URL based on the id."""
        self.url = f"http://localhost:8001/images/{self.id}"

# Image Models
class ImageCreate(BaseModel):
    data: str

    model_config = {
        "from_attributes": True,
        "arbitrary_types_allowed": True  # Allow UUID and other arbitrary types
    }
class ImageResponse(BaseModel):
    id: str
    url: str



# Question Models
class QuestionCreate(BaseModel):
    content: str

class QuestionResponse(BaseModel):
    id: str
    content: str


# Node Models
class NodeCreate(BaseModel):
    prompt: str
    text: str
    title: str
    thread_id: str
    parent_node_id: Optional[str]  # Use UUID instead of str
    images: Optional[List[ImageCreate]] = []  # Now includes images for Node creation
    questions: Optional[List[QuestionCreate]] = []  # Now includes questions for Node creation


class NodeResponse(BaseModel):
    id: str
    prompt: str
    text: str
    title: str
    thread_id: str
    parent_node_id: Optional[str]  # Self-referential, use UUID
    images: List[ImageResponse]  # Now includes image responses
    questions: List[QuestionResponse]  # Now includes question responses

    class Config:
        orm_mode = True  # Enables Pydantic to use SQLAlchemy models
        from_attributes = True  # This is required to use from_orm with SQLAlchemy models



# Hub Models
class HubCreate(BaseModel):
    file_name: str
    assistant_id: str
    nodes: Optional[List[NodeCreate]] = []  # Now includes node creation

class HubResponse(BaseModel):
    id: str  # Use UUID instead of str
    file_name: str
    assistant_id: str
    nodes: List[NodeResponse]  # Now includes node responses



# Session Models
class SessionCreate(BaseModel):
    hubs: Optional[List[HubCreate]] = []  # Now includes hub creation

class SessionResponse(BaseModel):
    id: str  # Use UUID instead of str
    hubs: List[HubResponse]  # Now includes hub responses

def create_db_and_tables():
    # Check if the database file exists (optional, but helpful)
    db_file = DATABASE_URL.replace('sqlite:///', '')
    if not os.path.exists(db_file):
        print(f"Database file does not exist. Creating database: {db_file}")

    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)