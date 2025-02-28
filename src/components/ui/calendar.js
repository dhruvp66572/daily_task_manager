import { useState } from "react";
import PropTypes from "prop-types";

export function Calendar({ selected, onSelect, minDate, maxDate, dateFormat }) {
  const [date, setDate] = useState(selected);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const newDate = new Date(e.target.value);
    if (minDate && newDate < new Date(minDate)) {
      setError(`Date cannot be earlier than ${minDate}`);
      return;
    }
    if (maxDate && newDate > new Date(maxDate)) {
      setError(`Date cannot be later than ${maxDate}`);
      return;
    }
    setError("");
    setDate(newDate);
    onSelect(newDate);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Intl.DateTimeFormat(dateFormat, options).format(date);
  };

  return (
    <div className="calendar-component">
      <input
        type="date"
        value={date.toISOString().substring(0, 10)}
        onChange={handleChange}
        className="p-2 border rounded w-full"
        min={minDate}
        max={maxDate}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

Calendar.propTypes = {
  selected: PropTypes.instanceOf(Date).isRequired,
  onSelect: PropTypes.func.isRequired,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  dateFormat: PropTypes.string,
};

Calendar.defaultProps = {
  minDate: null,
  maxDate: null,
  dateFormat: "en-US",
};
