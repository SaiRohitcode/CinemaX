import "./LocationModal.css";
import { useState } from "react";
import locations from "../../data/locations";

function LocationModal({location,onSave,onClose}) {

const [selectedState,setSelectedState]=useState(location?.state || "");
const [selectedCity,setSelectedCity]=useState(location?.city || "");

    const currentState = locations.find(
        (location) => location.state === selectedState
    );
    return (
        <div className="location-overlay">
            <div className="location-modal">
                {location && (<button className="close-btn" onClick={onClose}>✕</button>)}
                <h2>{location ? "Change Location" : "Choose Your Location"}</h2>
                <select
                    value={selectedState}
                    onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedCity("");
                    }}
                >
                    <option value="">Select State</option>
                    {
                        locations.map((location) => (
                            <option
                                key={location.state}
                                value={location.state}
                            >
                                {location.state}
                            </option>
                        ))
                    }
                </select>
                <select
                    value={selectedCity}
                    onChange={(e) =>
                        setSelectedCity(e.target.value)
                    }
                    disabled={!selectedState}
                >
                    <option value="">Select City</option>
                    {
                        currentState?.cities.map((city) => (
                            <option
                                key={city}
                                value={city}
                            >{city}</option>
                        ))
                    }
                </select>
                <button
                className="continue-btn"
                    disabled={!selectedCity}
                    onClick={() => {
                        localStorage.setItem(
                            "location",
                            JSON.stringify({
                                state: selectedState,
                                city: selectedCity
                            })
                        );
                        onSave({
                            state: selectedState,
                            city: selectedCity
                        });
                    }}
                >Continue</button>
            </div>
        </div>
    );
}

export default LocationModal;