import React from 'react';
import PropTypes from 'prop-types';

export function Progress({ value, color = 'bg-green-500', label }) {
  return (
    <div className="w-full bg-gray-200 rounded h-4 relative">
      <div className={`${color} h-4 rounded`} style={{ width: `${value}%` }}></div>
      {label && (
        <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
          {label}
        </span>
      )}
    </div>
  );
}

Progress.propTypes = {
  value: PropTypes.number.isRequired,
  color: PropTypes.string,
  label: PropTypes.string,
};