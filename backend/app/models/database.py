from sqlalchemy import Column, String, Boolean, JSON, Integer, ForeignKey, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class AgentDefinition(Base):
    """SQLAlchemy model for agent definitions"""
    __tablename__ = "agent_definitions"
    
    agent_id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    agent_type = Column(String, nullable=False)  # 'sdk' or 'langgraph'
    uses_graphiti = Column(Boolean, default=False)
    sdk_config = Column(JSON, nullable=True)
    langgraph_definition = Column(JSON, nullable=True)
    allowed_tools = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class UserKnowledge(Base):
    """SQLAlchemy model for user knowledge"""
    __tablename__ = "user_knowledge"
    
    knowledge_id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False)
    description = Column(String, nullable=False)
    value = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class AuditLog(Base):
    """SQLAlchemy model for audit logs"""
    __tablename__ = "audit_logs"
    
    log_id = Column(String, primary_key=True, default=generate_uuid)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    agent_id = Column(String, nullable=False)
    thread_id = Column(String, nullable=False)
    action_type = Column(String, nullable=False)
    details = Column(JSON, nullable=False)
    
class ConversationHistory(Base):
    """SQLAlchemy model for conversation history"""
    __tablename__ = "conversation_history"
    
    message_id = Column(String, primary_key=True, default=generate_uuid)
    thread_id = Column(String, nullable=False)
    user_id = Column(String, nullable=False)
    agent_id = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
