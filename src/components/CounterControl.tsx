import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

interface CounterControlProps {
  counter: number | null;
  readLoading: boolean;
  readError: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onIncrementBy: (value: number) => void;
  onDecrementBy: (value: number) => void;
}

const CounterControl: React.FC<CounterControlProps> = ({ counter, readLoading, readError, onIncrement, onDecrement, onIncrementBy, onDecrementBy }) => {
  const [value, setValue] = useState<number>(0);

  return (
    <div className="bg-[#4C4E4E] p-8 rounded-lg shadow-lg w-full max-w-md text-white mt-8 md:mt-16">
      <div className="flex justify-between items-center mb-10">
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
      <div className="flex flex-col items-center">
        <h2 className="mb-2 text-lg font-semibold">Une valeur en particulier ?</h2>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          className="p-2 mb-4 w-2/3 bg-gray-700 text-white rounded"
          placeholder="Enter value"
        />
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 bg-[#30C8DD] text-white font-semibold rounded transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => onIncrementBy(value)}
          >
            Increment by
          </button>
          <button
            className="px-4 py-2 bg-[#30C8DD] text-white font-semibold rounded transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => onDecrementBy(value)}
          >
            Decrement by
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterControl;
