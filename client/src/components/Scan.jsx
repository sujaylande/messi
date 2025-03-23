import { useState } from 'react';

function Scan() {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    if (isScanning) {
      return; // Prevent multiple clicks while scanning
    }

    setIsScanning(true); // Disable the button

    try {
      const response = await fetch('http://localhost:5000/api/manager/scan');
      const data = await response.json();
      // status code is 500 or 404 give message that camera is not connected
      if (response.status === 200) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error during scan:", error);
      alert("An error occurred during the scan.");
    } finally {
      setIsScanning(false); // Re-enable the button after scan (or error)
    }
  };

  return (
    <div className='p-5 bg-white min-h-screen flex flex-col items-center justify-center'>
      <h2 className='text-2xl font-semibold mb-6'>Scan for Attendance</h2>
      <button
        onClick={handleScan}
        disabled={isScanning}
        className={`w-40 p-2 rounded-lg text-white ${isScanning ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
      >
        {isScanning ? 'Scanning...' : 'Start Scan'}
      </button>
    </div>
  );
}

export default Scan;