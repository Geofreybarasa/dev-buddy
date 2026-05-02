/**
 * AI Prompt Templates for Dev Buddy
 */

/**
 * Generate prompt for code explanation
 */
function getExplainPrompt(code, language) {
  return `You are an expert code reviewer and teacher. Analyze the following ${language} code and provide a comprehensive explanation.

CODE:
\`\`\`${language}
${code}
\`\`\`

Provide your response in the following JSON format (ensure valid JSON):
{
  "overview": "A 2-3 sentence high-level explanation of what this code does",
  "lineByLine": [
    {
      "line": 1,
      "code": "actual code line",
      "explanation": "what this line does"
    }
  ],
  "keyConcepts": ["concept1", "concept2", "concept3"],
  "complexity": "Time and space complexity analysis",
  "potentialIssues": ["issue1", "issue2"],
  "improvements": ["suggestion1", "suggestion2"]
}

Be clear, concise, and educational. Assume the reader is a junior developer who needs to understand this code quickly.`;
}

/**
 * Generate prompt for test generation
 */
function getTestPrompt(code, language, framework = 'auto') {
  const frameworkMap = {
    javascript: 'Jest',
    typescript: 'Jest',
    python: 'pytest',
    java: 'JUnit',
    csharp: 'NUnit',
    go: 'testing package',
    ruby: 'RSpec',
    php: 'PHPUnit',
    auto: 'the appropriate testing framework'
  };

  const testFramework = frameworkMap[language.toLowerCase()] || frameworkMap.auto;

  return `You are an expert test engineer. Generate comprehensive unit tests for the following ${language} code.

CODE:
\`\`\`${language}
${code}
\`\`\`

REQUIREMENTS:
- Use ${testFramework} testing framework
- Include happy path tests
- Include edge cases
- Include error handling tests
- Add descriptive test names
- Aim for 80%+ code coverage

Provide your response in the following JSON format (ensure valid JSON):
{
  "tests": "complete test code as a string with proper formatting",
  "testCases": [
    {
      "name": "test name",
      "type": "happy_path",
      "description": "what this test validates"
    }
  ],
  "coverage": "estimated coverage percentage",
  "setupRequired": "any setup/teardown code needed or 'None'"
}

Generate production-ready tests that can be run immediately.`;
}

/**
 * Generate prompt for documentation generation
 */
function getDocsPrompt(code, language, format = 'auto') {
  const formatMap = {
    javascript: 'JSDoc',
    typescript: 'TSDoc',
    python: 'Docstring (Google style)',
    java: 'Javadoc',
    csharp: 'XML Documentation',
    go: 'Go doc comments',
    ruby: 'YARD',
    php: 'PHPDoc',
    auto: 'the standard format for this language'
  };

  const docFormat = formatMap[language.toLowerCase()] || formatMap.auto;

  return `You are a technical documentation expert. Generate professional documentation for the following ${language} code.

CODE:
\`\`\`${language}
${code}
\`\`\`

REQUIREMENTS:
- Use ${docFormat} format
- Document all parameters with types
- Document return values
- Include usage examples
- Add notes about complexity or dependencies
- Be clear and professional

Provide your response in the following JSON format (ensure valid JSON):
{
  "documentation": "formatted documentation string with proper syntax",
  "examples": ["example1 with code", "example2 with code"],
  "notes": ["important note1", "important note2"],
  "relatedFunctions": ["function1", "function2"]
}

Generate documentation that follows industry best practices.`;
}

/**
 * Detect programming language from code
 */
function detectLanguage(code) {
  const patterns = {
    javascript: /\b(const|let|var|function|=>|console\.log)\b/,
    typescript: /\b(interface|type|enum|namespace|as\s+\w+)\b/,
    python: /\b(def|import|from|class|print|if __name__)\b/,
    java: /\b(public|private|protected|class|void|static|import java\.)\b/,
    csharp: /\b(using|namespace|public|private|class|void|static)\b/,
    go: /\b(package|func|import|type|var|const)\b/,
    ruby: /\b(def|end|class|module|require|puts)\b/,
    php: /<\?php|\$\w+|function\s+\w+/,
    cpp: /#include|std::|cout|cin|namespace/,
    rust: /\b(fn|let|mut|impl|trait|use)\b/
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(code)) {
      return lang;
    }
  }

  return 'unknown';
}

module.exports = {
  getExplainPrompt,
  getTestPrompt,
  getDocsPrompt,
  detectLanguage
};

// Made with Bob
