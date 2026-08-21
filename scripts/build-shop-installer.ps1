[CmdletBinding()]
param(
  [string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'
$scriptDirectory = $PSScriptRoot
if (-not $scriptDirectory) { $scriptDirectory = Split-Path $MyInvocation.MyCommand.Path -Parent }
$projectRoot = Split-Path $scriptDirectory -Parent
if (-not $OutputDirectory) { $OutputDirectory = Join-Path $projectRoot 'output\shop-installer' }
$outputPath = if ([System.IO.Path]::IsPathRooted($OutputDirectory)) {
  [System.IO.Path]::GetFullPath($OutputDirectory)
} else {
  [System.IO.Path]::GetFullPath((Join-Path $projectRoot $OutputDirectory))
}
$payloadPath = Join-Path $outputPath 'payload'
$installerFilesPath = Join-Path $outputPath 'installer-files'
$setupExe = Join-Path $outputPath 'KusumJewelersERP-Setup.exe'

if (Test-Path -LiteralPath $outputPath) {
  throw "Build output already exists at $outputPath. Move or rename that folder before building again so no installer is overwritten accidentally."
}

New-Item -ItemType Directory -Path $payloadPath -Force | Out-Null
New-Item -ItemType Directory -Path $installerFilesPath -Force | Out-Null

foreach ($item in @('public', 'prisma', 'scripts', 'package.json', 'package-lock.json', '.env.example', 'README.md')) {
  Copy-Item -LiteralPath (Join-Path $projectRoot $item) -Destination $payloadPath -Recurse -Force
}

# The development workspace exposes Excel libraries through a linked
# node_modules folder. Copy the two ERP exporter files explicitly so the link
# is never followed into the portable package.
$sourceRoot = Join-Path $projectRoot 'src'
$payloadSourceRoot = Join-Path $payloadPath 'src'
New-Item -ItemType Directory -Path $payloadSourceRoot -Force | Out-Null
Get-ChildItem -LiteralPath $sourceRoot -Force | Where-Object { $_.Name -ne 'excel-runtime' } | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $payloadSourceRoot -Recurse -Force
}
$sourceExcelRuntime = Join-Path $sourceRoot 'excel-runtime'
$payloadExcelRuntime = Join-Path $payloadSourceRoot 'excel-runtime'
New-Item -ItemType Directory -Path $payloadExcelRuntime -Force | Out-Null
Get-ChildItem -LiteralPath $sourceExcelRuntime -File -Force | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $payloadExcelRuntime -Force
}

# Install only the production dependency tree. Prisma's generated Windows
# client is copied below, so the installer does not carry development tools,
# package caches, or unused engines for other operating systems.
$npmCommand = (Get-Command npm.cmd -ErrorAction Stop).Source
Push-Location $payloadPath
try {
  & $npmCommand ci --omit=dev --omit=optional --ignore-scripts --cache (Join-Path $projectRoot '.npm-cache')
  if ($LASTEXITCODE -ne 0) { throw 'Could not prepare the production ERP runtime.' }
} finally {
  Pop-Location
}

$generatedClientSource = Join-Path $projectRoot 'node_modules\.prisma\client'
$generatedClientDestination = Join-Path $payloadPath 'node_modules\.prisma\client'
if (-not (Test-Path -LiteralPath $generatedClientSource)) { throw 'The generated Prisma client is missing. Run npm run db:generate before building the installer.' }
New-Item -ItemType Directory -Path (Split-Path $generatedClientDestination -Parent) -Force | Out-Null
Copy-Item -LiteralPath $generatedClientSource -Destination $generatedClientDestination -Recurse -Force
Get-ChildItem -LiteralPath $generatedClientDestination -Filter '*.tmp*' -File -Force | Remove-Item -Force

$runtimePath = Join-Path $payloadPath 'runtime'
New-Item -ItemType Directory -Path $runtimePath -Force | Out-Null
$nodePath = (Get-Command node.exe -ErrorAction Stop).Source
Copy-Item -LiteralPath $nodePath -Destination (Join-Path $runtimePath 'node.exe') -Force

$launcherSource = @'
using System;
using System.Diagnostics;
using System.IO;
using System.Net.Sockets;
using System.Threading;
using System.Windows.Forms;

public static class KusumErpLauncher
{
    static bool IsListening()
    {
        try
        {
            using (var client = new TcpClient())
            {
                var task = client.ConnectAsync("127.0.0.1", 3000);
                return task.Wait(150) && client.Connected;
            }
        }
        catch { return false; }
    }

