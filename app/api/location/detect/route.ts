import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing latitude or longitude" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results && data.results.length > 0) {
        return NextResponse.json({
          address: data.results[0].formatted_address,
          source: "google-maps",
        });
      }
    } catch (error) {
      console.error("Google Maps Geocoding error:", error);
    }
  }

  // Fallback: OpenStreetMap Nominatim reverse geocoding
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "User-Agent": "RoopeBeautyApp/1.0 (officialroope@gmail.com)",
        },
      }
    );
    const data = await response.json();
    if (data && data.display_name) {
      // Clean up Nominatim's verbose address output
      const addressParts = data.display_name.split(",");
      const cleanAddress = addressParts.slice(0, 4).join(",").trim();
      return NextResponse.json({
        address: cleanAddress,
        source: "openstreetmap",
      });
    }
  } catch (error) {
    console.error("Nominatim fallback error:", error);
  }

  // Final fallback (mock Indore location for demo)
  return NextResponse.json({
    address: "Vijay Nagar, Indore, Madhya Pradesh, India",
    source: "fallback",
  });
}
