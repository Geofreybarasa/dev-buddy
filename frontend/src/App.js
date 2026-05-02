import React, { useState, useEffect } from 'react';
import './App.css';
import CodeEditor from './components/CodeEditor';
import ResultsPanel from './components/ResultsPanel';
import Analytics from './components/Analytics';
import { explainCode, generateTests, generateDocs, getAnalytics } from './services/api.service';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [results, setResults] = useState({
    explanation: null,
    tests: null,
    docs: null
  });
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [sessionTimeSaved, setSessionTimeSaved] = useState(0);

  // Load analytics on mount
  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await getAnalytics('today', 10);
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  const handleExplain = async () => {
    if (!code.trim()) {
      setError('Please enter some code to explain');
      return;
    }

    setLoading(true);
    setError(null);
    setActiveFeature('explain');

    try {
      const response = await explainCode(code, language);
      if (response.success) {
        setResults(prev => ({ ...prev, explanation: response.data }));
        setSessionTimeSaved(prev => prev + response.data.timeSaved);
        await loadAnalytics();
      }
    } catch (err) {
      setError(err.message || 'Failed to explain code');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTests = async () => {
    if (!code.trim()) {
      setError('Please enter some code to generate tests');
      return;
    }

    setLoading(true);
    setError(null);
    setActiveFeature('tests');

    try {
      const response = await generateTests(code, language);
      if (response.success) {
        setResults(prev => ({ ...prev, tests: response.data }));
        setSessionTimeSaved(prev => prev + response.data.timeSaved);
        await loadAnalytics();
      }
    } catch (err) {
      setError(err.message || 'Failed to generate tests');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDocs = async () => {
    if (!code.trim()) {
      setError('Please enter some code to generate documentation');
      return;
    }

    setLoading(true);
    setError(null);
    setActiveFeature('docs');

    try {
      const response = await generateDocs(code, language);
      if (response.success) {
        setResults(prev => ({ ...prev, docs: response.data }));
        setSessionTimeSaved(prev => prev + response.data.timeSaved);
        await loadAnalytics();
      }
    } catch (err) {
      setError(err.message || 'Failed to generate documentation');
    } finally {
      setLoading(false);
    }
  };

  const handleClearResults = () => {
    setResults({
      explanation: null,
      tests: null,
      docs: null
    });
    setActiveFeature(null);
    setError(null);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <h1>Dev Buddy</h1>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-label">Session Time Saved</span>
              <span className="stat-value">{sessionTimeSaved} min</span>
            </div>
            {analytics && (
              <div className="stat">
                <span className="stat-label">Today's Total</span>
                <span className="stat-value">{analytics.totalTimeSaved} min</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="content-wrapper">
          {/* Left Panel - Code Editor */}
          <div className="editor-panel">
            <div className="panel-header">
              <h2>Code Input</h2>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="go">Go</option>
                <option value="ruby">Ruby</option>
                <option value="php">PHP</option>
              </select>
            </div>
            
            <CodeEditor
              code={code}
              language={language}
              onChange={setCode}
            />

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={handleExplain}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading && activeFeature === 'explain' ? '⏳ Explaining...' : '✨ Explain Code'}
              </button>
              <button
                onClick={handleGenerateTests}
                disabled={loading}
                className="btn btn-secondary"
              >
                {loading && activeFeature === 'tests' ? '⏳ Generating...' : '🧪 Generate Tests'}
              </button>
              <button
                onClick={handleGenerateDocs}
                disabled={loading}
                className="btn btn-secondary"
              >
                {loading && activeFeature === 'docs' ? '⏳ Generating...' : '📝 Generate Docs'}
              </button>
              {(results.explanation || results.tests || results.docs) && (
                <button
                  onClick={handleClearResults}
                  disabled={loading}
                  className="btn btn-clear"
                >
                  🗑️ Clear Results
                </button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
                <button onClick={() => setError(null)} className="error-close">×</button>
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="results-panel">
            <ResultsPanel
              results={results}
              activeFeature={activeFeature}
              loading={loading}
            />
          </div>
        </div>

        {/* Analytics Dashboard */}
        {analytics && (
          <Analytics analytics={analytics} />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Powered by IBM watsonx AI | Built for developers, by developers ❤️</p>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob
