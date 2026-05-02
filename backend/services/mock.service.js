/**
 * Mock Service for Demo/Testing
 * Use this when IBM watsonx API is not available
 */

function generateMockExplanation(code, language) {
  return {
    overview: `This ${language} code defines a function that performs a specific operation. It demonstrates clean coding practices and follows standard conventions for ${language} development.`,
    lineByLine: code.split('\n').slice(0, 5).map((line, index) => ({
      line: index + 1,
      code: line,
      explanation: `Line ${index + 1}: ${line.includes('function') ? 'Declares a function' : line.includes('return') ? 'Returns the result' : line.includes('{') || line.includes('}') ? 'Code block delimiter' : 'Executes logic'}`
    })),
    keyConcepts: ['Functions', 'Parameters', 'Return values', 'Code structure'],
    complexity: 'O(1) - Constant time complexity for this operation',
    potentialIssues: ['Consider adding input validation', 'Add error handling for edge cases'],
    improvements: ['Add TypeScript types for better type safety', 'Include JSDoc comments', 'Add unit tests']
  };
}

function generateMockTests(code, language) {
  const functionName = code.match(/function\s+(\w+)/)?.[1] || 'testFunction';
  
  return {
    tests: `describe('${functionName} tests', () => {
  test('should work with valid inputs', () => {
    const result = ${functionName}(2, 3);
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
  });
  
  test('should handle edge cases', () => {
    const result = ${functionName}(0, 0);
    expect(result).toBeDefined();
  });
  
  test('should handle negative numbers', () => {
    const result = ${functionName}(-1, -1);
    expect(result).toBeDefined();
  });
  
  test('should handle large numbers', () => {
    const result = ${functionName}(1000000, 1000000);
    expect(result).toBeDefined();
  });
});`,
    testCases: [
      { name: 'valid inputs test', type: 'happy_path', description: 'Tests basic functionality' },
      { name: 'edge cases test', type: 'edge_case', description: 'Tests boundary conditions' },
      { name: 'negative numbers test', type: 'edge_case', description: 'Tests negative values' },
      { name: 'large numbers test', type: 'edge_case', description: 'Tests with large values' }
    ],
    coverage: '85%',
    setupRequired: 'None - tests are ready to run'
  };
}

function generateMockDocs(code, language) {
  const functionName = code.match(/function\s+(\w+)/)?.[1] || 'myFunction';
  const params = code.match(/\(([^)]*)\)/)?.[1]?.split(',').map(p => p.trim()) || ['param1', 'param2'];
  
  return {
    documentation: `/**
 * ${functionName} - Performs a specific operation
 * 
 * @description
 * This function takes input parameters and processes them according to
 * the defined logic. It follows standard ${language} conventions.
 * 
${params.map(p => ` * @param {*} ${p} - Input parameter`).join('\n')}
 * @returns {*} The result of the operation
 * 
 * @example
 * const result = ${functionName}(${params.join(', ')});
 * console.log(result);
 * 
 * @complexity O(1) - Constant time
 * @since 1.0.0
 */`,
    examples: [
      `// Basic usage\nconst result = ${functionName}(${params.map((_, i) => i + 1).join(', ')});\nconsole.log(result);`,
      `// With variables\nconst ${params[0] || 'a'} = 10;\nconst ${params[1] || 'b'} = 20;\nconst result = ${functionName}(${params[0] || 'a'}, ${params[1] || 'b'});`
    ],
    notes: [
      'This function is synchronous and returns immediately',
      'Consider adding input validation for production use',
      'Performance is optimal for typical use cases'
    ],
    relatedFunctions: ['helper1', 'helper2', 'validator']
  };
}

module.exports = {
  generateMockExplanation,
  generateMockTests,
  generateMockDocs
};

// Made with Bob
