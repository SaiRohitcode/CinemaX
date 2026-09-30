import React, { useEffect, useState } from "react";
import "./TheatrePage.css";

import Navbar from "../../components/Navbar/Navbar";
import theatreService from "../../services/theatreService";

function TheatrePage({ location, changeLocation }) {

    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchTheatres = async () => {

            try {

                const response = await theatreService.getTheatres();

                setTheatres(response.theatres || response);

            } catch (error) {

                console.error("Error fetching theatres:", error);

            } finally {

                setLoading(false);

            }

        };

        fetchTheatres();

    }, []);

    const cityTheatres = theatres.filter(

        (theatre) =>

            theatre.state === location?.state &&
            theatre.city === location?.city

    );

    if (loading) {

        return <h2 style={{ textAlign: "center" }}>Loading Theatres...</h2>;

    }

    return (

        <>

            <Navbar
                location={location}
                changeLocation={changeLocation}
            />

            <div className="theatre-page">

                <h1 className="theatre-page-title">

                    Theatres in {location?.city}

                </h1>

                {cityTheatres.length === 0 ? (

                    <h2 className="no-theatre">

                        No theatres available.

                    </h2>

                ) : (

                    <div className="theatre-grid">

                        {cityTheatres.map((theatre) => (

                            <div
                                className="theatre-card"
                                key={theatre._id}
                            >

                                <h2>{theatre.name}</h2>

                                <p>{theatre.address}</p>

                                <p>

                                    ⭐ {theatre.rating}

                                </p>

                                <p>

                                    {theatre.facilities?.join(", ")}

                                </p>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </>

    );

}

export default TheatrePage;