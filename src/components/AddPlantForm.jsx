import { useState } from 'react';
import { plantList } from '../datas/plantList';

function AddPlantForm({ onPlantAdded, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'classique',
    price: '',
    forme: '🌱',
    isBestSale: false
  });

  const [errors, setErrors] = useState({});

  const availableCategories = ['classique', 'extérieur', 'plante grasse'];
  const availableFormes = [
    '🌱', '🌾', '🌳', '🌿', '🌴', '🥀', '💐', '💮', '🌸', '🌺',
    '🌻', '🌼', '🌷', '🍀', '🌵', '🎍', '🪴', '🍂', '🍁', '🎋',
    '🥬', '🥦', '🌶️', '🍅', '🥑', '🥒', '🫑', '🧄', '🧅', '🥔',
    '🥕', '🌽', '🫐', '🍓', '🍒', '🍎', '🍏', '🍐', '🍊', '🍋',
    '🍌', '🍉', '🍇', '🫒', '🥥', '🍄', '🪸', '🌰', '🎃', '🌺',
    '🌹', '🪷', '🌻', '🌼', '💐', '🪻', '🌷', '🪴', '🌲', '🌳',
    '🌴', '🪵', '🍃', '🍀', '🍄', '🌵', '🎄', '🌊', '🪨', '🏵️'
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Prix invalide';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newPlant = {
      ...formData,
      id: Date.now().toString(),
      price: parseInt(formData.price)
    };

    plantList.push(newPlant);
    if (onPlantAdded) onPlantAdded(newPlant);
    if (onCancel) onCancel();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header fixe */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-xl flex-shrink-0">
          <h2 className="text-2xl font-bold">🌿 Nouvelle Plante</h2>
          <p className="text-green-100 mt-1">Ajoutez une plante à votre collection</p>
        </div>

        {/* Contenu défilant */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom de la plante
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Monstera, Ficus..."
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                placeholder="Décrivez cette plante..."
              />
            </div>

            {/* Category & Price Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="15"
                  min="1"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
            </div>

            {/* Forme Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Forme
              </label>
              <div className="grid grid-cols-7 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                {availableFormes.map(forme => (
                  <button
                    key={forme}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, forme }))}
                    className={`text-2xl p-2 rounded-lg border-2 transition-all duration-200 ${
                      formData.forme === forme
                        ? 'border-green-500 bg-green-100 scale-110 shadow-md'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:scale-105'
                    }`}
                  >
                    {forme}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center mt-3 space-x-3">
                <span className="text-3xl">{formData.forme}</span>
                <span className="text-gray-600">Forme sélectionnée</span>
              </div>
            </div>

            {/* Best Seller */}
            <div className="flex items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <input
                type="checkbox"
                id="isBestSale"
                name="isBestSale"
                checked={formData.isBestSale}
                onChange={handleChange}
                className="h-5 w-5 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
              />
              <label htmlFor="isBestSale" className="ml-3 text-sm font-medium text-orange-800 flex items-center">
                <span className="mr-2">🔥</span>
                Best-seller
              </label>
            </div>

            {/* Buttons - Maintenant dans le contenu défilant mais toujours visibles */}
            <div className="flex gap-4 pt-4 pb-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-lg hover:bg-gray-300 transition font-semibold shadow"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition font-semibold shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span>
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPlantForm;