import React, { useRef, useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import Header from "../components/Header";

const libraries: "places"[] = ["places"];

const ReportPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [numberOfHomeless, setNumberOfHomeless] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [longitude, setLongitude] = useState<number>(0);
  const [latitude, setLatitude] = useState<number>(0);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    setLocation(place?.formatted_address || "");
    setLongitude(place?.geometry?.location?.lng() || 0);
    setLatitude(place?.geometry?.location?.lat() || 0);
  };
  // const handleSubmit = () => {
  //   console.log({
  //     name,
  //     phoneNumber,
  //     emailAddress,
  //     location,
  //     longitude,
  //     latitude,
  //     numberOfHomeless,
  //   });
  // };

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async () => {
    const response = await fetch(`${BACKEND_URL}/heatmap/save-entry`, {
      method: "POST",
      body: JSON.stringify({
        name,
        phoneNumber,
        emailAddress,
        location,
        longitude,
        latitude,
        numberOfHomeless,
        notes,
      }),
    });
    if (response.ok) {
      console.log("Entry saved successfully");
    } else {
      console.error("Failed to save entry");
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-full z-10 text-black font-inter">
        <Header />
        <div className="flex justify-center items-center mt-10 lg:mt-20">
          <div className="flex flex-col justify-center items-center bg-white px-10 lg:px-30 py-15 rounded-3xl ">
            <div className="flex flex-col  gap-y-4 lg:gap-y-10 text-[#25228b] text-sm">
              <div>
                <div>
                  Name <span className="text-xs italic">(optional)</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* <div>
                <div>Phone</div>
                <input
                  type="number"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div> */}
              <div>
                <div>
                  Email <span className="text-xs italic">(required)</span>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>
              <div>
                <div className="font-bold w-[95%]">
                  Where was the homeless person(s) seen?{" "}
                  <span className="text-xs italic font-normal">(required)</span>
                </div>
                <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                  libraries={libraries}
                >
                  <Autocomplete
                    onLoad={(ref) => (autocompleteRef.current = ref)}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <input
                      type="text"
                      required
                      placeholder="Enter an address"
                    />
                  </Autocomplete>
                </LoadScript>
              </div>
              <div>
                <div className="font-bold w-[85%]">
                  Number of homeless person(s) seen{" "}
                  <span className="text-xs italic font-normal">(optional)</span>
                </div>
                <input
                  type="number"
                  placeholder="Enter a number"
                  required
                  value={numberOfHomeless}
                  onChange={(e) => setNumberOfHomeless(Number(e.target.value))}
                />
              </div>
              <div>
                <div>
                  Notes <span className="text-xs italic">(optional)</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter a number"
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <div
              className="mt-10 flex justify-center items-center w-full bg-[#25228B] text-white text-xl font-bold font-playfair px-12 py-2 rounded-md cursor-pointer"
              onClick={handleSubmit}
            >
              Submit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
