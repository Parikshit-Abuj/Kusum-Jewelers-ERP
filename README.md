# Kusum Jewelers ERP

Lightweight local ERP for jewellery inventory, daily gold and silver rates, barcode billing, customer credit, cashbook, URD purchases, exports and archive management.

## Shop PC installer

Use the generated `KusumJewelersERP-Setup.exe` on the shop PC. It installs the ERP under the current Windows user's local application data folder, adds a Desktop shortcut, and opens a one-time setup page. That page asks for the **local** MySQL administrator password just once, creates or upgrades `kusum_erp`, applies the Prisma database schema, and creates one shared ERP MySQL account restricted to this ERP database. The MySQL administrator password is never saved.

Before running the installer, install and start **MySQL Server** on the shop PC. For barcode labels, install the Windows driver for the **TSC TTP-244 Pro** and use the exact Windows printer name on the setup page. Re-running the installer updates program files while leaving the local ERP configuration and database intact; it deliberately never deletes existing shop data.

## Local setup

1. Create a MySQL database named `kusum_erp`.
2. Copy `.env.example` to `.env` and enter the local database and login settings.
3. Install packages with `npm install`.
4. Run `npm run db:generate`, then `npm run db:migrate`.
5. Start the app with `npm start` and open `http://localhost:3000`.

## Shared main PC / client PC setup

There is one database, normally named `kusum_erp`, on the main database PC. It contains all sales, stock, customers, cashbook records and settings. Every client PC connects to that same database; a client PC does **not** create or copy a second database.

1. On the main PC, install MySQL Server and run the ERP. Choose **Main database PC**, use `localhost`, and record the database name, port, shared ERP database username and password that you choose.
2. In ERP on the main PC open **Network PCs**. Use a shown LAN IP address; allow that MySQL port through Windows Firewall only for the Private shop network / local subnet. Do not expose MySQL to the internet.
3. On every client PC, run ERP and choose **Client PC**. Enter the main PC's LAN IP, the same MySQL port, same database name, and the same shared ERP database username and password. Do not use `localhost` on a client PC.
4. The ERP login (`kusum` by default) is separate from the MySQL shared ERP database username. The MySQL root account is only for main-PC setup and is not entered on client PCs.

If the saved details are stale—for example MySQL was reinstalled on a new port—the ERP opens **Repair ERP connection**. Save the current settings there; it changes only that PC's local connection settings and never deletes the shared database.

## TSC TTP-244 Pro barcode labels

Barcode labels are sent as native TSPL raw data - never as PDF labels. The ERP uses the included `GOLD.PRN` and `SILVER.PRN` templates verbatim.

In **Barcode printer** choose the transport for each PC:

- **Windows printer / USB** (recommended): sends a RAW TSPL job through the Windows spooler. It works with a USB TSC, a Windows shared printer, or a printer installed with a Windows Standard TCP/IP port.
- **Direct TCP / Ethernet**: opens a TCP connection to the configured printer or print-server IP and sends the same TSPL bytes. Use this only if that actual printer/interface has a reachable IP address. A router provides the LAN path; it cannot give Ethernet capability to a USB-only printer.

The equivalent environment settings are:

```env
TSC_PRINTER_MODE=WINDOWS
TSC_PRINTER_NAME=TSC TTP-244 Pro
TSC_PRINTER_HOST=
TSC_PRINTER_PORT=9100
```

Use **Recheck printer** to test the Windows queue or TCP connection, then **Test TSC** to send a real test label. A successful Windows result proves the spooler accepted the RAW bytes; a successful TCP result proves the network endpoint accepted the bytes. Confirm the final physical label at the printer.

## Security

Do not commit `.env`, database backups, exports, or temporary work files. Configure credentials locally through environment variables.