    [STAThread]
    public static void Main()
    {
        string root = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName);
        string node = Path.Combine(root, "runtime", "node.exe");
        string launcher = Path.Combine(root, "src", "shop-launcher.js");
        string appData = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Kusum Jewelers ERP");
        if (!File.Exists(node) || !File.Exists(launcher))
        {
            MessageBox.Show("ERP installation files are missing. Run KusumJewelersERP-Setup.exe again.", "Kusum Jewelers ERP", MessageBoxButtons.OK, MessageBoxIcon.Error);
            return;
        }
        Directory.CreateDirectory(Path.Combine(appData, "logs"));
        if (!IsListening())
        {
            var start = new ProcessStartInfo();
            start.FileName = node;
            start.Arguments = "\"" + launcher + "\"";
            start.WorkingDirectory = root;
            start.UseShellExecute = false;
            start.CreateNoWindow = true;
            start.WindowStyle = ProcessWindowStyle.Hidden;
            start.EnvironmentVariables["KUSUM_APP_DATA"] = appData;
            start.EnvironmentVariables["KUSUM_CONFIG_PATH"] = Path.Combine(appData, ".env");
            start.EnvironmentVariables["NODE_ENV"] = "production";
            Process.Start(start);
            for (int attempt = 0; attempt < 20 && !IsListening(); attempt++) Thread.Sleep(250);
        }
        Process.Start(new ProcessStartInfo("http://localhost:3000") { UseShellExecute = true });
    }
}
'@

Add-Type -TypeDefinition $launcherSource -OutputAssembly (Join-Path $payloadPath 'Kusum Jewelers ERP.exe') -OutputType WindowsApplication -ReferencedAssemblies @('System.dll', 'System.Windows.Forms.dll')

$payloadZip = Join-Path $installerFilesPath 'payload.zip'
# The setup EXE already contains this ZIP. Storing it avoids a second long
# compression pass and makes the build reliable even on a modest shop PC.
& tar.exe -a --options zip:compression-level=0 -c -f $payloadZip -C $payloadPath .
if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $payloadZip)) { throw 'Could not create the installer payload archive.' }
(Get-FileHash -LiteralPath $payloadZip -Algorithm SHA256).Hash | Set-Content -LiteralPath (Join-Path $installerFilesPath 'payload.sha256') -NoNewline

Copy-Item -LiteralPath (Join-Path $scriptDirectory 'shop-installer\install.cmd') -Destination $installerFilesPath -Force
Copy-Item -LiteralPath (Join-Path $scriptDirectory 'shop-installer\install.ps1') -Destination $installerFilesPath -Force
Copy-Item -LiteralPath (Join-Path $scriptDirectory 'shop-installer\README-Shop-PC.txt') -Destination $outputPath -Force

$sedPath = Join-Path $outputPath 'build-installer.sed'
$sed = @"
[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=1
HideExtractAnimation=0
UseLongFileName=1
InsideCompressed=0
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=N
InstallPrompt=
DisplayLicense=
FinishMessage=
TargetName=$setupExe
FriendlyName=Kusum Jewelers ERP Setup
AppLaunched=install.cmd
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
SourceFiles=SourceFiles
[Strings]
FILE0="install.cmd"
FILE1="install.ps1"
FILE2="payload.zip"
FILE3="payload.sha256"
[SourceFiles]
SourceFiles0=$installerFilesPath
[SourceFiles0]
%FILE0%=
%FILE1%=
%FILE2%=
%FILE3%=
"@
Set-Content -LiteralPath $sedPath -Value $sed -Encoding ascii

$iexpress = Join-Path $env:SystemRoot 'System32\iexpress.exe'
$process = Start-Process -FilePath $iexpress -ArgumentList @('/N', $sedPath) -Wait -PassThru -NoNewWindow
if ($process.ExitCode -ne 0 -or -not (Test-Path -LiteralPath $setupExe)) { throw 'IExpress could not create the setup EXE.' }

(Get-FileHash -LiteralPath $setupExe -Algorithm SHA256).Hash | Set-Content -LiteralPath (Join-Path $outputPath 'KusumJewelersERP-Setup.sha256') -NoNewline

Remove-Item -LiteralPath $payloadPath -Recurse -Force
Remove-Item -LiteralPath $installerFilesPath -Recurse -Force
Remove-Item -LiteralPath $sedPath -Force

Write-Host "Shop installer created: $setupExe"
