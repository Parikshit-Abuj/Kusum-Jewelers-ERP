$ErrorActionPreference = 'Stop'

$payload = Join-Path $PSScriptRoot 'payload.zip'
$hashFile = Join-Path $PSScriptRoot 'payload.sha256'
if (-not (Test-Path -LiteralPath $payload) -or -not (Test-Path -LiteralPath $hashFile)) {
  throw 'Installer payload is incomplete. Download or copy the full setup EXE again.'
}

$expectedHash = (Get-Content -LiteralPath $hashFile -Raw).Trim().ToUpperInvariant()
$actualHash = (Get-FileHash -LiteralPath $payload -Algorithm SHA256).Hash.ToUpperInvariant()
if ($actualHash -ne $expectedHash) {
  throw 'Installer integrity check failed. Do not continue; copy the setup EXE again.'
}

$destination = Join-Path $env:LOCALAPPDATA 'Kusum Jewelers ERP'
New-Item -ItemType Directory -Path $destination -Force | Out-Null
Expand-Archive -LiteralPath $payload -DestinationPath $destination -Force

$launcher = Join-Path $destination 'Kusum Jewelers ERP.exe'
if (-not (Test-Path -LiteralPath $launcher)) {
  throw 'The ERP launcher was not installed. Do not delete the setup EXE and run it again.'
}

$desktop = [Environment]::GetFolderPath('Desktop')
if ($desktop) {
  $shell = New-Object -ComObject WScript.Shell
  $shortcut = $shell.CreateShortcut((Join-Path $desktop 'Kusum Jewelers ERP.lnk'))
  $shortcut.TargetPath = $launcher
  $shortcut.WorkingDirectory = $destination
  $shortcut.IconLocation = "$launcher,0"
  $shortcut.Description = 'Open Kusum Jewelers ERP'
  $shortcut.Save()
}

Start-Process -FilePath $launcher -WorkingDirectory $destination
Write-Host 'Kusum Jewelers ERP was installed. Your browser will open the one-time shop setup page.'
