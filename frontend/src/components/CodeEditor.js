import React from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ code, language, onChange }) {
  const handleEditorChange = (value) => {
    onChange(value || '');
  };

  // Map language names to Monaco editor language IDs
  const getMonacoLanguage = (lang) => {
    const languageMap = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'python': 'python',
      'java': 'java',
      'csharp': 'csharp',
      'go': 'go',
      'ruby': 'ruby',
      'php': 'php',
      'cpp': 'cpp',
      'rust': 'rust'
    };
    return languageMap[lang] || 'javascript';
  };

  return (
    <div className="code-editor-wrapper">
      <Editor
        height="450px"
        language={getMonacoLanguage(language)}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 10, bottom: 10 }
        }}
      />
    </div>
  );
}

export default CodeEditor;

// Made with Bob
