import "./DateSelector.css";

function DateSelector({
    dates,
    selectedDate,
    onDateChange
}) {
    const handleCalendarChange = e => {
        const value = e.target.value;

        if (!value) return;

        const date = new Date(`${value}T00:00:00`);

        onDateChange({
            date: value,
            day: date.toLocaleDateString("en-US", {
                weekday: "short"
            })
        });
    };

    return (
        <div className="date-selector">
            <input
                type="date"
                className="calendar-date"
                value={selectedDate}
                min={dates[0]?.value}
                onChange={handleCalendarChange}
            />

            {dates.map(date => (
                <div
                    key={date.value}
                    className={`date-card ${
                        selectedDate === date.value
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        onDateChange({
                            date: date.value,
                            day: date.day
                        })
                    }
                >
                    <span>{date.day}</span>
                    <h3>{date.date}</h3>
                    <small>{date.month}</small>
                </div>
            ))}
        </div>
    );
}

export default DateSelector;