import { useEffect, useMemo, useState } from "react";
import screenService from "../services/screenService";
import "../css/ScreenLayoutDesigner.css";

function ScreenLayoutDesigner({ screenId, onClose }) {
    const [screen, setScreen] = useState(null);
    const [selectedSeatId, setSelectedSeatId] = useState(null);
    const [aisleWidth, setAisleWidth] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const getRowLabel = rowPosition => {
        if (rowPosition <= 26) return String.fromCharCode(64 + rowPosition);
        return `A${rowPosition - 26}`;
    };

    useEffect(() => {
        const loadScreen = async () => {
            try {
                const data = await screenService.getScreen(screenId);
                const loaded = data.screen || data;

                const sectionRows = {};

                const seats = (loaded.seats || []).map((seat, index) => {
                    const sectionName = seat.section || "General";
                    const originalRow = seat.row || "A";

                    if (!sectionRows[sectionName]) {
                        sectionRows[sectionName] = {};
                    }

                    if (!sectionRows[sectionName][originalRow]) {
                        sectionRows[sectionName][originalRow] =
                            Object.keys(sectionRows[sectionName]).length + 1;
                    }

                    const rowPosition =
                        sectionRows[sectionName][originalRow];

                    const number = Number(seat.number) || 1;
                    const row = getRowLabel(rowPosition);

                    return {
                        ...seat,
                        row,
                        rowPosition,
                        number,
                        seatId: `${sectionName}-${row}-${number}`,
                        columnPosition: Number(seat.columnPosition) || number,
                        positionType: seat.positionType || "SEAT",
                        isBlocked: Boolean(seat.isBlocked)
                    };
                });

                setScreen({ ...loaded, seats, totalSeats: seats.length });
            } catch (err) {
                alert(
                    err.response?.data?.message ||
                    "Unable to load screen layout."
                );
            } finally {
                setLoading(false);
            }
        };

        loadScreen();
    }, [screenId]);

    const rows = useMemo(() => {
        if (!screen) return {};

        return screen.seats.reduce((result, seat) => {
            if (!result[seat.row]) result[seat.row] = [];
            result[seat.row].push(seat);
            result[seat.row].sort(
                (a, b) => a.columnPosition - b.columnPosition
            );
            return result;
        }, {});
    }, [screen]);

    const selectedSeat = screen?.seats.find(
        seat => seat.seatId === selectedSeatId
    );

    const updateSeats = seats => {
        setScreen({ ...screen, seats, totalSeats: seats.length });
    };

    const getAisleWidth = () => {
        if (!selectedSeat) return 0;

        const nextSeat = screen.seats
            .filter(
                seat =>
                    seat.rowPosition === selectedSeat.rowPosition &&
                    seat.columnPosition > selectedSeat.columnPosition
            )
            .sort((a, b) => a.columnPosition - b.columnPosition)[0];

        return nextSeat
            ? nextSeat.columnPosition - selectedSeat.columnPosition - 1
            : 0;
    };

    const setAisle = () => {
        if (!selectedSeat) return;

        const difference = Number(aisleWidth) - getAisleWidth();
        if (!difference) return;

        updateSeats(
            screen.seats.map(seat =>
                seat.rowPosition === selectedSeat.rowPosition &&
                seat.columnPosition > selectedSeat.columnPosition
                    ? {
                          ...seat,
                          columnPosition:
                              seat.columnPosition + difference
                      }
                    : seat
            )
        );
    };

    const removeAisle = () => {
        if (!selectedSeat) return;

        const width = getAisleWidth();
        if (!width) return;

        updateSeats(
            screen.seats.map(seat =>
                seat.rowPosition === selectedSeat.rowPosition &&
                seat.columnPosition > selectedSeat.columnPosition
                    ? {
                          ...seat,
                          columnPosition:
                              seat.columnPosition - width
                      }
                    : seat
            )
        );
    };

    const removeSeat = () => {
        if (!selectedSeat) return;

        updateSeats(
            screen.seats.map(seat =>
                seat.seatId === selectedSeat.seatId
                    ? { ...seat, positionType: "EMPTY" }
                    : seat
            )
        );
    };

    const restoreSeat = () => {
        if (!selectedSeat) return;

        updateSeats(
            screen.seats.map(seat =>
                seat.seatId === selectedSeat.seatId
                    ? { ...seat, positionType: "SEAT" }
                    : seat
            )
        );
    };

    const saveLayout = async () => {
        try {
            setSaving(true);

            await screenService.updateScreen(screenId, {
                theatre: screen.theatre?._id || screen.theatre,
                name: screen.name,
                screenType: screen.screenType,
                sections: screen.sections,
                totalSeats: screen.seats.filter(
                    seat => seat.positionType !== "EMPTY"
                ).length,
                seats: screen.seats.map(seat => ({
                    seatId: `${seat.section}-${seat.row}-${seat.number}`,
                    row: getRowLabel(seat.rowPosition),
                    section: seat.section,
                    number: seat.number,
                    price: seat.price,
                    rowPosition: seat.rowPosition,
                    columnPosition: seat.columnPosition,
                    positionType: seat.positionType || "SEAT",
                    isBlocked: seat.isBlocked
                })),
                isActive: screen.isActive
            });

            alert("Screen layout saved successfully.");
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to save screen layout."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="layout-loading">
                Loading screen layout...
            </div>
        );
    }

    if (!screen) {
        return (
            <div className="layout-loading">
                Screen not found.
            </div>
        );
    }

    return (
        <div className="layout-designer">
            <div className="layout-header">
                <div>
                    <h1>{screen.name} - Layout Designer</h1>
                    <p>
                        {screen.screenType} • {screen.seats.length} seats
                    </p>
                </div>

                <div className="layout-actions">
                    <button
                        className="layout-back"
                        onClick={onClose}
                    >
                        Back
                    </button>

                    <button
                        className="layout-save"
                        onClick={saveLayout}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Layout"}
                    </button>
                </div>
            </div>

            <div className="layout-body">
                <div className="layout-sidebar">
                    <h3>Seat Editor</h3>

                    {selectedSeat ? (
                        <>
                            <div className="seat-details">
                                <p>
                                    <span>Seat</span>
                                    <strong>
                                        {getRowLabel(
                                            selectedSeat.rowPosition
                                        )}
                                        -
                                        {selectedSeat.number}
                                    </strong>
                                </p>

                                <p>
                                    <span>Row</span>
                                    <strong>
                                        {getRowLabel(
                                            selectedSeat.rowPosition
                                        )}
                                    </strong>
                                </p>

                                <p>
                                    <span>Section</span>
                                    <strong>
                                        {selectedSeat.section}
                                    </strong>
                                </p>

                                <p>
                                    <span>Price</span>
                                    <strong>
                                        ₹{selectedSeat.price}
                                    </strong>
                                </p>
                            </div>

                            <label className="aisle-label">
                                Aisle Width
                            </label>

                            <div className="aisle-options">
                                {[1, 2, 3].map(width => (
                                    <button
                                        key={width}
                                        className={
                                            aisleWidth === width
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setAisleWidth(width)
                                        }
                                    >
                                        {width}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="editor-button aisle-button"
                                onClick={setAisle}
                            >
                                Set Aisle
                            </button>

                            <button
                                className="editor-button remove-aisle-button"
                                onClick={removeAisle}
                            >
                                Remove Aisle
                            </button>

                            {selectedSeat.positionType === "EMPTY" ? (
                                <button
                                    className="editor-button restore-button"
                                    onClick={restoreSeat}
                                >
                                    Restore Seat
                                </button>
                            ) : (
                                <button
                                    className="editor-button delete-seat-button"
                                    onClick={removeSeat}
                                >
                                    Remove Seat
                                </button>
                            )}
                        </>
                    ) : (
                        <p className="layout-help">
                            Select a seat to edit.
                        </p>
                    )}

                    <div className="layout-info">
                        <p>
                            <span>Rows</span>
                            <strong>{Object.keys(rows).length}</strong>
                        </p>

                        <p>
                            <span>Total Seats</span>
                            <strong>{screen.seats.length}</strong>
                        </p>
                    </div>
                </div>

                <div className="layout-preview">
                    <div className="screen-bar">SCREEN</div>

                    <div className="seat-grid">
                        {Object.entries(rows).map(
                            ([rowName, rowSeats]) => {
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
                                        className="layout-row"
                                        key={rowName}
                                    >
                                        <span className="row-name">
                                            {rowName}
                                        </span>

                                        <div className="row-seats">
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
                                                                className="aisle-space"
                                                                key={`${rowName}-${index}`}
                                                            />
                                                        );
                                                    }

                                                    if (
                                                        seat.positionType ===
                                                        "EMPTY"
                                                    ) {
                                                        return (
                                                            <div
                                                                className="empty-seat-space"
                                                                key={
                                                                    seat.seatId
                                                                }
                                                                onClick={() =>
                                                                    setSelectedSeatId(
                                                                        seat.seatId
                                                                    )
                                                                }
                                                            />
                                                        );
                                                    }

                                                    const label =
                                                        `${seat.row}${seat.number}`;

                                                    return (
                                                        <button
                                                            className={`layout-seat ${
                                                                selectedSeatId ===
                                                                seat.seatId
                                                                    ? "selected"
                                                                    : ""
                                                            }`}
                                                            key={
                                                                seat.seatId
                                                            }
                                                            onClick={() =>
                                                                setSelectedSeatId(
                                                                    seat.seatId
                                                                )
                                                            }
                                                            title={label}
                                                        >
                                                            {label}
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>

                    <div className="layout-legend">
                        <span>
                            <i className="legend-seat"></i>
                            Seat
                        </span>

                        <span>
                            <i className="legend-selected"></i>
                            Selected
                        </span>

                        <span>
                            <i className="legend-aisle"></i>
                            Aisle
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScreenLayoutDesigner;