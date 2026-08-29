Kusum Jewelers ERP - Shop PC installation

1. Copy KusumJewelersERP-Setup.exe to the shop PC.
2. Run it and allow Windows to open the installer if prompted.
3. The installer creates a desktop shortcut and opens the ERP in your browser.
4. On first use, select Main database PC, enter the local MySQL administrator password, and choose the shop's own ERP login password. It creates or upgrades the kusum_erp database automatically. No default ERP password is supplied.
5. The MySQL administrator password is never stored. The ERP creates one shared ERP database account, restricted to the one kusum_erp database.

Main PC / client PC setup
- Keep MySQL Server only on the main database PC. In Network PCs, note the main PC LAN IP, database name, port, and shared ERP database username/password.
- On each other billing PC, choose Client PC and enter those same values. Client PCs use the main PC's one shared database; they do not create a client database and do not need MySQL Server or the MySQL root password.
- Allow the selected MySQL port through Windows Firewall only on Private networks / local subnet. Do not expose MySQL to the internet.

Requirements
- Windows 10 or 11, 64-bit
- MySQL Server running locally on the shop PC
- Internet is not needed after the installer has been copied
- In Barcode printer, choose Windows printer / USB for USB or Windows-shared TSC printers. Choose Direct TCP / Ethernet only if the printer or print server has its own reachable IP address. Use Test TSC and confirm the physical test label.

Important
- This installer intentionally does not copy development or test records. A new shop database starts clean; an existing database is never deleted by setup.
- Use the Export / archive screen for Excel exports and retain regular backups.
