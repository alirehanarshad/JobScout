# setup-automation.ps1 — Register automated job scanning task in Windows Task Scheduler
# Targets recurring scans to reach high-volume job ingestion (~1,200 postings/day).

param (
    [int]$IntervalHours = 4
)

$workingDir = "D:\JobScout\career-ops"
$nodePath = (Get-Command node.exe).Source

Write-Host "Setting up automated career-ops job scanner..." -ForegroundColor Cyan
Write-Host "Working Directory: $workingDir"
Write-Host "Node Executable  : $nodePath"
Write-Host "Run Interval     : Every $IntervalHours hours"

$action = New-ScheduledTaskAction -Execute $nodePath -Argument "scan.mjs --verify" -WorkingDirectory $workingDir
$trigger = New-ScheduledTaskTrigger -Daily -At 8:00AM
$trigger.RepetitionInterval = (New-TimeSpan -Hours $IntervalHours)

try {
    Unregister-ScheduledTask -TaskName "career-ops-job-scan" -Confirm:$false -ErrorAction SilentlyContinue
    Register-ScheduledTask -TaskName "career-ops-job-scan" -Action $action -Trigger $trigger -Description "Automated high-volume job scanner for career-ops"
    Write-Host "✅ Scheduled Task 'career-ops-job-scan' successfully registered!" -ForegroundColor Green
    Write-Host "It will execute every $IntervalHours hours automatically." -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to register scheduled task: $_" -ForegroundColor Red
    Write-Host "Tip: Run PowerShell as Administrator if permission is required." -ForegroundColor Yellow
}
