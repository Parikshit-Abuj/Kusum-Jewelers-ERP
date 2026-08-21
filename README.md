# Kusum Jewelers ERP

Lightweight local ERP for jewellery inventory, daily gold and silver rates, barcode billing, customer credit, cashbook, URD purchases, repairs, exports and archive management.

## Shop PC installer

Use the generated `KusumJewelersERP-Setup.exe` on the shop PC. It installs the ERP under the current Windows user's local application data folder, adds a Desktop shortcut, and opens a one-time setup page. That page asks for the **local** MySQL administrator password just once, creates or upgrades `kusum_erp`, applies the Prisma database schema, and creates a separate database account restricted to this ERP database. The MySQL administrator password is never saved.

Before running the installer, install and start **MySQL Server** on the shop PC. For barcode labels, install the Windows driver for the **TSC TTP-244 Pro** and use the exact Windows printer name on the setup page. Re-running the installer updates program files while leaving the local ERP configuration and database intact; it deliberately never deletes existing shop data.

## Local setup

1. Create a MySQL database named `kusum_erp`.
2. Copy `.env.example` to `.env` and enter the local database and login settings.
3. Install packages with `npm install`.
4. Run `npm run db:generate`, then `npm run db:migrate`.
5. Start the app with `npm start` and open `http://localhost:3000`.

## TSC TTP-244 Pro barcode labels

Barcode labels are sent as native TSPL raw data - never as PDF labels. The ERP uses the included `GOLD.PRN` and `SILVER.PRN` templates verbatim, detects the configured Windows TSC printer before printing, and sends the job through the Windows RAW printer spooler.

Set the installed Windows printer name in `.env`:

```env
TSC_PRINTER_NAME=TSC TTP-244 Pro
```

If the printer is not detected, turn it on, reconnect USB, install its Windows driver, then use **Recheck printer** in Inventory.

## Security

Do not commit `.env`, database backups, exports, or temporary work files. Configure credentials locally through environment variables.
