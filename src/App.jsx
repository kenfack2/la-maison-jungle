import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Banner from './components/Banner'
import ShoppingList from './components/ShoppingList'
import { plantList } from './datas/plantList'
import MenuBurger from './components/MenuBurger'
import DashboardAccueil from './components/DashboardAccueil'
import Panier from './components/Panier'
import { ShoppingCart } from 'lucide-react'
import Profil from './components/Profil'

const UniqueCategory = []
plantList.forEach(plant => {
	if (!UniqueCategory.includes(plant.category)) {
		UniqueCategory.push(plant.category)
	}
})

const pageVariants = {
	initial: { opacity: 0, x: 50 },
	animate: { opacity: 1, x: 0 },
	exit: { opacity: 0, x: -50 },
}

// Hook personnalisé pour gérer le panier
function usePanier() {
  const [panier, setPanier] = useState([]);

  const ajouterAuPanier = (plante) => {
    setPanier(prev => {
      const existingItem = prev.find(item => item.id === plante.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === plante.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...plante, quantity: 1 }];
    });
  };

  const retirerDuPanier = (id) => {
    setPanier(prev => prev.filter(item => item.id !== id));
  };

  const modifierQuantite = (id, nouvelleQuantite) => {
    if (nouvelleQuantite < 1) {
      retirerDuPanier(id);
      return;
    }
    setPanier(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: nouvelleQuantite } : item
      )
    );
  };

  const viderPanier = () => {
    setPanier([]);
  };

  const calculerTotal = () => {
    return panier.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const nombreTotalArticles = () => {
    return panier.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    panier,
    ajouterAuPanier,
    retirerDuPanier,
    modifierQuantite,
    viderPanier,
    calculerTotal,
    nombreTotalArticles
  };
}

function App() {
	const [page, setPage] = useState('dashboard')
  const [panierOpen, setPanierOpen] = useState(false)

  // Utilisation du hook panier
  const {
    panier,
    ajouterAuPanier,
    retirerDuPanier,
    modifierQuantite,
    viderPanier,
    calculerTotal,
    nombreTotalArticles
  } = usePanier()

	return (
		<div className="min-h-screen bg-green-50">
			<Banner />

      {/* Header avec navigation et panier */}
      <div className="sticky top-0 z-40 bg-green-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <MenuBurger onNavigate={setPage} />

          {/* Bouton panier */}
          <button
            onClick={() => setPanierOpen(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-2 relative"
          >
            <ShoppingCart size={20} />
            <span>Panier</span>
            {nombreTotalArticles() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {nombreTotalArticles()}
              </span>
            )}
          </button>
        </div>
      </div>

			<AnimatePresence mode="wait">
				{page === 'dashboard' && (
					<motion.div
						key="dashboard"
						initial="initial"
						animate="animate"
						exit="exit"
						variants={pageVariants}
						transition={{ duration: 0.5 }}
					>
						<DashboardAccueil />
					</motion.div>
				)}

				{page === 'shop' && (
					<motion.div
						key="shop"
						initial="initial"
						animate="animate"
						exit="exit"
						variants={pageVariants}
						transition={{ duration: 0.5 }}
					>
						<ShoppingList
              onAddToCart={ajouterAuPanier}
            />
					</motion.div>
				)}

{page === 'profil' && (
  <motion.div
    key="profil"
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={{ duration: 0.5 }}
  >
    <Profil />
  </motion.div>
)}
			</AnimatePresence>

      {/* Panier */}
      <Panier
        isOpen={panierOpen}
        onClose={() => setPanierOpen(false)}
        panier={panier}
        onRetirer={retirerDuPanier}
        onModifierQuantite={modifierQuantite}
        onVider={viderPanier}
        total={calculerTotal()}
        nombreArticles={nombreTotalArticles()}
      />
		</div>
	)
}

export default App