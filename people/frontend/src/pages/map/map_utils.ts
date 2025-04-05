// mapUtils.ts - Helper functions for map operations

/**
 * Creates a marker element with custom styling
 */
export const createMarkerElement = (
  title: string,
  color: string = "#4285F4",
  size: number = 36
): HTMLElement => {
  const element = document.createElement("div");
  element.innerHTML = `
      <div style="position: relative; cursor: pointer;">
        <div style="
          width: ${size}px; 
          height: ${size}px; 
          background-color: ${color}; 
          border: 3px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 6px rgba(0,0,0,.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${size / 2}px;
        ">
          ${title.charAt(0).toUpperCase()}
        </div>
        <div style="
          position: absolute; 
          top: ${size + 6}px; 
          left: 50%; 
          transform: translateX(-50%); 
          background-color: white; 
          padding: 2px 8px; 
          border-radius: 10px; 
          font-weight: bold; 
          box-shadow: 0 2px 6px rgba(0,0,0,.3); 
          white-space: nowrap;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
        ">
          ${title}
        </div>
      </div>
    `;
  return element;
};

/**
 * Creates HTML content for an info window
 */
export const createInfoWindowContent = (
  place: any,
  distanceInfo: { miles: string; kilometers: string } | null,
  urls: { earthUrl: string; satelliteUrl: string; mapsUrl: string }
): string => {
  return `
      <div style="max-width: 300px; padding: 10px;">
        <h3 style="margin-top: 0; color: #1a73e8;">${place.displayName}</h3>
        <p><strong>Type:</strong> ${
          place.primaryTypeDisplayName || place.primaryType || "Not specified"
        }</p>
        <p><strong>Status:</strong> ${place.businessStatus || "Unknown"}</p>
        ${
          place.formattedAddress
            ? `<p><strong>Address:</strong> ${place.formattedAddress}</p>`
            : ""
        }
        ${
          place.rating
            ? `<p><strong>Rating:</strong> ${place.rating}/5 ${
                place.userRatingCount
                  ? `(${place.userRatingCount} reviews)`
                  : ""
              }</p>`
            : ""
        }
        ${
          distanceInfo
            ? `<p><strong>Distance from you:</strong> ${distanceInfo.miles} mi (${distanceInfo.kilometers} km)</p>`
            : ""
        }
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px;">
          <a href="${
            urls.earthUrl
          }" target="_blank" style="display: block; background-color: #4285F4; color: white; text-decoration: none; padding: 8px 12px; border-radius: 4px; text-align: center;">
            Open in Google Earth
          </a>
          <a href="${
            urls.satelliteUrl
          }" target="_blank" style="display: block; background-color: #34A853; color: white; text-decoration: none; padding: 8px 12px; border-radius: 4px; text-align: center;">
            Open Detailed Satellite View
          </a>
          <a href="${
            urls.mapsUrl
          }" target="_blank" style="display: block; background-color: #EA4335; color: white; text-decoration: none; padding: 8px 12px; border-radius: 4px; text-align: center;">
            Open in Google Maps
          </a>
          <button onclick="switchToRoadView()" style="background-color: #FBBC05; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-top: 4px;">
            Switch Back to Road View
          </button>
          <button onclick="showDirectionsToPlace(${place.location.lat()}, ${place.location.lng()})" style="background-color: #1A73E8; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-top: 4px;">
            Show Directions to Here
          </button>
        </div>
      </div>
    `;
};
