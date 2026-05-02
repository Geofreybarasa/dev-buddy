const express = require('express');
const router = express.Router();
const { 
  getAnalytics, 
  calculateTeamImpact, 
  getRecentOperations 
} = require('../services/analytics.service');

/**
 * GET /api/analytics
 * Get analytics summary
 */
router.get('/', async (req, res, next) => {
  try {
    const { period, teamSize } = req.query;
    
    // Get analytics for specified period
    const analytics = getAnalytics(period || 'all');
    
    // Calculate team impact
    const teamImpact = calculateTeamImpact(parseInt(teamSize) || 10);
    
    // Get recent operations
    const recentOperations = getRecentOperations(10);
    
    res.json({
      success: true,
      data: {
        ...analytics,
        teamImpact,
        recentOperations
      }
    });
    
  } catch (error) {
    console.error('Error in analytics route:', error);
    next(error);
  }
});

/**
 * GET /api/analytics/recent
 * Get recent operations only
 */
router.get('/recent', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recentOperations = getRecentOperations(limit);
    
    res.json({
      success: true,
      data: {
        operations: recentOperations,
        count: recentOperations.length
      }
    });
    
  } catch (error) {
    console.error('Error in recent operations route:', error);
    next(error);
  }
});

/**
 * GET /api/analytics/team-impact
 * Calculate team impact
 */
router.get('/team-impact', async (req, res, next) => {
  try {
    const teamSize = parseInt(req.query.teamSize) || 10;
    const teamImpact = calculateTeamImpact(teamSize);
    
    res.json({
      success: true,
      data: teamImpact
    });
    
  } catch (error) {
    console.error('Error in team impact route:', error);
    next(error);
  }
});

module.exports = router;

// Made with Bob
