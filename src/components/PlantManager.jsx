import { useState } from 'react';
import { plantList } from '../datas/plantList';

function PlantManager({ plants, onPlantUpdated, onPlantDeleted }) {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [errors, setErrors] = useState({});

  const availableCategories = ['classique', 'extérieur', 'plante grasse'];

  // Liste UNIQUE des émojis (sans doublons)
  const availableFormes = [
    '🌱', '🌾', '🌳', '🌿', '🌴', '🥀', '💐', '💮', '🌸', '🌺',
    '🌻', '🌼', '🌷', '🍀', '🌵', '🎍', '🪴', '🍂', '🍁', '🎋',
    '🥬', '🥦', '🌶️', '🍅', '🥑', '🥒', '🫑', '🧄', '🧅', '🥔',
    '🥕', '🌽', '🫐', '🍓', '🍒', '🍎', '🍏', '🍐', '🍊', '🍋',
    '🍌', '🍉', '🍇', '🫒', '🥥', '🍄', '🪸', '🌰', '🎃', '🪷',
    '🌹', '🌊', '🪵', '🍃', '🎄', '🏵️'
  ].filter((forme, index, array) => array.indexOf(forme) === index); // Supprime les doublons

  // Ouvrir le modal de modification
  const handleEdit = (plant) => {
    setSelectedPlant(plant);
    setEditFormData({ ...plant });
    setShowEditModal(true);
    setErrors({});
  };

  // Ouvrir le modal de suppression
  const handleDelete = (plant) => {
    setSelectedPlant(plant);
    setShowDeleteModal(true);
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    if (!editFormData.name?.trim()) newErrors.name = 'Le nom est requis';
    if (!editFormData.price || editFormData.price <= 0) newErrors.price = 'Prix invalide';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sauvegarder les modifications
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const plantIndex = plantList.findIndex(p => p.id === selectedPlant.id);
    if (plantIndex !== -1) {
      plantList[plantIndex] = { ...editFormData, price: parseInt(editFormData.price) };

      if (onPlantUpdated) {
        onPlantUpdated(plantList[plantIndex]);
      }
    }

    setShowEditModal(false);
    setSelectedPlant(null);
  };

  // Confirmer la suppression
  const handleConfirmDelete = () => {
    const plantIndex = plantList.findIndex(p => p.id === selectedPlant.id);
    if (plantIndex !== -1) {
      const deletedPlant = plantList.splice(plantIndex, 1)[0];

      if (onPlantDeleted) {
        onPlantDeleted(deletedPlant);
      }
    }

    setShowDeleteModal(false);
    setSelectedPlant(null);
  };

  // Annuler les modales
  const handleCancel = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedPlant(null);
    setErrors({});
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <>
      {/* Liste des plantes avec actions - Version responsive */}
      <div className="space-y-4">
        {plants.map((plant) => (
          <div key={plant.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition">
            {/* Layout responsive : empilement vertical sur mobile */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Contenu de la plante */}
              <div className="flex items-center space-x-4 flex-1">
                <span className="text-3xl flex-shrink-0">{plant.forme}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-lg text-gray-800 truncate">{plant.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded whitespace-nowrap">
                      {plant.category}
                    </span>
                    <span className="font-semibold whitespace-nowrap">{plant.price}€</span>
                    {plant.isBestSale && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded flex items-center whitespace-nowrap">
                        🔥 Best-seller
                      </span>
                    )}
                  </div>
                  {/* Description tronquée */}
                  {plant.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {plant.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Boutons d'action - Empilés sur mobile, côte à côte sur desktop */}
              <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                <button
                  onClick={() => handleEdit(plant)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center space-x-2 min-w-[120px]"
                >
                  <span>✏️</span>
                  <span className="whitespace-nowrap">Modifier</span>
                </button>
                <button
                  onClick={() => handleDelete(plant)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center space-x-2 min-w-[120px]"
                >
                  <span>🗑️</span>
                  <span className="whitespace-nowrap">Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de modification */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl flex-shrink-0">
              <h2 className="text-2xl font-bold">✏️ Modifier la plante</h2>
              <p className="text-blue-100 mt-1">Modifiez les informations de {selectedPlant?.name}</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de la plante
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Nom de la plante..."
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      name="category"
                      value={editFormData.category || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      {availableCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prix (€)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="15"
                      min="1"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>
                </div>

                {/* Champ description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description || ''}
                    onChange={handleEditChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    placeholder="Décrivez cette plante..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Forme
                  </label>
                  {/* Container avec hauteur fixe et défilement */}
                  <div className="grid grid-cols-7 gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                    {availableFormes.map((forme, index) => (
                      <button
                        key={`${forme}-${index}`} // Clé unique avec index
                        type="button"
                        onClick={() => setEditFormData(prev => ({ ...prev, forme }))}
                        className={`text-2xl p-2 rounded-lg border-2 transition-all duration-200 min-h-[50px] flex items-center justify-center ${
                          editFormData.forme === forme
                            ? 'border-blue-500 bg-blue-100 scale-105 shadow-md'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:scale-105'
                        }`}
                      >
                        {forme}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-center mt-3 space-x-3">
                    <span className="text-3xl">{editFormData.forme}</span>
                    <span className="text-gray-600">Forme sélectionnée</span>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <input
                    type="checkbox"
                    id="editIsBestSale"
                    name="isBestSale"
                    checked={editFormData.isBestSale || false}
                    onChange={handleEditChange}
                    className="h-5 w-5 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                  />
                  <label htmlFor="editIsBestSale" className="ml-3 text-sm font-medium text-orange-800 flex items-center">
                    <span className="mr-2">🔥</span>
                    Best-seller
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-lg hover:bg-gray-300 transition font-semibold shadow"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-semibold shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>💾</span>
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold">🗑️ Supprimer la plante</h2>
              <p className="text-red-100 mt-1">Cette action est irréversible</p>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl">{selectedPlant?.forme}</span>
                <div>
                  <h3 className="font-bold text-lg">{selectedPlant?.name}</h3>
                  <p className="text-gray-600">{selectedPlant?.category} • {selectedPlant?.price}€</p>
                  {selectedPlant?.isBestSale && (
                    <span className="text-orange-600 text-sm">🔥 Best-seller</span>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-6 text-center">
                Êtes-vous sûr de vouloir supprimer <strong>{selectedPlant?.name}</strong> ?
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PlantManager;