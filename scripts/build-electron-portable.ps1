[CmdletBinding()]
param(
  [string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'
$scriptDirectory = $PSScriptRoot
if (-not $scriptDirectory) { $scriptDirectory = Split-Path $MyInvocation.MyCommand.Path -Parent }
$projectRoot = Split-Path $scriptDirectory -Parent
if (-not $OutputDirectory) { $OutputDirectory = Join-Path $projectRoot 'output\kusum-erp-portable' }
$outputPath = if ([System.IO.Path]::IsPathRooted($OutputDirectory)) {
  [System.IO.Path]::GetFullPath($OutputDirectory)
} else {
  [System.IO.Path]::GetFullPath((Join-Path $projectRoot $OutputDirectory))
}

if (Test-Path -LiteralPath $outputPath) {
  throw "Build output already exists at $outputPath. Choose a new empty folder; this script will never overwrite a previous delivery."
}

$packager = Join-Path $projectRoot 'node_modules\@electron\packager\bin\electron-packager.mjs'
if (-not (Test-Path -LiteralPath $packager)) { throw 'Electron Packager is missing. Run npm install first.' }

# electron-packager normally downloads Electron again. Create its expected ZIP
# from the already installed runtime so an offline release build remains possible.
$electronDist = Join-Path $projectRoot 'node_modules\electron\dist'
if (-not (Test-Path -LiteralPath $electronDist)) { throw 'The local Electron runtime is missing. Run npm install first.' }
$electronVersion = (& node -p "require('./node_modules/electron/package.json').version").Trim()
$electronZipDirectory = Join-Path ([System.IO.Path]::GetTempPath()) 'kusum-erp-electron-zips'
$electronZip = Join-Path $electronZipDirectory "electron-v$electronVersion-win32-x64.zip"
if (-not (Test-Path -LiteralPath $electronZip)) {
  New-Item -ItemType Directory -Path $electronZipDirectory -Force | Out-Null
  Compress-Archive -Path (Join-Path $electronDist '*') -DestinationPath $electronZip -CompressionLevel Optimal
}

New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
& node $packager $projectRoot 'Kusum Jewelers ERP' --platform=win32 --arch=x64 --out=$outputPath --overwrite --prune=true --asar=false --electron-zip-dir=$electronZipDirectory --ignore='^/(\.env|output|outputs|tmp|work|\.npm-cache)(/|$)' --ignore='^/src/excel-runtime/node_modules(/|$)'
if ($LASTEXITCODE -ne 0) { throw 'Could not package the Electron desktop ERP.' }

$applicationDirectory = Join-Path $outputPath 'Kusum Jewelers ERP-win32-x64'
$desktopExe = Join-Path $applicationDirectory 'Kusum Jewelers ERP.exe'
if (-not (Test-Path -LiteralPath $desktopExe)) { throw 'The portable ERP executable was not created.' }

# Electron Packager prunes development packages. Preserve the generated Prisma
# Windows client required by the production ORM at runtime.
$generatedClientSource = Join-Path $projectRoot 'node_modules\.prisma\client'
$applicationNodeModules = Join-Path $applicationDirectory 'resources\app\node_modules'
$generatedPrismaDirectory = Join-Path $applicationNodeModules '.prisma'
$generatedClientDestination = Join-Path $generatedPrismaDirectory 'client'
if (-not (Test-Path -LiteralPath $generatedClientSource)) { throw 'The generated Prisma client is missing. Run npm run db:generate before packaging.' }
if (Test-Path -LiteralPath $generatedPrismaDirectory) { Remove-Item -LiteralPath $generatedPrismaDirectory -Recurse -Force }
New-Item -ItemType Directory -Path $generatedPrismaDirectory -Force | Out-Null
Copy-Item -LiteralPath $generatedClientSource -Destination $generatedPrismaDirectory -Recurse -Force
Get-ChildItem -LiteralPath $generatedClientDestination -Filter '*.tmp*' -File -Force | Remove-Item -Force

# Neither cache is used at runtime. Removing them makes the portable folder
# smaller without changing the ERP's production dependencies.
$packageCache = Join-Path $applicationNodeModules '.cache'
if (Test-Path -LiteralPath $packageCache) { Remove-Item -LiteralPath $packageCache -Recurse -Force }

$copiedEnv = Join-Path $applicationDirectory 'resources\app\.env'
if (Test-Path -LiteralPath $copiedEnv) { Remove-Item -LiteralPath $copiedEnv -Force }

$instructions = @'
Kusum Jewelers ERP - Portable desktop package

Single-PC setup
1. Copy this entire "Kusum Jewelers ERP-win32-x64" folder to the shop PC. Do not copy only the EXE; it needs the files beside it.
2. Install and start MySQL Server on that PC, then install the TSC TTP-244 Pro Windows driver.
3. Double-click "Kusum Jewelers ERP.exe" and select "Main database PC" at first setup.

Shared main-PC / client-PC setup
1. Install MySQL Server only on the main database PC. On first ERP start there, choose "Main database PC", use localhost and the selected MySQL port, then choose and note the shared ERP database username and password.
2. Ensure MySQL listens on the main PC's LAN adapter and allow the same MySQL port through Windows Firewall only for Private networks / Local subnet. Do not expose MySQL to the internet.
3. In the ERP on the main PC, open Network PCs. If the database already existed, create or reset the one shared ERP database login there. Use the shown LAN IP address, database name, port and that same login on every client PC; client PCs do not create another database.
4. Connect every client PC to the same router/switch (Wi-Fi or Ethernet LAN cable), run the ERP EXE, select "Client PC", and enter the main PC's LAN IP and MySQL port. Client PCs do not need MySQL Server or the MySQL root password.
5. In Barcode printer on every PC, use Windows printer / USB for a USB or Windows-shared TSC (recommended), or Direct TCP only for a reachable Ethernet printer or print server. Click Test TSC and confirm the physical test label.
6. If a PC has an old or incorrect saved database port, ERP automatically opens "Repair ERP connection" instead of requiring a Windows reset. Enter the current main-PC or client-PC details there; this changes only that PC's saved connection and never deletes shop data.

The ERP creates or upgrades the kusum_erp database. The MySQL administrator password is used only during main-PC setup and is never saved. Existing shop data is never deleted.

To update an existing shop installation: first close the ERP, then replace the entire old application folder with the new "Kusum Jewelers ERP-win32-x64" folder. Do not delete the local kusum_erp MySQL database or the ERP settings in %LOCALAPPDATA%\Kusum Jewelers ERP; this preserves all shop data and setup.

No development database, credentials, or test records are included in this package. Internet and Node.js are not required on the shop PC.
'@
Set-Content -LiteralPath (Join-Path $outputPath 'READ-ME-FIRST.txt') -Value $instructions -Encoding utf8

Write-Host "Portable desktop ERP created: $applicationDirectory"
