import React from 'react';

function Analytics({ analytics }) {
  if (!analytics) return null;

  const { totalTimeSaved, operationsCount, breakdown, teamImpact } = analytics;

  return (
    <div className="analytics-dashboard">
      <h2>📊 Analytics Dashboard</h2>
      
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Time Saved Today</h3>
          <div className="value">{totalTimeSaved}</div>
          <div className="label">minutes</div>
        </div>

        <div className="analytics-card">
          <h3>Operations Performed</h3>
          <div className="value">{operationsCount}</div>
          <div className="label">today</div>
        </div>

        <div className="analytics-card">
          <h3>Code Explanations</h3>
          <div className="value">{breakdown.explain.count}</div>
          <div className="label">{breakdown.explain.timeSaved} min saved</div>
        </div>

        <div className="analytics-card">
          <h3>Tests Generated</h3>
          <div className="value">{breakdown.tests.count}</div>
          <div className="label">{breakdown.tests.timeSaved} min saved</div>
        </div>

        <div className="analytics-card">
          <h3>Docs Generated</h3>
          <div className="value">{breakdown.docs.count}</div>
          <div className="label">{breakdown.docs.timeSaved} min saved</div>
        </div>

        {teamImpact && (
          <div className="analytics-card" style={{ gridColumn: 'span 2' }}>
            <h3>Team Impact (Team of {teamImpact.teamSize})</h3>
            <div className="value">${teamImpact.annualValue.toLocaleString()}</div>
            <div className="label">annual productivity value</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              {teamImpact.dailySavingsTeam} min/day • {teamImpact.monthlySavingsTeam} min/month
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;

// Made with Bob
