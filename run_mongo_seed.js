const mongoose = require('mongoose');

async function seedInvoices() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined. Please run with --env-file=.env.local");
    }

    let uri = process.env.MONGODB_URI;
    if (uri.includes('/deen_hub')) {
      uri = uri.replace('/deen_hub', '/deens_daily_hub');
    }
    
    await mongoose.connect(uri);
    const db = mongoose.connection.db;

    const invoices = [
  {
    "_id": "4-HLXZLZ",
    "invoiceId": "4-HLXZLZ",
    "date": "2025-08-12",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-HOYXIL",
    "invoiceId": "4-HOYXIL",
    "date": "2025-08-19",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-HTUS2I",
    "invoiceId": "4-HTUS2I",
    "date": "2025-09-05",
    "total": 52.7,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-HUXST9",
    "invoiceId": "4-HUXST9",
    "date": "2025-09-10",
    "total": 21.44,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-HXH0A3",
    "invoiceId": "4-HXH0A3",
    "date": "2025-09-11",
    "total": 4.09,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-HXH0I7",
    "invoiceId": "4-HXH0I7",
    "date": "2025-09-14",
    "total": 19.79,
    "itemCount": 5,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-HXH246",
    "invoiceId": "4-HXH246",
    "date": "2025-09-16",
    "total": 53.99,
    "itemCount": 6,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-HXH0TR",
    "invoiceId": "4-HXH0TR",
    "date": "2025-09-16",
    "total": 51.56,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-HXH0WM",
    "invoiceId": "4-HXH0WM",
    "date": "2025-09-17",
    "total": 50.21,
    "itemCount": 6,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-HXH18Y",
    "invoiceId": "4-HXH18Y",
    "date": "2025-09-18",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-HXH16K",
    "invoiceId": "4-HXH16K",
    "date": "2025-09-20",
    "total": 5.4,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-I1X8WO",
    "invoiceId": "4-I1X8WO",
    "date": "2025-09-24",
    "total": 63.34,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-I7PGM2",
    "invoiceId": "4-I7PGM2",
    "date": "2025-10-03",
    "total": 200.33,
    "itemCount": 8,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-I7PMO7",
    "invoiceId": "4-I7PMO7",
    "date": "2025-10-06",
    "total": 49.93,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-I7QIWB",
    "invoiceId": "4-I7QIWB",
    "date": "2025-10-07",
    "total": 64.65,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-I7QLS0",
    "invoiceId": "4-I7QLS0",
    "date": "2025-10-08",
    "total": 102.79,
    "itemCount": 4,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-ICFQIB",
    "invoiceId": "4-ICFQIB",
    "date": "2025-10-09",
    "total": 21.27,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-I7QOJ2",
    "invoiceId": "4-I7QOJ2",
    "date": "2025-10-10",
    "total": 65.31,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-ICFTED",
    "invoiceId": "4-ICFTED",
    "date": "2025-10-10",
    "total": 53.17,
    "itemCount": 5,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-ICG4KG",
    "invoiceId": "4-ICG4KG",
    "date": "2025-10-15",
    "total": 205.8,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IDSXHN",
    "invoiceId": "4-IDSXHN",
    "date": "2025-10-16",
    "total": 100.67,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IFU9ZS",
    "invoiceId": "4-IFU9ZS",
    "date": "2025-10-22",
    "total": 180.44,
    "itemCount": 11,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IFUA8O",
    "invoiceId": "4-IFUA8O",
    "date": "2025-10-23",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IFUAIY",
    "invoiceId": "4-IFUAIY",
    "date": "2025-10-23",
    "total": 5.4,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IFUB1C",
    "invoiceId": "4-IFUB1C",
    "date": "2025-10-24",
    "total": 495.06,
    "itemCount": 23,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IICZON",
    "invoiceId": "4-IICZON",
    "date": "2025-10-29",
    "total": 28.64,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IICZTL",
    "invoiceId": "4-IICZTL",
    "date": "2025-10-30",
    "total": 6.87,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-ILLN9Z",
    "invoiceId": "4-ILLN9Z",
    "date": "2025-11-01",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-ILNHBU",
    "invoiceId": "4-ILNHBU",
    "date": "2025-11-04",
    "total": 18.5,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-ILNHO7",
    "invoiceId": "4-ILNHO7",
    "date": "2025-11-05",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-ILNNXR",
    "invoiceId": "4-ILNNXR",
    "date": "2025-11-08",
    "total": 29.44,
    "itemCount": 4,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-ILNP50",
    "invoiceId": "4-ILNP50",
    "date": "2025-11-09",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-ILNPC2",
    "invoiceId": "4-ILNPC2",
    "date": "2025-11-10",
    "total": 42.07,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IPPB47",
    "invoiceId": "4-IPPB47",
    "date": "2025-11-11",
    "total": 16.03,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IO9PT7",
    "invoiceId": "4-IO9PT7",
    "date": "2025-11-11",
    "total": 7.52,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IOC8ND",
    "invoiceId": "4-IOC8ND",
    "date": "2025-11-13",
    "total": 168.58,
    "itemCount": 6,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IOC8GY",
    "invoiceId": "4-IOC8GY",
    "date": "2025-11-13",
    "total": 14.88,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IOCBCE",
    "invoiceId": "4-IOCBCE",
    "date": "2025-11-15",
    "total": 63.81,
    "itemCount": 4,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IRF2ZF",
    "invoiceId": "4-IRF2ZF",
    "date": "2025-11-22",
    "total": 74.48,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IRF217",
    "invoiceId": "4-IRF217",
    "date": "2025-11-20",
    "total": 68.74,
    "itemCount": 4,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IRF2GI",
    "invoiceId": "4-IRF2GI",
    "date": "2025-11-21",
    "total": 23.24,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IRF2OK",
    "invoiceId": "4-IRF2OK",
    "date": "2025-11-21",
    "total": 32.57,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IT1MW7",
    "invoiceId": "4-IT1MW7",
    "date": "2025-11-23",
    "total": 10.31,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IT1NP5",
    "invoiceId": "4-IT1NP5",
    "date": "2025-11-23",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IUKE45",
    "invoiceId": "4-IUKE45",
    "date": "2025-11-24",
    "total": 19.63,
    "itemCount": 4,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IUKE8J",
    "invoiceId": "4-IUKE8J",
    "date": "2025-11-25",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IUKEC6",
    "invoiceId": "4-IUKEC6",
    "date": "2025-11-25",
    "total": 570.57,
    "itemCount": 19,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IUKEKU",
    "invoiceId": "4-IUKEKU",
    "date": "2025-11-26",
    "total": 17.0,
    "itemCount": 4,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IUKES6",
    "invoiceId": "4-IUKES6",
    "date": "2025-11-27",
    "total": 338.24,
    "itemCount": 21,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IUKEVT",
    "invoiceId": "4-IUKEVT",
    "date": "2025-11-28",
    "total": 64.15,
    "itemCount": 4,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IXYKTY",
    "invoiceId": "4-IXYKTY",
    "date": "2025-12-02",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IZCATN",
    "invoiceId": "4-IZCATN",
    "date": "2025-12-02",
    "total": 18.5,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IXYV2Z",
    "invoiceId": "4-IXYV2Z",
    "date": "2025-12-03",
    "total": 14.57,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-IZL3JY",
    "invoiceId": "4-IZL3JY",
    "date": "2025-12-04",
    "total": 34.83,
    "itemCount": 5,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J19OZ8",
    "invoiceId": "4-J19OZ8",
    "date": "2025-12-08",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J19PE4",
    "invoiceId": "4-J19PE4",
    "date": "2025-12-09",
    "total": 32.72,
    "itemCount": 4,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J19PL1",
    "invoiceId": "4-J19PL1",
    "date": "2025-12-09",
    "total": 15.88,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J1DGA2",
    "invoiceId": "4-J1DGA2",
    "date": "2025-12-13",
    "total": 71.53,
    "itemCount": 4,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J1DK17",
    "invoiceId": "4-J1DK17",
    "date": "2025-12-13",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J4MO57",
    "invoiceId": "4-J4MO57",
    "date": "2025-12-16",
    "total": 337.8,
    "itemCount": 16,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J4MO9C",
    "invoiceId": "4-J4MO9C",
    "date": "2025-12-16",
    "total": 189.0,
    "itemCount": 12,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J4MODA",
    "invoiceId": "4-J4MODA",
    "date": "2025-12-16",
    "total": 148.17,
    "itemCount": 18,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J4MOGD",
    "invoiceId": "4-J4MOGD",
    "date": "2025-12-17",
    "total": 9.48,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J4MON2",
    "invoiceId": "4-J4MON2",
    "date": "2025-12-17",
    "total": 25.36,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J4MU7D",
    "invoiceId": "4-J4MU7D",
    "date": "2025-12-18",
    "total": 51.7,
    "itemCount": 4,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J4MUHR",
    "invoiceId": "4-J4MUHR",
    "date": "2025-12-19",
    "total": 59.54,
    "itemCount": 8,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J4MULP",
    "invoiceId": "4-J4MULP",
    "date": "2025-12-19",
    "total": 10.63,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J4MUDE",
    "invoiceId": "4-J4MUDE",
    "date": "2025-12-18",
    "total": 198.48,
    "itemCount": 14,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J8IFVO",
    "invoiceId": "4-J8IFVO",
    "date": "2025-12-23",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J8JZVY",
    "invoiceId": "4-J8JZVY",
    "date": "2025-12-26",
    "total": 18.5,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J9GZ4S",
    "invoiceId": "4-J9GZ4S",
    "date": "2025-12-29",
    "total": 10.79,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-J9GYI4",
    "invoiceId": "4-J9GYI4",
    "date": "2025-12-30",
    "total": 10.31,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JAQISE",
    "invoiceId": "4-JAQISE",
    "date": "2025-12-31",
    "total": 27.97,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JAQIU5",
    "invoiceId": "4-JAQIU5",
    "date": "2026-01-01",
    "total": 184.24,
    "itemCount": 12,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JAQIVN",
    "invoiceId": "4-JAQIVN",
    "date": "2026-01-01",
    "total": 14.87,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JARE9T",
    "invoiceId": "4-JARE9T",
    "date": "2026-01-02",
    "total": 29.95,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JAS1LE",
    "invoiceId": "4-JAS1LE",
    "date": "2026-01-02",
    "total": 73.95,
    "itemCount": 7,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JASK04",
    "invoiceId": "4-JASK04",
    "date": "2026-01-02",
    "total": 112.73,
    "itemCount": 9,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JASK1D",
    "invoiceId": "4-JASK1D",
    "date": "2026-01-03",
    "total": 7.52,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JASK2M",
    "invoiceId": "4-JASK2M",
    "date": "2026-01-03",
    "total": 73.97,
    "itemCount": 4,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JASKY0",
    "invoiceId": "4-JASKY0",
    "date": "2026-01-04",
    "total": 162.79,
    "itemCount": 14,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JASKZ3",
    "invoiceId": "4-JASKZ3",
    "date": "2026-01-04",
    "total": 123.69,
    "itemCount": 9,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JBNA76",
    "invoiceId": "4-JBNA76",
    "date": "2026-01-06",
    "total": 10.63,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JBNA2T",
    "invoiceId": "4-JBNA2T",
    "date": "2026-01-06",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JBI26P",
    "invoiceId": "4-JBI26P",
    "date": "2026-01-06",
    "total": 7.52,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JBODRN",
    "invoiceId": "4-JBODRN",
    "date": "2026-01-07",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JASL5X",
    "invoiceId": "4-JASL5X",
    "date": "2026-01-08",
    "total": 109.34,
    "itemCount": 4,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JBODU8",
    "invoiceId": "4-JBODU8",
    "date": "2026-01-08",
    "total": 8.02,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JBODY2",
    "invoiceId": "4-JBODY2",
    "date": "2026-01-09",
    "total": 12.26,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JBPE9X",
    "invoiceId": "4-JBPE9X",
    "date": "2026-01-10",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JBOE1V",
    "invoiceId": "4-JBOE1V",
    "date": "2026-01-10",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JCX30S",
    "invoiceId": "4-JCX30S",
    "date": "2026-01-12",
    "total": 21.27,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JBNAGK",
    "invoiceId": "4-JBNAGK",
    "date": "2026-01-13",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JD4WAB",
    "invoiceId": "4-JD4WAB",
    "date": "2026-01-14",
    "total": 13.26,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JD5KR7",
    "invoiceId": "4-JD5KR7",
    "date": "2026-01-14",
    "total": 25.36,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JD5KO5",
    "invoiceId": "4-JD5KO5",
    "date": "2026-01-14",
    "total": 26.67,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JD5KVR",
    "invoiceId": "4-JD5KVR",
    "date": "2026-01-15",
    "total": 55.48,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JEIYAE",
    "invoiceId": "4-JEIYAE",
    "date": "2026-01-21",
    "total": 10.14,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JEJ3GC",
    "invoiceId": "4-JEJ3GC",
    "date": "2026-01-22",
    "total": 17.19,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JEL5HD",
    "invoiceId": "4-JEL5HD",
    "date": "2026-01-24",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JEL77O",
    "invoiceId": "4-JEL77O",
    "date": "2026-01-25",
    "total": 5.4,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JGXYMH",
    "invoiceId": "4-JGXYMH",
    "date": "2026-01-26",
    "total": 20.78,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JIZHZL",
    "invoiceId": "4-JIZHZL",
    "date": "2026-01-26",
    "total": 33.06,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JGY2DT",
    "invoiceId": "4-JGY2DT",
    "date": "2026-01-27",
    "total": 5.4,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JGY1FZ",
    "invoiceId": "4-JGY1FZ",
    "date": "2026-01-27",
    "total": 19.81,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JGY0SG",
    "invoiceId": "4-JGY0SG",
    "date": "2026-01-27",
    "total": 8.02,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JGY5TV",
    "invoiceId": "4-JGY5TV",
    "date": "2026-01-28",
    "total": 4.09,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JGY44C",
    "invoiceId": "4-JGY44C",
    "date": "2026-01-28",
    "total": 4.09,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JGY3LE",
    "invoiceId": "4-JGY3LE",
    "date": "2026-01-28",
    "total": 13.26,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JGY7LQ",
    "invoiceId": "4-JGY7LQ",
    "date": "2026-01-29",
    "total": 20.13,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JGY840",
    "invoiceId": "4-JGY840",
    "date": "2026-01-29",
    "total": 5.4,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JI1N27",
    "invoiceId": "4-JI1N27",
    "date": "2026-02-01",
    "total": 10.63,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JI1OQM",
    "invoiceId": "4-JI1OQM",
    "date": "2026-02-03",
    "total": 80.21,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JLKYTT",
    "invoiceId": "4-JLKYTT",
    "date": "2026-02-05",
    "total": 9.32,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JLKZ65",
    "invoiceId": "4-JLKZ65",
    "date": "2026-02-05",
    "total": 8.49,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JNI72T",
    "invoiceId": "4-JNI72T",
    "date": "2026-02-07",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JLL0DN",
    "invoiceId": "4-JLL0DN",
    "date": "2026-02-08",
    "total": 20.39,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JNIT85",
    "invoiceId": "4-JNIT85",
    "date": "2026-02-08",
    "total": 10.63,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JNITLO",
    "invoiceId": "4-JNITLO",
    "date": "2026-02-08",
    "total": 3.1,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JNIUN5",
    "invoiceId": "4-JNIUN5",
    "date": "2026-02-09",
    "total": 13.26,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JNIY5O",
    "invoiceId": "4-JNIY5O",
    "date": "2026-02-10",
    "total": 17.32,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JNIWH9",
    "invoiceId": "4-JNIWH9",
    "date": "2026-02-10",
    "total": 11.12,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JNIZLT",
    "invoiceId": "4-JNIZLT",
    "date": "2026-02-11",
    "total": 3.1,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JPKBJF",
    "invoiceId": "4-JPKBJF",
    "date": "2026-02-13",
    "total": 3.1,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JQ4OCB",
    "invoiceId": "4-JQ4OCB",
    "date": "2026-02-15",
    "total": 6.19,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JQM74V",
    "invoiceId": "4-JQM74V",
    "date": "2026-02-15",
    "total": 3.1,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JQM8VV",
    "invoiceId": "4-JQM8VV",
    "date": "2026-02-17",
    "total": 136.47,
    "itemCount": 9,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JQM92I",
    "invoiceId": "4-JQM92I",
    "date": "2026-02-17",
    "total": 42.54,
    "itemCount": 4,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JQM993",
    "invoiceId": "4-JQM993",
    "date": "2026-02-18",
    "total": 18.81,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JQM9FD",
    "invoiceId": "4-JQM9FD",
    "date": "2026-02-19",
    "total": 58.58,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JQM9KC",
    "invoiceId": "4-JQM9KC",
    "date": "2026-02-19",
    "total": 4.09,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JSR3GD",
    "invoiceId": "4-JSR3GD",
    "date": "2026-02-20",
    "total": 6.71,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JTQGHT",
    "invoiceId": "4-JTQGHT",
    "date": "2026-02-21",
    "total": 9.32,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JWASO4",
    "invoiceId": "4-JWASO4",
    "date": "2026-02-25",
    "total": 5.4,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JWB01R",
    "invoiceId": "4-JWB01R",
    "date": "2026-02-26",
    "total": 6.19,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-JWAG15",
    "invoiceId": "4-JWAG15",
    "date": "2026-02-27",
    "total": 3.1,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K47EQI",
    "invoiceId": "4-K47EQI",
    "date": "2026-02-27",
    "total": 6.19,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K47EXC",
    "invoiceId": "4-K47EXC",
    "date": "2026-02-28",
    "total": 8.49,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K5C3HN",
    "invoiceId": "4-K5C3HN",
    "date": "2026-02-28",
    "total": 12.09,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K5EBQJ",
    "invoiceId": "4-K5EBQJ",
    "date": "2026-03-01",
    "total": 20.12,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K5EBZI",
    "invoiceId": "4-K5EBZI",
    "date": "2026-03-01",
    "total": 9.48,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K5ECBC",
    "invoiceId": "4-K5ECBC",
    "date": "2026-03-02",
    "total": 20.28,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K6BB83",
    "invoiceId": "4-K6BB83",
    "date": "2026-03-05",
    "total": 12.76,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K7L5KC",
    "invoiceId": "4-K7L5KC",
    "date": "2026-03-05",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K6BBIE",
    "invoiceId": "4-K6BBIE",
    "date": "2026-03-06",
    "total": 14.86,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K6BBBZ",
    "invoiceId": "4-K6BBBZ",
    "date": "2026-03-06",
    "total": 13.74,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K6ZKLQ",
    "invoiceId": "4-K6ZKLQ",
    "date": "2026-03-08",
    "total": 16.03,
    "itemCount": 2,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K6ZKTF",
    "invoiceId": "4-K6ZKTF",
    "date": "2026-03-09",
    "total": 49.36,
    "itemCount": 7,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K8IEVV",
    "invoiceId": "4-K8IEVV",
    "date": "2026-03-09",
    "total": 3.1,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K8IF2B",
    "invoiceId": "4-K8IF2B",
    "date": "2026-03-10",
    "total": 3.1,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K8IFCW",
    "invoiceId": "4-K8IFCW",
    "date": "2026-03-10",
    "total": 49.89,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K8IFMQ",
    "invoiceId": "4-K8IFMQ",
    "date": "2026-03-10",
    "total": 27.14,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K8IGQ0",
    "invoiceId": "4-K8IGQ0",
    "date": "2026-03-11",
    "total": 130.51,
    "itemCount": 13,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K8IGZI",
    "invoiceId": "4-K8IGZI",
    "date": "2026-03-11",
    "total": 43.18,
    "itemCount": 6,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K8IHJE",
    "invoiceId": "4-K8IHJE",
    "date": "2026-03-12",
    "total": 5.4,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-KAG7IM",
    "invoiceId": "4-KAG7IM",
    "date": "2026-03-12",
    "total": 62.34,
    "itemCount": 5,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K9SU8N",
    "invoiceId": "4-K9SU8N",
    "date": "2026-03-13",
    "total": 46.42,
    "itemCount": 6,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K9STZ4",
    "invoiceId": "4-K9STZ4",
    "date": "2026-03-13",
    "total": 5.4,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K9SUH6",
    "invoiceId": "4-K9SUH6",
    "date": "2026-03-13",
    "total": 9.3,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K9SXZ1",
    "invoiceId": "4-K9SXZ1",
    "date": "2026-03-15",
    "total": 9.3,
    "itemCount": 3,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K9SY8S",
    "invoiceId": "4-K9SY8S",
    "date": "2026-03-15",
    "total": 3.44,
    "itemCount": 1,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  },
  {
    "_id": "4-K9SYLN",
    "invoiceId": "4-K9SYLN",
    "date": "2026-03-15",
    "total": 20.55,
    "itemCount": 6,
    "source": "mega_savers",
    "createdAt": new Date("2026-04-27T01:37:03.000Z")
  }
];

    // Clear and seed invoices
    await db.collection('invoices').deleteMany({});
    await db.collection('invoices').insertMany(invoices);
    console.log(`✅ Seeded ${invoices.length} invoices.`);

    // Now seed items based on these invoices and raw-data.json
    const fs = require('fs');
    const path = require('path');
    const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, 'lib', 'raw-data.json'), 'utf8'));
    
    const validInvoiceIds = new Set(invoices.map(i => i.invoiceId));
    const items = [];

    rawData.forEach((inv, invIdx) => {
      const invId = inv[0];
      if (!validInvoiceIds.has(invId)) return;

      const invDate = inv[1];
      const invTotal = inv[2];
      const invItems = inv[3];

      invItems.forEach((it, idx) => {
        // Add sample images for the first 10 items to show off the UI
        let imageUrl = "";
        if (idx < 5 && invIdx < 2) {
           const keywords = it[4].toLowerCase().replace(' & ', ',');
           imageUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop`; // Watch/Product placeholder
           if (it[4] === 'Clothing') imageUrl = `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop`;
           if (it[4] === 'Electronics') imageUrl = `https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop`;
           if (it[4] === 'Home & Kitchen') imageUrl = `https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop`;
        }

        items.push({
          uid: `${invId}|${it[0]}`,
          lot: it[0],
          invoiceId: invId,
          date: invDate,
          invoiceTotal: invTotal,
          description: it[1],
          bidPrice: it[2],
          cost: it[3],
          category: it[4],
          status: 'In Stock',
          image: imageUrl,
          createdAt: new Date("2026-04-27T01:37:03.000Z")
        });
      });
    });

    await db.collection('items').deleteMany({});
    await db.collection('items').insertMany(items);
    console.log(`✅ Seeded ${items.length} items.`);

  } catch (err) {
    console.error("Error seeding invoices:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedInvoices();
