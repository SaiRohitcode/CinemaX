import "./Payment.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";

const PAYMENT_METHODS = [
    {
        id: "upi",
        title: "UPI",
        options: [
            { name: "Google Pay", logo: "/payment/gpay.png" },
            { name: "PhonePe", logo: "/payment/phonepe.png" },
            { name: "Paytm", logo: "/payment/paytm.png" },
            { name: "Amazon Pay", logo: "/payment/amazonpay.png" }
        ]
    },
    {
        id: "card",
        title: "Credit / Debit Card",
        options: [
            { name: "Visa" },
            { name: "MasterCard" },
            { name: "RuPay" }
        ]
    },
    {
        id: "bank",
        title: "Net Banking",
        options: [
            { name: "SBI" },
            { name: "HDFC" },
            { name: "ICICI" },
            { name: "Axis" }
        ]
    },
    {
        id: "wallet",
        title: "Wallet",
        options: [
            { name: "Mobikwik" },
            { name: "Freecharge" }
        ]
    }
];

const PROMOS = {
    FIRST100: 100,
    STUDENT50: 50,
    CINEMAX20: 20
};

const OFFERS = [
    "HDFC • Flat ₹200 Instant Discount",
    "ICICI • 10% Cashback up to ₹150",
    "SBI • 15% Instant Discount",
    "Axis • Flat ₹100 Cashback"
];

function Payment() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [selected, setSelected] = useState("");
    const [expanded, setExpanded] = useState("upi");
    const [promo, setPromo] = useState("");
    const [discount, setDiscount] = useState(0);
    const [message, setMessage] = useState("");
    const [showPromo, setShowPromo] = useState(false);
    const [showOffers, setShowOffers] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!state) {
        return (
            <div className="payment-page">
                <h2>No Booking Found</h2>
            </div>
        );
    }

    const {
        movie,
        theatre,
        show,
        location,
        showTime,
        selectedDate,
        selectedSeats = [],
        subtotal = 0,
        convenienceFee = 40,
        gst = 18,
        totalPrice = 0,
        day
    } = state;

    const total = totalPrice - discount;

    const summary = [
        ["Movie", movie?.title || "N/A"],
        ["Theatre", theatre?.name || "N/A"],
        ["Location", location?.city || theatre?.city || "N/A"],
        ["Date", `${day ? `${day}, ` : ""}${selectedDate || "N/A"}`],
        ["Show Time", showTime || show?.showTime || "N/A"],
        ["Seats", selectedSeats.join(", ") || "N/A"],
        ["Ticket Price", `₹${subtotal}`],
        ["Convenience Fee", `₹${convenienceFee}`],
        ["GST", `₹${gst}`]
    ];

    const applyPromo = () => {
        const code = promo.trim().toUpperCase();
        const value = PROMOS[code] || 0;

        setDiscount(value);

        if (value) {
            setMessage(`${code} Applied Successfully`);
        } else {
            setMessage("Invalid Promo Code");
        }
    };

    const pay = async () => {
        if (!selected) {
            alert("Please select a payment method.");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/bookings",
                {
                    show: show._id,
                    seats: selectedSeats,
                    paymentMethod: selected
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate("/booking-confirmation", {
                state: {
                    booking: response.data.booking
                }
            });
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Payment Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="payment-page">
                <div className="payment-container">
                    <div className="payment-left">
                        <h2>Select Payment Method</h2>

                        {PAYMENT_METHODS.map(method => (
                            <div
                                className="method-card"
                                key={method.id}
                            >
                                <div
                                    className="method-header"
                                    onClick={() =>
                                        setExpanded(
                                            expanded === method.id
                                                ? ""
                                                : method.id
                                        )
                                    }
                                >
                                    <span>{method.title}</span>
                                    <span>
                                        {expanded === method.id
                                            ? "▲"
                                            : "▼"}
                                    </span>
                                </div>

                                {expanded === method.id && (
                                    <div className="options">
                                        {method.options.map(option => (
                                            <div
                                                key={option.name}
                                                className={`option ${
                                                    selected === option.name
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setSelected(
                                                        option.name
                                                    )
                                                }
                                            >
                                                {option.logo && (
                                                    <img
                                                        src={option.logo}
                                                        alt={option.name}
                                                        className="payment-logo"
                                                    />
                                                )}

                                                <span>
                                                    {option.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="dropdown">
                            <div
                                className="dropdown-header"
                                onClick={() =>
                                    setShowPromo(!showPromo)
                                }
                            >
                                <h3>🎁 Promo Codes</h3>
                                <span>
                                    {showPromo ? "▲" : "▼"}
                                </span>
                            </div>

                            {showPromo && (
                                <div className="dropdown-content">
                                    <div className="promo-box">
                                        <input
                                            type="text"
                                            placeholder="Promo Code"
                                            value={promo}
                                            onChange={e =>
                                                setPromo(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <button onClick={applyPromo}>
                                            Apply
                                        </button>
                                    </div>

                                    <div className="coupon-list">
                                        {Object.keys(PROMOS).map(code => (
                                            <span
                                                key={code}
                                                className="coupon"
                                                onClick={() => {
                                                    setPromo(code);
                                                    setDiscount(
                                                        PROMOS[code]
                                                    );
                                                    setMessage(
                                                        `${code} Applied Successfully`
                                                    );
                                                }}
                                            >
                                                {code}
                                            </span>
                                        ))}
                                    </div>

                                    {message && (
                                        <p className="promo-message">
                                            {message}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="dropdown">
                            <div
                                className="dropdown-header"
                                onClick={() =>
                                    setShowOffers(!showOffers)
                                }
                            >
                                <h3>🏦 Bank Offers</h3>
                                <span>
                                    {showOffers ? "▲" : "▼"}
                                </span>
                            </div>

                            {showOffers && (
                                <div className="dropdown-content">
                                    {OFFERS.map((offer, index) => (
                                        <div
                                            className="offer-card"
                                            key={index}
                                        >
                                            {offer}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="booking-summary">
                        <h2>Booking Summary</h2>

                        {summary.map(([label, value]) => (
                            <div
                                className="summary-item"
                                key={label}
                            >
                                <span>{label}</span>
                                <span>{value}</span>
                            </div>
                        ))}

                        <div className="summary-item discount">
                            <span>Discount</span>
                            <span>- ₹{discount}</span>
                        </div>

                        <hr />

                        <div className="summary-total">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>

                        <button
                            className="pay-btn"
                            disabled={!selected || loading}
                            onClick={pay}
                        >
                            {loading
                                ? "Processing..."
                                : `Pay ₹${total}`}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Payment;