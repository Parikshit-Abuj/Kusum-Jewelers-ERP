[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

try {
  Add-Type -AssemblyName System.Drawing
  $printers = @(
    [System.Drawing.Printing.PrinterSettings]::InstalledPrinters | ForEach-Object {
      $settings = New-Object System.Drawing.Printing.PrinterSettings
      $settings.PrinterName = [string]$_
      [PSCustomObject]@{
        name = [string]$_
        isValid = [bool]$settings.IsValid
      }
    }
  )
  [PSCustomObject]@{ printers = $printers } | ConvertTo-Json -Compress -Depth 3
} catch {
  [PSCustomObject]@{ printers = @(); error = $_.Exception.Message } | ConvertTo-Json -Compress -Depth 3
  exit 1
}
