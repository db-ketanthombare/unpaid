$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$viewports = @(
    @{ width = 1920; height = 1080; name = "1920" },
    @{ width = 1440; height = 900;  name = "1440" },
    @{ width = 1024; height = 768;  name = "1024" },
    @{ width = 768;  height = 1024; name = "768" },
    @{ width = 375;  height = 812;  name = "375" }
)

foreach ($vp in $viewports) {
    $outFile = "d:\Unpaid-UI\scratch\viewport_$($vp.name).png"
    $winSize = "$($vp.width),$($vp.height)"
    Write-Host "Capturing viewport $($vp.name) ($winSize)..."
    Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--disable-gpu', '--virtual-time-budget=2000', "--screenshot=$outFile", "--window-size=$winSize", 'http://127.0.0.1:5173/' -Wait
    if (Test-Path $outFile) {
        Write-Host "Success: $outFile"
    } else {
        Write-Host "Failed: $outFile"
    }
}
