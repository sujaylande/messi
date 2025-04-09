// import { useState } from 'react';
// import axios from 'axios';

// function Scan() {
//   const [isScanning, setIsScanning] = useState(false);

//   const handleScan = async () => {
//     if (isScanning) {
//       return; // Prevent multiple clicks while scanning
//     }

//     setIsScanning(true); // Disable the button

//     try {
//       const response = await axios.get('http://localhost:5000/api/manager/scan', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem("manager-token")}`, // Add your token here if needed
//           'Content-Type': 'application/json'
//         }
//       });
    
//       const data = response.data;
//       // status code is 500 or 404 give message that camera is not connected
//       if (response.status === 200) {
//         alert(data.message);
//       } else {
//         alert(data.error);
//       }
//     } catch (error) {
//       console.error("Error during scan:", error);
//       alert("An error occurred during the scan.");
//     } finally {
//       setIsScanning(false); // Re-enable the button after scan (or error)
//     }
//   };

//   return (
//     <div className='p-5 bg-white min-h-screen flex flex-col items-center justify-center'>
//       <h2 className='text-2xl font-semibold mb-6'>Scan for Attendance</h2>
//       <button
//         onClick={handleScan}
//         disabled={isScanning}
//         className={`w-40 p-2 rounded-lg text-white ${isScanning ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
//       >
//         {isScanning ? 'Scanning...' : 'Start Scan'}
//       </button>
//     </div>
//   );
// }

// export default Scan;

import React, { useState } from 'react';
import axios from 'axios';

function Scan() {
  const [isScanning, setIsScanning] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null); // To hold response
  const [isSuccess, setIsSuccess] = useState(false);    // To conditionally show success hint

  const handleScan = async () => {
    setIsScanning(true);

    try {
      const response = await axios.get('http://localhost:5000/api/manager/scan', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("manager-token")}`, // if needed
        }
      });

      setResponseMsg(response.data.message || response.data.error || "Unknown response");

      if (response.status === 200) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error during scan:", error);
      setResponseMsg("Camera is not connected or an error occurred.");
      setIsSuccess(false);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div>
      {!responseMsg && (
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
      )}

      {responseMsg && (
        <div className='p-5 bg-white min-h-screen flex flex-col items-center justify-center'>
          <h2 className='text-2xl font-semibold mb-6'>{responseMsg}</h2>
          {isSuccess && (
            <h2 className='text-2xl font-semibold mb-6'>Press any key to mark attendance and press Q to quit.</h2>
          )}
        </div>
      )}
    </div>
  );
}

export default Scan;
