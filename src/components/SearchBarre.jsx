import { useState, useEffect } from 'react';
import { FcSearch } from "react-icons/fc";

const SearchBarre = ({ plants = [], onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (typeof onSearch !== 'function') return;
    if (!plants || !Array.isArray(plants)) {
      onSearch([]);
      return;
    }

    const filteredPlants = plants.filter(
      (plant) =>
        plant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    onSearch(filteredPlants);
  }, [searchTerm, plants, onSearch]);

  return (
    <div className="flex items-center gap-2 mb-6 w-full max-w-md">
      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher une plante..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg p-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Icône de recherche */}
      <FcSearch className="text-3xl cursor-pointer" />
    </div>
  );
};

export default SearchBarre;
