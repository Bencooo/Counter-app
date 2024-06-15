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
    <div className="flex flex-col md:flex-row justify-between w-full px-4 md:px-8 mb-4 md:mb-0">
      <div className="text-white mb-4 md:mb-0">
        <p className="font-semibold text-lg">
          Status: <span className={`font-bold ${isConnected ? 'text-green-500' : ''}`}>{accountStatus}</span>
        </p>
        <p className="font-semibold text-lg">
          Address: <span className="font-bold">{address}</span>
        </p>
      </div>
      {isConnected && (
        <button
          className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center self-start md:self-center"
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
