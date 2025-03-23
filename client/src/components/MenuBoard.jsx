export function MenuBoard({ menu }) {
  return (
      <div className="max-w-lg mx-auto p-4 mt-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">Today's Menu</h2>
          <ul>
              {menu?.map((m) => (
                  <li key={m.id} className="flex flex-col items-center p-2 border-b">
                      <img src={m.img_url} alt="Menu" className="w-32 h-32 object-cover rounded" />
                      <p className="font-semibold mt-2">{m.items}</p>
                      <span className="text-sm text-gray-500">{m.meal_slot}</span>
                  </li>
              ))}
          </ul>
      </div>
  );
}
