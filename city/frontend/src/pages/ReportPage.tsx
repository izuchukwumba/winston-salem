import React, { useRef, useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const backgroundStyle = {
  backgroundImage: "url('assets/city-of-ws-2.jpeg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  width: "100%",
};

const libraries: "places"[] = ["places"];

const ReportPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    setLocation(place?.formatted_address || "");
  };
  const handleSubmit = () => {
    console.log({
      name,
      phoneNumber,
      emailAddress,
      location,
    });
  };

  return (
    <div style={backgroundStyle} className="h-screen w-full">
      <div className="fixed top-0 left-0 w-full h-full bg-white opacity-80"></div>

      <div className="relative w-full h-full z-10 text-black font-inter">
        <div className="bg-[#25228B] flex justify-center items-center py-4 mb-5 lg:mb-20">
          <div className="text-white text-2xl lg:text-4xl font-bold font-playfair">
            City of Winston-Salem
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center items-center bg-white px-10 lg:px-30 py-15 rounded-3xl ">
            <div className="flex flex-col  gap-y-4 lg:gap-y-10 text-[#25228b] text-sm">
              <div>
                <div>Name</div>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <div>Phone</div>
                <input
                  type="number"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <div>Email</div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>
              <div>
                <div>Location you saw the homeless person(s)</div>
                <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                  libraries={libraries}
                >
                  <Autocomplete
                    onLoad={(ref) => (autocompleteRef.current = ref)}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <input type="text" required />
                  </Autocomplete>
                </LoadScript>
              </div>
              <div>
                <div>Number of homeless person(s) seen</div>
                <input type="number" placeholder="Enter a number" required />
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
