import React, { useEffect, useState, useCallback } from 'react';
import { useApi } from '../api-context';
import CodeExecutionComponent from './CodeExecution/CodeExecutionComponent';
import { debounce } from 'lodash';

const AgentSelector = () => {
  const { 
    agents, 
    selectedAgent, 
    selectAgent, 
    refreshAgents,
    loading
  } = useApi();
  
  const [showCodeExecution, setShowCodeExecution] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState(`thread_${Date.now()}`);
  const [localSelectedAgent, setLocalSelectedAgent] = useState(selectedAgent);
  
  // Initialize local state when selectedAgent changes from context
  useEffect(() => {
    setLocalSelectedAgent(selectedAgent);
  }, [selectedAgent]);
  
  useEffect(() => {
    // Refresh agents list when component mounts
    if (!loading) {
      refreshAgents();
    }
  }, [loading]);

  // Create debounced version of selectAgent
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSelectAgent = useCallback(
    debounce((agentId) => {
      selectAgent(agentId);
    }, 500),
    [selectAgent]
  );

  const handleAgentChange = (e) => {
    const newAgentId = e.target.value;
    
    // Update local state immediately for responsive UI
    setLocalSelectedAgent(newAgentId);
    
    // Debounce the actual agent selection to prevent rapid switching issues
    debouncedSelectAgent(newAgentId);
  };

  const toggleCodeExecution = () => {
    setShowCodeExecution(!showCodeExecution);
  };

  return (
    <div className="agent-selector-container">
      <div className="agent-selector-header">
        <div className="agent-dropdown-container">
          <label htmlFor="agent-select">Agent:</label>
          <select
            id="agent-select"
            value={localSelectedAgent || ''}
            onChange={handleAgentChange}
            disabled={loading || agents.length === 0}
          >
            {agents.length === 0 ? (
              <option value="">No agents available</option>
            ) : (
              agents.map((agent) => (
                <option key={agent.agent_id} value={agent.agent_id}>
                  {agent.name}
                </option>
              ))
            )}
          </select>
        </div>
        
        <div className="agent-actions">
          <button 
            className="code-execution-toggle"
            onClick={toggleCodeExecution}
            disabled={!localSelectedAgent}
          >
            {showCodeExecution ? 'Hide Code Editor' : 'Show Code Editor'}
          </button>
          
          <button 
            className="refresh-agents"
            onClick={refreshAgents}
            disabled={loading}
          >
            Refresh Agents
          </button>
        </div>
      </div>
      
      {showCodeExecution && localSelectedAgent && (
        <div className="code-execution-wrapper">
          <CodeExecutionComponent 
            agentId={localSelectedAgent} 
            threadId={currentThreadId} 
          />
        </div>
      )}
      
      <style jsx>{`
        .agent-selector-container {
          margin-bottom: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          padding: 1rem;
          background-color: #f8fafc;
        }
        
        .agent-selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .agent-dropdown-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .agent-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        select {
          padding: 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid #cbd5e0;
          background-color: white;
          min-width: 200px;
        }
        
        button {
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          border: none;
          background-color: #4a5568;
          color: white;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        button:hover {
          background-color: #2d3748;
        }
        
        button:disabled {
          background-color: #cbd5e0;
          cursor: not-allowed;
        }
        
        .code-execution-toggle {
          background-color: #3182ce;
        }
        
        .code-execution-toggle:hover {
          background-color: #2c5282;
        }
        
        .code-execution-wrapper {
          margin-top: 1rem;
          border-top: 1px solid #e2e8f0;
          padding-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default AgentSelector;
