import "./TheatreSelection.css";
import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import DateSelector from "../../components/DateSelector/DateSelector";
import showService from "../../services/showService";

function TheatreSelection({ location, changeLocation }) {
    const { id } = useParams();
    const { state } = useLocation();
    const movie = state?.movie;
    const selectedLanguage = state?.language;

    const getDateKey = date => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");

    const dates = useMemo(() => {
        if (!movie?.availableFrom || !movie?.availableUntil) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const availableFrom = new Date(movie.availableFrom);
        const availableUntil = new Date(movie.availableUntil);

        availableFrom.setHours(0, 0, 0, 0);
        availableUntil.setHours(0, 0, 0, 0);

        const start = today > availableFrom ? today : availableFrom;

        if (start > availableUntil) return [];

        const result = [];

        while (start <= availableUntil) {
            result.push({
                value: getDateKey(start),
                day: start.toLocaleDateString("en-US", { weekday: "short" }),
                date: start.getDate(),
                month: start.toLocaleDateString("en-US", { month: "short" }),
                year: start.getFullYear()
            });

            start.setDate(start.getDate() + 1);
        }

        return result;
    }, [movie]);

    useEffect(() => {
        if (dates.length > 0 && !dates.some(date => date.value === selectedDate)) {
            setSelectedDate(dates[0].value);
        }
    }, [dates, selectedDate]);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const response = await showService.getShowsByMovie(id);
                setShows(response.shows || response || []);
            } catch (error) {
                console.error(error);
                setShows([]);
            } finally {
                setLoading(false);
            }
        };

        fetchShows();
    }, [id]);

    if (!movie) {
        return <h2>Movie Not Found</h2>;
    }

    if (loading) {
        return <h2>Loading Theatres...</h2>;
    }

    const filteredShows = shows.filter(show => {
        const showDate = getDateKey(show.date);
        const availableFrom = getDateKey(movie.availableFrom);
        const availableUntil = getDateKey(movie.availableUntil);

        return (
            showDate === selectedDate &&
            showDate >= availableFrom &&
            showDate <= availableUntil &&
            (!selectedLanguage || show.language === selectedLanguage)
        );
    });

    const groupedShows = {};

    filteredShows.forEach(show => {
        const theatreId = show.theatre?._id || show.theatre;

        if (!theatreId) return;

        if (!groupedShows[theatreId]) {
            groupedShows[theatreId] = {
                theatre: show.theatre,
                shows: []
            };
        }

        groupedShows[theatreId].shows.push(show);
    });

    const selectedDay = selectedDate
        ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
              "en-US",
              { weekday: "short" }
          )
        : "";

    return (
        <>
            <Navbar location={location} changeLocation={changeLocation} />

            <div className="theatre-selection">
                <div className="movie-header">
                    <h1>{movie.title}</h1>
                    <p>
                        Genre:{" "}
                        {Array.isArray(movie.genre)
                            ? movie.genre.join(" • ")
                            : movie.genre || "N/A"}
                    </p>
                </div>

                {dates.length > 0 ? (
                    <DateSelector
                        dates={dates}
                        selectedDate={selectedDate}
                        onDateChange={({ date }) => setSelectedDate(date)}
                    />
                ) : (
                    <h2>No booking dates available.</h2>
                )}

                {Object.keys(groupedShows).length > 0 ? (
                    Object.values(groupedShows).map(({ theatre, shows }) => (
                        <div className="theatre-card" key={theatre?._id}>
                            <h2>{theatre?.name}</h2>
                            <p>{theatre?.address}</p>
                            <p>⭐ {theatre?.rating || 0}</p>

                            <div className="show-details">
                                {[
                                    ...new Map(
                                        shows.map(show => [
                                            `${show.language}-${show.format}`,
                                            `${show.language} • ${show.format}`
                                        ])
                                    ).values()
                                ].map((details, index) => (
                                    <span key={index}>{details}</span>
                                ))}
                            </div>

                            <div className="show-times">
                                {[...shows]
                                    .sort((a, b) =>
                                        a.showTime.localeCompare(b.showTime)
                                    )
                                    .map(show => (
                                        <Link
                                            key={show._id}
                                            to={`/booking/${show._id}`}
                                            state={{
                                                movie,
                                                theatre,
                                                show,
                                                language: show.language,
                                                location,
                                                selectedDate,
                                                day: selectedDay
                                            }}
                                            className="show-btn"
                                        >
                                            {show.showTime}
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    ))
                ) : dates.length > 0 ? (
                    <h2>No shows available for the selected date.</h2>
                ) : null}
            </div>
        </>
    );
}

export default TheatreSelection;