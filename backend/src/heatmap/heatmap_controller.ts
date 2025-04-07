import { Request, RequestHandler, Response } from "express";
import { createObjectCsvWriter } from "csv-writer";
import csv from "csv-parser";
import fs from "fs";

const filePath = `${__dirname}/../../src/heatmap/homeless_reports.csv`;

export const saveCSVEntry: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const csvWriter = createObjectCsvWriter({
    // path: "./homeless_reports.csv",
    path: filePath,
    append: true,
    header: [
      { id: "date", title: "Date" },
      { id: "year", title: "Year" },
      { id: "reporter", title: "Reporter" },
      { id: "email", title: "Email" },
      { id: "location", title: "Location" },
      { id: "longitude", title: "Longitude" },
      { id: "latitude", title: "Latitude" },
      { id: "count", title: "Count" },
      { id: "notes", title: "Notes" },
    ],
  });

  const {
    email,
    location,
    longitude,
    latitude,
    count,
    reporter, // or name?
    notes,
  } = req.body;

  const ENTRY = {
    date: new Date().toISOString(),
    year: new Date().getFullYear(),
    reporter: reporter || "", // make sure it's set
    email: email || "",
    location: location || "",
    longitude: longitude || "",
    latitude: latitude || "",
    count: count || 0,
    notes: notes || "",
  };

  console.log(ENTRY);
  try {
    await csvWriter.writeRecords([ENTRY]);
    console.log("Saved to CSV");
    res.status(200).send("Saved to CSV");
  } catch (err) {
    console.error("CSV write failed:", err);
    res.status(500).send("Error writing CSV");
  }
};

export const getCSVEntries: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const results: any[] = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.status(200).json(results);
    })
    .on("error", (err) => {
      console.error("❌ Failed to read CSV:", err);
      res.status(500).send("Error reading CSV");
    });
};
