/**
 * Analytics Service for tracking time saved and operations
 */

// In-memory storage for MVP (use database in production)
const analytics = {
  operations: [],
  totalTimeSaved: 0,
  operationCounts: {
    explain: 0,
    tests: 0,
    docs: 0
  }
};

// Time saved estimates (in minutes)
const TIME_SAVED_ESTIMATES = {
  explain: 35,
  tests: 50,
  docs: 25
};

/**
 * Calculate time saved based on operation and code complexity
 */
function calculateTimeSaved(operation, codeLength) {
  const baseTime = TIME_SAVED_ESTIMATES[operation] || 30;
  
  // Adjust based on code complexity
  let complexityMultiplier = 1.0;
  if (codeLength > 200) {
    complexityMultiplier = 1.5;
  } else if (codeLength > 100) {
    complexityMultiplier = 1.2;
  }
  
  return Math.round(baseTime * complexityMultiplier);
}

/**
 * Track an operation
 */
function trackOperation(operation, codeLength, language, success = true) {
  const timeSaved = calculateTimeSaved(operation, codeLength);
  
  const record = {
    id: Date.now().toString(),
    operation,
    codeLength,
    language,
    timeSaved,
    success,
    timestamp: new Date().toISOString()
  };
  
  analytics.operations.push(record);
  
  if (success) {
    analytics.totalTimeSaved += timeSaved;
    analytics.operationCounts[operation] = (analytics.operationCounts[operation] || 0) + 1;
  }
  
  // Keep only last 100 operations in memory
  if (analytics.operations.length > 100) {
    analytics.operations = analytics.operations.slice(-100);
  }
  
  return record;
}

/**
 * Get analytics summary
 */
function getAnalytics(period = 'all') {
  const now = new Date();
  let filteredOps = analytics.operations;
  
  // Filter by time period
  if (period === 'today') {
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    filteredOps = analytics.operations.filter(op => 
      new Date(op.timestamp) >= startOfDay
    );
  } else if (period === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredOps = analytics.operations.filter(op => 
      new Date(op.timestamp) >= weekAgo
    );
  } else if (period === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filteredOps = analytics.operations.filter(op => 
      new Date(op.timestamp) >= monthAgo
    );
  }
  
  // Calculate metrics
  const totalTimeSaved = filteredOps.reduce((sum, op) => 
    op.success ? sum + op.timeSaved : sum, 0
  );
  
  const breakdown = {
    explain: { count: 0, timeSaved: 0 },
    tests: { count: 0, timeSaved: 0 },
    docs: { count: 0, timeSaved: 0 }
  };
  
  filteredOps.forEach(op => {
    if (op.success && breakdown[op.operation]) {
      breakdown[op.operation].count++;
      breakdown[op.operation].timeSaved += op.timeSaved;
    }
  });
  
  const operationsCount = filteredOps.filter(op => op.success).length;
  const averagePerOperation = operationsCount > 0 
    ? Math.round(totalTimeSaved / operationsCount) 
    : 0;
  
  return {
    totalTimeSaved,
    operationsCount,
    breakdown,
    averagePerOperation,
    period
  };
}

/**
 * Calculate team impact
 */
function calculateTeamImpact(teamSize = 10) {
  const analytics = getAnalytics('today');
  const dailySavingsPerDev = analytics.totalTimeSaved;
  const dailySavingsTeam = dailySavingsPerDev * teamSize;
  const monthlySavingsTeam = dailySavingsTeam * 20; // 20 working days
  
  // Assuming $50/hour average developer cost
  const hourlyRate = 50;
  const annualValue = (monthlySavingsTeam * 12 * hourlyRate) / 60; // Convert minutes to hours
  
  return {
    teamSize,
    dailySavingsPerDev,
    dailySavingsTeam,
    monthlySavingsTeam,
    annualValue: Math.round(annualValue),
    currency: 'USD'
  };
}

/**
 * Get recent operations
 */
function getRecentOperations(limit = 10) {
  return analytics.operations
    .slice(-limit)
    .reverse();
}

/**
 * Reset analytics (for testing)
 */
function resetAnalytics() {
  analytics.operations = [];
  analytics.totalTimeSaved = 0;
  analytics.operationCounts = {
    explain: 0,
    tests: 0,
    docs: 0
  };
}

module.exports = {
  trackOperation,
  getAnalytics,
  calculateTeamImpact,
  getRecentOperations,
  calculateTimeSaved,
  resetAnalytics
};

// Made with Bob
