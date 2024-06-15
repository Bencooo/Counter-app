import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

interface CounterControlProps {
  counter: number | null;
  readLoading: boolean;
  readError: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}

const CounterControl: React.FC<CounterControlProps> = ({ counter, readLoading, readError, onIncrement, onDecrement }) => (
  <div className="bg-[#4C4E4E] p-8 rounded-lg shadow-lg w-full max-w-md text-white mt-16">
    <div className="flex justify-between items-center">
      <button
        className="p-4 bg-[#30C8DD] text-white font-semibold rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
        onClick={onIncrement}
      >
        <FontAwesomeIcon icon={faPlus} className="text-white" />
      </button>
      {readLoading ? (
        <p className="text-4xl">Loading...</p>
      ) : (
        <p className="text-4xl mx-4">{counter}</p>
      )}
      {readError && <p className="text-red-500">Error</p>}
      <button
        className="p-4 bg-[#30C8DD] text-white font-semibold rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
        onClick={onDecrement}
      >
        <FontAwesomeIcon icon={faMinus} className="text-white" />
      </button>
    </div>
  </div>
);

export default CounterControl;
