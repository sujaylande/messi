// import React, { useState } from 'react';
// import axios from 'axios';
// axios.defaults.withCredentials = true;


// function Scan() {
//   const [isScanning, setIsScanning] = useState(false);
//   const [responseMsg, setResponseMsg] = useState(null); // To hold response
//   const [isSuccess, setIsSuccess] = useState(false);    // To conditionally show success hint

//   const handleScan = async () => {
//     setIsScanning(true);

//     try {
//       const response = await axios.get('http://localhost:5000/api/manager/scan');

//       setResponseMsg(response.data.message || response.data.error || "Unknown response");

//       if (response.status === 200) {
//         setIsSuccess(true);
//       } else {
//         setIsSuccess(false);
//       }
//     } catch (error) {
//       console.error("Error during scan:", error);
//       setResponseMsg("Camera is not connected or an error occurred.");
//       setIsSuccess(false);
//     } finally {
//       setIsScanning(false);
//     }
//   };

//   return (
//     <div>
//       {!responseMsg && (
//       <div className='p-5 bg-white min-h-screen flex flex-col items-center justify-center'>
//       <h2 className='text-2xl font-semibold mb-6'>Scan for Attendance</h2>
//       <button
//         onClick={handleScan}
//         disabled={isScanning}
//         className={`w-40 p-2 rounded-lg text-white ${isScanning ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
//       >
//         {isScanning ? 'Scanning...' : 'Start Scan'}
//       </button>
//     </div>
//       )}

//       {responseMsg && (
//         <div className='p-5 bg-white min-h-screen flex flex-col items-center justify-center'>
//           <h2 className='text-2xl font-semibold mb-6'>{responseMsg}</h2>
//           {isSuccess && (
//             <h2 className='text-2xl font-semibold mb-6'>Press any key to mark attendance and press Q to quit.</h2>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Scan;


import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import managerAxios from '../api/managerAxios'

function Scan() {
  const [isScanning, setIsScanning] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [regNo, setRegNo] = useState(''); // For manual input
  const [manualLoading, setManualLoading] = useState(false); // For manual button loading

  const handleScan = async () => {
    setIsScanning(true);
    setResponseMsg(null);

    try {
      const response = await managerAxios.get('/scan');

      setResponseMsg(response.data.message || response.data.error || "Unknown response");
      setIsSuccess(response.status === 200);
    } catch (error) {
      console.error("Error during scan:", error);
      setResponseMsg("Camera is not connected or an error occurred.");
      setIsSuccess(false);
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!regNo.trim()) return;

    setManualLoading(true);
    setResponseMsg(null);

    try {
      const response = await managerAxios.post('/scan-manually', {
        reg_no: regNo.trim()
      });

      setResponseMsg(response.data.message || response.data.error || "Unknown response");
      setIsSuccess(response.status === 200);
    } catch (error) {
      console.error("Error during manual submission:", error);
      setResponseMsg("An error occurred while submitting registration number.");
      setIsSuccess(false);
    } finally {
      setManualLoading(false);
      setRegNo('');
    }
  };

  return (
    <div className='p-5 bg-white min-h-screen flex flex-col items-center justify-center'>
      {!responseMsg && (
        <>
          <h2 className='text-2xl font-semibold mb-6'>Scan for Attendance</h2>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`w-40 p-2 mb-4 rounded-lg text-white ${isScanning ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isScanning ? 'Scanning...' : 'Start Scan'}
          </button>

          <div className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Enter Reg No"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className="mb-2 px-4 py-2 border rounded-md w-64"
            />
            <button
              onClick={handleManualSubmit}
              disabled={manualLoading}
              className={`w-40 p-2 rounded-lg text-white ${manualLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {manualLoading ? 'Submitting...' : 'Submit Reg No'}
            </button>
          </div>
        </>
      )}

      {responseMsg && (
        <div className='mt-6 text-center'>
          <h2 className='text-xl font-semibold mb-4'>{responseMsg}</h2>
          {isSuccess && (
            <p className='text-green-600 font-medium'>Press any key to mark attendance and press Q to quit.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Scan;
