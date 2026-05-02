require('dotenv').config();
const { generateExplanation } = require('./services/ai.service');

async function test() {
  console.log('🧪 Testing Code Explanation with AI Service...\n');
  
  const code = 'function add(a, b) { return a + b; }';
  const language = 'javascript';
  
  try {
    console.log('📝 Code to explain:', code);
    console.log('🔤 Language:', language);
    console.log('\n⏳ Calling AI service...\n');
    
    const result = await generateExplanation(code, language);
    
    console.log('✅ Result received!');
    console.log('🤖 AI Mode:', result.mode);
    console.log('📊 Mode Message:', result.mode === 'watsonx' ? '✅ Powered by IBM WatsonX AI' : '📝 Using demo mode');
    
    if (result.error) {
      console.log('⚠️  Error:', result.error);
    }
    
    console.log('\n📄 Explanation Overview:');
    console.log(result.explanation.overview);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

test();

// Made with Bob
