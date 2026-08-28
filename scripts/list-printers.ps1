[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

try {
  Add-Type -AssemblyName System.Drawing
  $cimPrinters = @{}
  try {
    Get-CimInstance -ClassName Win32_Printer -ErrorAction Stop | ForEach-Object {
      $cimPrinters[[string]$_.Name] = $_
    }
  } catch {
    # InstalledPrinters remains a reliable fallback when CIM is unavailable.
  }
  $printers = @(
    [System.Drawing.Printing.PrinterSettings]::InstalledPrinters | ForEach-Object {
      $settings = New-Object System.Drawing.Printing.PrinterSettings
      $settings.PrinterName = [string]$_
      $cim = $cimPrinters[[string]$_]
      [PSCustomObject]@{
        name = [string]$_
        isValid = [bool]$settings.IsValid
        workOffline = if ($null -ne $cim) { [bool]$cim.WorkOffline } else { $false }
        printerStatus = if ($null -ne $cim) { [int]$cim.PrinterStatus } else { 0 }
      }
    }
  )
  [PSCustomObject]@{ printers = $printers } | ConvertTo-Json -Compress -Depth 3
} catch {
  [PSCustomObject]@{ printers = @(); error = $_.Exception.Message } | ConvertTo-Json -Compress -Depth 3
  exit 1
}
