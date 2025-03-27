// mapRoutes.ts - Express routes for the map API

import express, { Request, Response } from "express";
import mapService from "./map_backend";

/**
 * GET /api/places/search
 * Search for places based on query and location
 */
export const searchPlaces = async (req: Request, res: Response) => {
  try {
    const { query, lat, lng, radius, openNow } = req.query;

    // Validate required parameters
    if (!query || !lat || !lng) {
      return res.status(400).json({
        error:
          "Missing required parameters. Please provide query, lat, and lng.",
      });
    }

    // Parse parameters
    const searchParams = {
      query: query as string,
      lat: parseFloat(lat as string),
      lng: parseFloat(lng as string),
      radius: radius ? parseFloat(radius as string) : undefined,
      openNow: openNow === "true",
    };

    // Perform search
    const places = await mapService.searchPlaces(searchParams);

    // Return results
    res.json({ places });
  } catch (error) {
    console.error("Error in search endpoint:", error);
    res.status(500).json({
      error: "An error occurred while searching for places.",
    });
  }
};

/**
 * GET /api/directions
 * Get directions between two points
 */
export const directions = async (req: Request, res: Response) => {
  try {
    const { originLat, originLng, destLat, destLng, mode } = req.query;

    // Validate required parameters
    if (!originLat || !originLng || !destLat || !destLng) {
      return res.status(400).json({
        error:
          "Missing required parameters. Please provide originLat, originLng, destLat, and destLng.",
      });
    }

    // Get directions
    const directions = await mapService.getDirections(
      parseFloat(originLat as string),
      parseFloat(originLng as string),
      parseFloat(destLat as string),
      parseFloat(destLng as string),
      mode as string
    );

    // Return results
    res.json(directions);
  } catch (error) {
    console.error("Error in directions endpoint:", error);
    res.status(500).json({
      error: "An error occurred while fetching directions.",
    });
  }
};
