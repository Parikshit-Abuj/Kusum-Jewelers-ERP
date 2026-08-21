Kusum Jewelers ERP - Shop PC installation

1. Copy KusumJewelersERP-Setup.exe to the shop PC.
2. Run it and allow Windows to open the installer if prompted.
3. The installer creates a desktop shortcut and opens the ERP in your browser.
4. On first use, enter the local MySQL administrator password. It creates or upgrades the kusum_erp database automatically. The default ERP sign-in is kusum / kusum@123; change it in the setup form if needed.
5. The MySQL administrator password is never stored. The ERP creates and uses its own limited database account.

Requirements
- Windows 10 or 11, 64-bit
- MySQL Server running locally on the shop PC
- Internet is not needed after the installer has been copied
- Install the TSC TTP-244 Pro Windows driver before printing barcode labels

Important
- This installer intentionally does not copy development or test records. A new shop database starts clean; an existing database is never deleted by setup.
- Use the Export / archive screen for Excel exports and retain regular backups.
