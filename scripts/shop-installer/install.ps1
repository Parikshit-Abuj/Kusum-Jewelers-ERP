$ErrorActionPreference = 'Stop'

$payload = Join-Path $PSScriptRoot 'payload.zip'
$hashFile = Join-Path $PSScriptRoot 'payload.sha256'
$destination = Join-Path $env:LOCALAPPDATA 'Kusum Jewelers ERP'
$errorLog = Join-Path $destination 'install-error.txt'

try {
  if (-not (Test-Path -LiteralPath $payload) -or -not (Test-Path -LiteralPath $hashFile)) {
    throw 'Installer payload is incomplete. Download or copy the full setup EXE again.'
  }

  $expectedHash = (Get-Content -LiteralPath $hashFile -Raw).Trim().ToUpperInvariant()
  $actualHash = (Get-FileHash -LiteralPath $payload -Algorithm SHA256).Hash.ToUpperInvariant()
  if ($actualHash -ne $expectedHash) {
    throw 'Installer integrity check failed. Do not continue; copy the setup EXE again.'
  }

  New-Item -ItemType Directory -Path $destination -Force | Out-Null
  Expand-Archive -LiteralPath $payload -DestinationPath $destination -Force

  $launcher = Join-Path $destination 'Kusum Jewelers ERP.exe'
  if (-not (Test-Path -LiteralPath $launcher)) {
    throw 'The ERP launcher was not installed. Do not delete the setup EXE and run it again.'
  }

  $shortcutNote = ''
  try {
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
  } catch {
    $shortcutNote = "`r`nDesktop shortcut could not be created. Open: $launcher"
  }

  Start-Process -FilePath $launcher -WorkingDirectory $destination
  Add-Type -AssemblyName System.Windows.Forms
  [System.Windows.Forms.MessageBox]::Show(
    "Kusum Jewelers ERP is installed. The browser will open the one-time shop setup page.$shortcutNote",
    'Kusum Jewelers ERP',
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Information
  ) | Out-Null
  exit 0
} catch {
  New-Item -ItemType Directory -Path $destination -Force | Out-Null
  $detail = "Installation failed on $(Get-Date -Format s).`r`n$($_ | Out-String)"
  Set-Content -LiteralPath $errorLog -Value $detail -Encoding utf8
  Add-Type -AssemblyName System.Windows.Forms
  [System.Windows.Forms.MessageBox]::Show(
    "Kusum Jewelers ERP could not finish installing.`r`n`r`nDetails were saved to:`r`n$errorLog",
    'Kusum Jewelers ERP setup',
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Error
  ) | Out-Null
  exit 1
}
