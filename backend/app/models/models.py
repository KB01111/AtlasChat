from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Literal

class RequestContext(BaseModel):
    """Context for a request to the agent service"""
    thread_id: str
    user_id: str
    agent_definition: Dict[str, Any]

class AgentDefinition(BaseModel):
    """Model for agent definition"""
    agent_id: str
    name: str
    description: str
    agent_type: Literal["sdk", "langgraph"]
    uses_graphiti: bool
    sdk_config: Optional[Dict[str, Any]] = None
    langgraph_definition: Optional[Dict[str, Any]] = None
    allowed_tools: List[str]

class UserKnowledge(BaseModel):
    """Model for user knowledge"""
    knowledge_id: str
    user_id: str
    description: str
    value: str

class AuditLog(BaseModel):
    """Model for audit log"""
    log_id: str
    timestamp: str
    agent_id: str
    thread_id: str
    action_type: str
    details: Dict[str, Any]
