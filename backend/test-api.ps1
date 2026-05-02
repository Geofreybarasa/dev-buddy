# Test Dev Buddy API Endpoints with Mock Mode

Write-Host "Testing Dev Buddy API..." -ForegroundColor Cyan
Write-Host ""

# Wait for server to be ready
Start-Sleep -Seconds 2

# Test 1: Explain Code
Write-Host "1. Testing /api/explain endpoint..." -ForegroundColor Yellow
$explainBody = @{
    code = "function test() { return 42; }"
    language = "javascript"
} | ConvertTo-Json

try {
    $explainResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/explain" -Method Post -Body $explainBody -ContentType "application/json"
    Write-Host "SUCCESS: Explain endpoint works!" -ForegroundColor Green
    Write-Host "Response preview: $($explainResponse.explanation.Substring(0, [Math]::Min(100, $explainResponse.explanation.Length)))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "FAILED: Explain endpoint - $_" -ForegroundColor Red
    Write-Host ""
}

# Test 2: Generate Tests
Write-Host "2. Testing /api/generate-tests endpoint..." -ForegroundColor Yellow
$testBody = @{
    code = "function add(a, b) { return a + b; }"
    language = "javascript"
} | ConvertTo-Json

try {
    $testResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/generate-tests" -Method Post -Body $testBody -ContentType "application/json"
    Write-Host "SUCCESS: Generate tests endpoint works!" -ForegroundColor Green
    Write-Host "Response preview: $($testResponse.tests.Substring(0, [Math]::Min(100, $testResponse.tests.Length)))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "FAILED: Generate tests endpoint - $_" -ForegroundColor Red
    Write-Host ""
}

# Test 3: Generate Documentation
Write-Host "3. Testing /api/generate-docs endpoint..." -ForegroundColor Yellow
$docsBody = @{
    code = "class User { constructor(name) { this.name = name; } }"
    language = "javascript"
} | ConvertTo-Json

try {
    $docsResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/generate-docs" -Method Post -Body $docsBody -ContentType "application/json"
    Write-Host "SUCCESS: Generate docs endpoint works!" -ForegroundColor Green
    Write-Host "Response preview: $($docsResponse.documentation.Substring(0, [Math]::Min(100, $docsResponse.documentation.Length)))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "FAILED: Generate docs endpoint - $_" -ForegroundColor Red
    Write-Host ""
}

# Test 4: Analytics
Write-Host "4. Testing /api/analytics endpoint..." -ForegroundColor Yellow
try {
    $analyticsResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/analytics" -Method Get
    Write-Host "SUCCESS: Analytics endpoint works!" -ForegroundColor Green
    Write-Host "Total time saved: $($analyticsResponse.totalTimeSaved) minutes" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "FAILED: Analytics endpoint - $_" -ForegroundColor Red
    Write-Host ""
}

Write-Host "API Testing Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open frontend/index-simple.html in your browser"
Write-Host "2. Paste some code and click Explain Code"
Write-Host "3. Try Generate Tests and Generate Docs"
Write-Host "4. Check the Analytics tab"
Write-Host ""
Write-Host "Note: Currently using MOCK MODE for demo purposes" -ForegroundColor Cyan
Write-Host "To switch to IBM watsonx, set USE_MOCK=false in backend/.env" -ForegroundColor Gray

# Made with Bob
