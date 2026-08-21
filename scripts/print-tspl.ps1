[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$PrinterName
)

$base64 = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($base64)) { throw 'No TSPL data was supplied.' }
$bytes = [Convert]::FromBase64String($base64)

Add-Type -TypeDefinition @'
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;

public static class RawTsplPrinter
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public class DOC_INFO_1
    {
        [MarshalAs(UnmanagedType.LPWStr)] public string pDocName;
        [MarshalAs(UnmanagedType.LPWStr)] public string pOutputFile;
        [MarshalAs(UnmanagedType.LPWStr)] public string pDataType;
    }

    [DllImport("winspool.drv", SetLastError = true, CharSet = CharSet.Unicode)]
    private static extern bool OpenPrinter(string printerName, out IntPtr printerHandle, IntPtr printerDefaults);
    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool ClosePrinter(IntPtr printerHandle);
    [DllImport("winspool.drv", SetLastError = true, CharSet = CharSet.Unicode)]
    private static extern int StartDocPrinter(IntPtr printerHandle, int level, [In] DOC_INFO_1 docInfo);
    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool EndDocPrinter(IntPtr printerHandle);
    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool StartPagePrinter(IntPtr printerHandle);
    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool EndPagePrinter(IntPtr printerHandle);
    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool WritePrinter(IntPtr printerHandle, byte[] bytes, int count, out int written);

    private static void Check(bool ok, string operation)
    {
        if (!ok) throw new Win32Exception(Marshal.GetLastWin32Error(), operation + " failed");
    }

    public static void Send(string printerName, byte[] bytes)
    {
        IntPtr handle;
        Check(OpenPrinter(printerName, out handle, IntPtr.Zero), "OpenPrinter for '" + printerName + "'");
        try
        {
            var doc = new DOC_INFO_1 { pDocName = "Kusum Jewelers TSPL barcode labels", pDataType = "RAW" };
            if (StartDocPrinter(handle, 1, doc) == 0) throw new Win32Exception(Marshal.GetLastWin32Error(), "StartDocPrinter failed");
            try
            {
                Check(StartPagePrinter(handle), "StartPagePrinter");
                try
                {
                    int written;
                    Check(WritePrinter(handle, bytes, bytes.Length, out written), "WritePrinter");
                    if (written != bytes.Length) throw new InvalidOperationException("Only " + written + " of " + bytes.Length + " TSPL bytes were written.");
                }
                finally { Check(EndPagePrinter(handle), "EndPagePrinter"); }
            }
            finally { Check(EndDocPrinter(handle), "EndDocPrinter"); }
        }
        finally { ClosePrinter(handle); }
    }
}
'@

[RawTsplPrinter]::Send($PrinterName, $bytes)
Write-Output ("Sent {0} native TSPL bytes to {1}." -f $bytes.Length, $PrinterName)
