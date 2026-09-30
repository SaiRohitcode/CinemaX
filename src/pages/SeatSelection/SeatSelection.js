import "./SeatSelection.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function SeatSelection() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const movie = state?.movie;
    const theatre = state?.theatre;
    const language = state?.language;
    const show = state?.show;
    const location = state?.location;
    const selectedDate = state?.selectedDate;
    const day = state?.day;
    const showTime = show?.showTime;

    const [seatSections, setSeatSections] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/shows/${show._id}/seats`
                );

                const seats = response.data.screen.seats || [];
                const booked = response.data.bookedSeats || [];

                setBookedSeats(booked);

                const groupedSections = {};

                seats.forEach((seat, index) => {
                    const sectionName = seat.section || "General";
                    const rowName =
                        seat.row || String.fromCharCode(65 + index);

                    if (!groupedSections[sectionName]) {
                        groupedSections[sectionName] = {
                            section: sectionName,
                            price: seat.price,
                            rows: {}
                        };
                    }

                    if (!groupedSections[sectionName].rows[rowName]) {
                        groupedSections[sectionName].rows[rowName] = [];
                    }

                    groupedSections[sectionName].rows[rowName].push({
                        ...seat,
                        seatId:
                            seat.seatId ||
                            `${sectionName}-${rowName}-${seat.number}`,
                        row: rowName,
                        rowPosition:
                            Number(seat.rowPosition) || 1,
                        columnPosition:
                            Number(seat.columnPosition) ||
                            Number(seat.number) ||
                            index + 1
                    });
                });

                Object.values(groupedSections).forEach(section => {
                    Object.keys(section.rows).forEach(row => {
                        section.rows[row].sort(
                            (a, b) =>
                                a.columnPosition - b.columnPosition
                        );
                    });
                });

                setSeatSections(Object.values(groupedSections));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        if (show?._id) {
            fetchSeats();
        }
    }, [show]);

    const handleSeatClick = seatId => {
        if (bookedSeats.includes(seatId)) {
            return;
        }

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(
                selectedSeats.filter(seat => seat !== seatId)
            );
        } else {
            setSelectedSeats([
                ...selectedSeats,
                seatId
            ]);
        }
    };

    const totalPrice = selectedSeats.reduce(
        (total, seatId) => {
            for (const section of seatSections) {
                for (const row of Object.values(section.rows)) {
                    const seat = row.find(
                        s => s.seatId === seatId
                    );

                    if (seat) {
                        return total + seat.price;
                    }
                }
            }

            return total;
        },
        0
    );

    const proceedToPayment = () => {
        const selectedSeatDetails = selectedSeats
            .map(seatId => {
                for (const section of seatSections) {
                    for (const row of Object.values(section.rows)) {
                        const seat = row.find(
                            s => s.seatId === seatId
                        );

                        if (seat) {
                            return seat;
                        }
                    }
                }

                return null;
            })
            .filter(Boolean);

        navigate("/payment", {
            state: {
                movie,
                theatre,
                show,
                language,
                location,
                showTime,
                selectedDate,
                selectedSeats,
                selectedSeatDetails,
                totalPrice,
                day,
                screen: show?.screen
            }
        });
    };

    if (loading) {
        return (
            <h2
                style={{
                    color: "white",
                    textAlign: "center",
                    marginTop: "120px"
                }}
            >
                Loading Seats...
            </h2>
        );
    }

    return (
        <>
            <div className="booking-details">
                <h2>{movie?.title}</h2>

                <p>
                    {theatre?.name} • {location?.city}
                </p>

                <p>{selectedDate}</p>

                <p>
                    {selectedDate} • {show?.language} •{" "}
                    {show?.format}
                </p>

                <p>
                    Show Time : {showTime}
                </p>
            </div>

            <div className="seat-selection-container">
                <div className="theatre-screen">
                    SCREEN THIS WAY
                </div>

                {seatSections.map(section => (
                    <div
                        key={section.section}
                        className="seat-section"
                    >
                        <h2 className="seat-section-title">
                            {section.section} ₹{section.price}
                        </h2>

                        {Object.entries(section.rows)
                            .sort(([, rowA], [, rowB]) => {
                                const positionA = Math.min(
                                    ...rowA.map(
                                        seat => seat.rowPosition
                                    )
                                );

                                const positionB = Math.min(
                                    ...rowB.map(
                                        seat => seat.rowPosition
                                    )
                                );

                                return positionA - positionB;
                            })
                            .map(([rowName, rowSeats]) => {
                                const maxColumn = Math.max(
                                    ...rowSeats.map(
                                        seat => seat.columnPosition
                                    )
                                );

                                const seatByColumn = {};

                                rowSeats.forEach(seat => {
                                    seatByColumn[
                                        seat.columnPosition
                                    ] = seat;
                                });

                                return (
                                    <div
                                        key={rowName}
                                        className="seat-layout-row"
                                    >
                                        <span className="seat-row-label">
                                            {rowName}
                                        </span>

                                        <div className="seat-row-grid">
                                            {Array.from(
                                                {
                                                    length: maxColumn
                                                },
                                                (_, index) => {
                                                    const seat =
                                                        seatByColumn[
                                                            index + 1
                                                        ];

                                                    if (!seat) {
                                                        return (
                                                            <div
                                                                key={`${rowName}-aisle-${index + 1}`}
                                                                className="seat-aisle-space"
                                                            />
                                                        );
                                                    }

                                                    if (
                                                        seat.positionType ===
                                                        "EMPTY"
                                                    ) {
                                                        return (
                                                            <div
                                                                key={
                                                                    seat.seatId
                                                                }
                                                                className="seat-empty-space"
                                                            />
                                                        );
                                                    }

                                                    const isBooked =
                                                        bookedSeats.includes(
                                                            seat.seatId
                                                        );

                                                    const isBlocked =
                                                        seat.isBlocked;

                                                    const isSelected =
                                                        selectedSeats.includes(
                                                            seat.seatId
                                                        );

                                                    return (
                                                        <div
                                                            key={
                                                                seat.seatId
                                                            }
                                                            onClick={() => {
                                                                if (
                                                                    !isBooked &&
                                                                    !isBlocked
                                                                ) {
                                                                    handleSeatClick(
                                                                        seat.seatId
                                                                    );
                                                                }
                                                            }}
                                                            className={`seat-box ${
                                                                isBooked ||
                                                                isBlocked
                                                                    ? "seat-booked"
                                                                    : ""
                                                            } ${
                                                                isSelected
                                                                    ? "seat-selected"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {seat.row}
                                                            {seat.number}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ))}

                <div className="seat-legend">
                    <div className="seat-legend-item">
                        <div className="seat-legend-box seat-available-color"></div>
                        <span>Available</span>
                    </div>

                    <div className="seat-legend-item">
                        <div className="seat-legend-box seat-selected-color"></div>
                        <span>Selected</span>
                    </div>

                    <div className="seat-legend-item">
                        <div className="seat-legend-box seat-booked-color"></div>
                        <span>Booked</span>
                    </div>
                </div>

                {selectedSeats.length > 0 && (
                    <div className="selected-seat-info">
                        <h4>Selected Seats</h4>
                        <p>{selectedSeats.join(", ")}</p>
                    </div>
                )}

                {selectedSeats.length > 0 && (
                    <button
                        className="seat-proceed-btn"
                        onClick={proceedToPayment}
                    >
                        Proceed to Pay ₹{totalPrice}
                    </button>
                )}
            </div>
        </>
    );
}

export default SeatSelection;