import { Request, RequestHandler, Response } from "express";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

const csvWriter = createObjectCsvWriter({
  path: "./homeless_reports.csv",
  append: true,
  header: [
    { id: "date", title: "DATE" },
    { id: "year", title: "YEAR" },
    { id: "reporter", title: "REPORTER" },
    { id: "location", title: "LOCATION" },
    { id: "longitude", title: "LONGITUDE" },
    { id: "latitude", title: "LATITUDE" },
    { id: "count", title: "COUNT" },
  ],
});

const saveCSVEntry: RequestHandler = async (req: Request, res: Response) => {
  console.log("operation started");
  try {
    await csvWriter.writeRecords([req.body]);
    res.status(200).send("Saved to CSV");
  } catch (err) {
    console.error("CSV write failed:", err);
    res.status(500).send("Error writing CSV");
  }
};

export { saveCSVEntry };
