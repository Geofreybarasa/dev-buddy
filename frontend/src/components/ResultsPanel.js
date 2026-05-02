import React, { useState } from 'react';

function ResultsPanel({ results, activeFeature, loading }) {
  const [activeTab, setActiveTab] = useState('explanation');

  const hasResults = results.explanation || results.tests || results.docs;

  if (loading) {
    return (
      <div className="results-panel">
        <div className="panel-header">
          <h2>Results</h2>
        </div>
        <div className="results-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Processing your code with IBM watsonx AI...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasResults) {
    return (
      <div className="results-panel">
        <div className="panel-header">
          <h2>Results</h2>
        </div>
        <div className="results-content">
          <div className="results-empty">
            <div className="results-empty-icon">💡</div>
            <p>No results yet</p>
            <small>Click a button to analyze your code</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <div className="panel-header">
        <h2>Results</h2>
        <div className="tab-buttons">
          {results.explanation && (
            <button
              className={`tab-btn ${activeTab === 'explanation' ? 'active' : ''}`}
              onClick={() => setActiveTab('explanation')}
            >
              ✨ Explanation
            </button>
          )}
          {results.tests && (
            <button
              className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`}
              onClick={() => setActiveTab('tests')}
            >
              🧪 Tests
            </button>
          )}
          {results.docs && (
            <button
              className={`tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
              onClick={() => setActiveTab('docs')}
            >
              📝 Docs
            </button>
          )}
        </div>
      </div>
      <div className="results-content">
        {activeTab === 'explanation' && results.explanation && (
          <ExplanationView data={results.explanation} />
        )}
        {activeTab === 'tests' && results.tests && (
          <TestsView data={results.tests} />
        )}
        {activeTab === 'docs' && results.docs && (
          <DocsView data={results.docs} />
        )}
      </div>
    </div>
  );
}

function ExplanationView({ data }) {
  const explanation = data.explanation;

  return (
    <div className="result-view">
      {data.aiModeMessage && (
        <div className={`result-section ai-mode-indicator ${data.aiMode === 'watsonx' ? 'ai-mode-watsonx' : 'ai-mode-mock'}`}>
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>{data.aiModeMessage}</p>
          {data.fallbackReason && (
            <small style={{ display: 'block', marginTop: '0.25rem', opacity: 0.8 }}>
              Reason: {data.fallbackReason}
            </small>
          )}
        </div>
      )}
      <div className="result-section">
        <h3>⏱️ Time Saved: {data.timeSaved} minutes</h3>
      </div>

      {explanation.overview && (
        <div className="result-section">
          <h3>📋 Overview</h3>
          <div className="result-content">
            <p>{explanation.overview}</p>
          </div>
        </div>
      )}

      {explanation.lineByLine && explanation.lineByLine.length > 0 && (
        <div className="result-section">
          <h3>🔍 Line-by-Line Breakdown</h3>
          <div className="line-by-line">
            {explanation.lineByLine.map((item, index) => (
              <div key={index} className="code-line">
                <span className="code-line-number">Line {item.line}:</span>
                <code className="code-line-code">{item.code}</code>
                <p className="code-line-explanation">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {explanation.keyConcepts && explanation.keyConcepts.length > 0 && (
        <div className="result-section">
          <h3>🎯 Key Concepts</h3>
          <div className="concept-tags">
            {explanation.keyConcepts.map((concept, index) => (
              <span key={index} className="concept-tag">{concept}</span>
            ))}
          </div>
        </div>
      )}

      {explanation.complexity && (
        <div className="result-section">
          <h3>⚡ Complexity Analysis</h3>
          <div className="result-content">
            <p>{explanation.complexity}</p>
          </div>
        </div>
      )}

      {explanation.improvements && explanation.improvements.length > 0 && (
        <div className="result-section">
          <h3>💡 Suggested Improvements</h3>
          <div className="result-content">
            <ul>
              {explanation.improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function TestsView({ data }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.tests);
    alert('Tests copied to clipboard!');
  };

  return (
    <div className="result-view">
      {data.aiModeMessage && (
        <div className={`result-section ai-mode-indicator ${data.aiMode === 'watsonx' ? 'ai-mode-watsonx' : 'ai-mode-mock'}`}>
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>{data.aiModeMessage}</p>
          {data.fallbackReason && (
            <small style={{ display: 'block', marginTop: '0.25rem', opacity: 0.8 }}>
              Reason: {data.fallbackReason}
            </small>
          )}
        </div>
      )}
      <div className="result-section">
        <h3>⏱️ Time Saved: {data.timeSaved} minutes</h3>
      </div>

      <div className="result-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>🧪 Generated Tests</h3>
          <button onClick={copyToClipboard} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            📋 Copy Tests
          </button>
        </div>
        <div className="result-content">
          <pre><code>{data.tests}</code></pre>
        </div>
      </div>

      {data.testCases && data.testCases.length > 0 && (
        <div className="result-section">
          <h3>📊 Test Cases</h3>
          <div className="result-content">
            <ul>
              {data.testCases.map((testCase, index) => (
                <li key={index}>
                  <strong>{testCase.name}</strong> ({testCase.type})
                  {testCase.description && <p>{testCase.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {data.coverage && (
        <div className="result-section">
          <h3>📈 Estimated Coverage: {data.coverage}</h3>
        </div>
      )}
    </div>
  );
}

function DocsView({ data }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.documentation);
    alert('Documentation copied to clipboard!');
  };

  return (
    <div className="result-view">
      {data.aiModeMessage && (
        <div className={`result-section ai-mode-indicator ${data.aiMode === 'watsonx' ? 'ai-mode-watsonx' : 'ai-mode-mock'}`}>
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>{data.aiModeMessage}</p>
          {data.fallbackReason && (
            <small style={{ display: 'block', marginTop: '0.25rem', opacity: 0.8 }}>
              Reason: {data.fallbackReason}
            </small>
          )}
        </div>
      )}
      <div className="result-section">
        <h3>⏱️ Time Saved: {data.timeSaved} minutes</h3>
      </div>

      <div className="result-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>📝 Generated Documentation</h3>
          <button onClick={copyToClipboard} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            📋 Copy Docs
          </button>
        </div>
        <div className="result-content">
          <pre><code>{data.documentation}</code></pre>
        </div>
      </div>

      {data.examples && data.examples.length > 0 && (
        <div className="result-section">
          <h3>💡 Usage Examples</h3>
          <div className="result-content">
            {data.examples.map((example, index) => (
              <pre key={index}><code>{example}</code></pre>
            ))}
          </div>
        </div>
      )}

      {data.notes && data.notes.length > 0 && (
        <div className="result-section">
          <h3>📌 Important Notes</h3>
          <div className="result-content">
            <ul>
              {data.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsPanel;

// Made with Bob
