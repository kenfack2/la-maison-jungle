import { useState } from 'react';
import { plantList } from '../datas/plantList';
import SearchBarre from './SearchBarre';
import AddPlantForm from './AddPlantForm';
import PlantManager from './PlantManager';
import { ShoppingCart } from 'lucide-react';

function ShoppingList({ onAddToCart }) {
  const [filteredPlants, setFilteredPlants] = useState(plantList || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showManager, setShowManager] = useState(false);

  const handleAddPlant = () => setShowAddForm(true);
  const handleShowManager = () => setShowManager(!showManager);

  const handlePlantAdded = (newPlant) => {
    setFilteredPlants(prev => [...prev, newPlant]);
  };

  const handlePlantUpdated = (updatedPlant) => {
    setFilteredPlants(prev =>
      prev.map(plant => plant.id === updatedPlant.id ? updatedPlant : plant)
    );
  };

  const handlePlantDeleted = (deletedPlant) => {
    setFilteredPlants(prev =>
      prev.filter(plant => plant.id !== deletedPlant.id)
    );
  };

  // Fonction pour gérer l'ajout au panier
  const handleAddToCart = (plant) => {
    if (onAddToCart) {
      onAddToCart(plant);
      // Optionnel: Ajouter un feedback visuel
      console.log(`${plant.name} ajouté au panier`);
    }
  };

  return (
    <div className="p-8 text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800">🌿 Catalogue des Plantes</h1>
        <div className="flex gap-4">
          <button
            onClick={handleShowManager}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            {showManager ? '📋 Voir le catalogue' : '⚙️ Gérer les plantes'}
          </button>
          <button
            onClick={handleAddPlant}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-lg"
          >
            + Ajouter une plante
          </button>
        </div>
      </div>

      {showAddForm && (
        <AddPlantForm
          onPlantAdded={handlePlantAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {showManager ? (
        <PlantManager
          plants={filteredPlants}
          onPlantUpdated={handlePlantUpdated}
          onPlantDeleted={handlePlantDeleted}
        />
      ) : (
        <>
          <div className="mb-8">
            <SearchBarre
              plants={plantList || []}
              onSearch={setFilteredPlants}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPlants.map((plant) => (
              <div key={plant.id} className="ring-2 ring-blue-500/50 bg-white text-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 flex flex-col">
                {/* Contenu de la plante */}
                <div className="flex-1">
                  <div className="text-4xl mb-4">{plant.forme}</div>
                  <h3 className="font-bold text-lg mb-2">{plant.name}</h3>
                  <p className="text-green-600 mb-2">{plant.category}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{plant.description}</p>
                  <div className="flex justify-center items-center gap-2 mb-4">
                    {plant.isBestSale && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        🔥 Best-seller
                      </span>
                    )}
                    {plant.price && <span className="font-bold text-lg">{plant.price}€</span>}
                  </div>
                </div>

                {/* Bouton Ajouter au panier */}
                <button
                  onClick={() => handleAddToCart(plant)}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition flex items-center justify-center space-x-2 mt-auto"
                >
                  <ShoppingCart size={18} />
                  <span className="font-semibold">Ajouter au panier</span>
                </button>
              </div>
            ))}
          </div>

          {filteredPlants.length === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-xl text-gray-600 mb-4">Aucune plante trouvée.</p>
              <button
                onClick={handleAddPlant}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                + Ajouter la première plante
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ✅ Export par défaut
export default ShoppingList;