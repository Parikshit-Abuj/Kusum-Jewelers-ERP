[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

try {
  Add-Type -AssemblyName System.Drawing
  # Avoid a Win32_Printer/CIM scan here. It can pause for several seconds when
  # a disconnected network queue or a damaged WMI service is present.
  $printers = @(
    [System.Drawing.Printing.PrinterSettings]::InstalledPrinters | ForEach-Object {
      $settings = New-Object System.Drawing.Printing.PrinterSettings
      $settings.PrinterName = [string]$_
      [PSCustomObject]@{
        name = [string]$_
        isValid = [bool]$settings.IsValid
        # PrinterSettings can confirm a queue exists but cannot reliably report
        # USB/network power state. Do not claim an invented online/offline state.
        canConfirmPhysicalStatus = $false
        workOffline = $false
        printerStatus = 0
      }
    }
  )
  [PSCustomObject]@{ printers = $printers } | ConvertTo-Json -Compress -Depth 3
} catch {
  [PSCustomObject]@{ printers = @(); error = $_.Exception.Message } | ConvertTo-Json -Compress -Depth 3
  # Always return JSON successfully. Node can show the useful diagnostic
  # instead of treating a printer check as a desktop-application failure.
  exit 0
}
