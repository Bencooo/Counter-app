import React from 'react';
import { useAccount } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';

interface StatusProps {
  onDisconnect: () => void;
}

const Status: React.FC<StatusProps> = ({ onDisconnect }) => {
  const { address, isConnected, status: accountStatus } = useAccount();

  return (
    <div className="flex justify-between w-full px-8">
      <div className="text-white">
        <p className="font-semibold text-lg">
          Status: <span className={`font-bold ${isConnected ? 'text-green-500' : ''}`}>{accountStatus}</span>
        </p>
        <p className="font-semibold text-lg">
          Address: <span className="font-bold">{address}</span>
        </p>
      </div>
      {isConnected && (
        <button
          className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          onClick={onDisconnect}
        >
          <FontAwesomeIcon icon={faDoorOpen} className="mr-2" />
          Disconnect
        </button>
      )}
    </div>
  );
};

export default Status;
