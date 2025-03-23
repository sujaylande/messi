import { useEffect, useState } from "react";
import axios from "axios";

export default function NoticeBoard() {
  const [notice, setNotice] = useState("");
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const res = await axios.get("http://localhost:5000/api/manager/display-notices");
    setNotices(res.data);
  };

  const addNotice = async () => {
    if (!notice.trim()) return;
    await axios.post("http://localhost:5000/api/manager/add-notice", { notice });
    setNotice("");
    fetchNotices();
  };

  const deleteNotice = async (id) => {
    await axios.delete(`http://localhost:5000/api/manager/remove-notice/${id}`);
    fetchNotices();
  };

  return (
    <div className="max-w-lg mx-auto p-4 mt-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Notice Board</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter notice"
          value={notice}
          onChange={(e) => setNotice(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <button onClick={addNotice} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>
      <ul>
        {notices.map((n) => (
          <li key={n.id} className="flex justify-between p-2 border-b">
            {n.notice}
            <button onClick={() => deleteNotice(n.id)} className="text-red-500">✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
}