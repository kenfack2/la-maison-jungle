import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, X, Download } from 'lucide-react';

function Panier({
  isOpen,
  onClose,
  panier = [],
  onRetirer,
  onModifierQuantite,
  onVider,
  total = 0,
  nombreArticles = 0
}) {
  const panierRef = useRef(null);

  // Fermer le panier en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panierRef.current && !panierRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Calculer le nombre total d'articles
  const nombreTotalArticles = () => {
    return nombreArticles || panier.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculer le total
  const calculerTotal = () => {
    return total || panier.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Générer le PDF et sauvegarder en JSON
  const handleCommander = () => {
    // Sauvegarder la commande en JSON
    const commande = {
      id: Date.now(),
      date: new Date().toISOString(),
      articles: panier,
      total: calculerTotal(),
      nombreArticles: nombreTotalArticles()
    };

    // Sauvegarder dans le localStorage (ou envoyer à une API)
    const commandesExistantes = JSON.parse(localStorage.getItem('commandes') || '[]');
    commandesExistantes.push(commande);
    localStorage.setItem('commandes', JSON.stringify(commandesExistantes));

    // Générer le PDF
    genererPDF(commande);

    // Vider le panier après commande
    if (onVider) {
      onVider();
    }

    // Fermer le panier
    onClose();

    // Feedback utilisateur
    alert('Commande confirmée ! Le PDF a été généré et la commande sauvegardée.');
  };

// Fonction de conversion émoji -> symbole texte
const getSymboleTexte = (emoji) => {
  const correspondances = {
    '🌱': '🌱', // Garder les émojis basiques qui fonctionnent
    '🌾': '🌾',
    '🌳': '🌳',
    '🌿': '🌿',
    '🌴': '🌴',
    '🥀': '🥀',
    '💐': '💐',
    '💮': '💮',
    '🌸': '🌸',
    '🌺': '🌺',
    '🌻': '🌻',
    '🌼': '🌼',
    '🌷': '🌷',
    '🍀': '🍀',
    '🌵': '🌵',
    '🎍': '🎍',
    '🪴': '🪴',
    '🍂': '🍂',
    '🍁': '🍁',
    '🎋': '🎋'
  };
  return correspondances[emoji] || '🌱'; // Retourne l'émoji si connu, sinon plante par défaut
};

const genererPDF = (commande) => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // En-tête avec icône texte
  doc.setFontSize(20);
  doc.setTextColor(40, 180, 99);
  doc.text('🌿 GreenStore - Facture', 20, 20);

  // Informations de la commande
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Commande N°: ${commande.id}`, 20, 40);
  doc.text(`Date: ${new Date(commande.date).toLocaleDateString('fr-FR')}`, 20, 50);
  doc.text(`Heure: ${new Date(commande.date).toLocaleTimeString('fr-FR')}`, 20, 60);

  // Ligne de séparation
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 70, 190, 70);

  // En-tête du tableau
  let yPosition = 85;
  doc.setFontSize(10);
  doc.text('Article', 20, yPosition);
  doc.text('Quantité', 100, yPosition);
  doc.text('Prix unitaire', 130, yPosition);
  doc.text('Total', 170, yPosition);

  yPosition += 10;
  doc.line(20, yPosition, 190, yPosition);

  // Articles avec symboles texte
  commande.articles.forEach((article, index) => {
    yPosition += 15;
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    const symbole = getSymboleTexte(article.forme);
    doc.text(`${symbole} ${article.name}`, 20, yPosition);
    doc.text(article.quantity.toString(), 100, yPosition);
    doc.text(`${article.price}€`, 130, yPosition);
    doc.text(`${article.price * article.quantity}€`, 170, yPosition);
  });

  // Ligne de séparation avant le total
  yPosition += 10;
  doc.line(20, yPosition, 190, yPosition);

  // Total
  yPosition += 15;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL:', 130, yPosition);
  doc.text(`${commande.total}€`, 170, yPosition);

  // Pied de page
  yPosition += 20;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Merci pour votre confiance ! GreenStore - Votre boutique de plantes préférée', 20, yPosition);

  // Sauvegarder le PDF
  doc.save(`commande-${commande.id}.pdf`);
};

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay sombre */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300" />

      {/* Panier coulissant */}
      <div
        ref={panierRef}
        className="fixed inset-y-0 right-0 bg-white w-full max-w-md h-full flex flex-col transform transition-transform duration-300 z-50 shadow-2xl"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header du panier */}
        <div className="bg-green-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <ShoppingCart size={28} />
            <div>
              <h2 className="text-2xl font-bold">Mon Panier</h2>
              <p className="text-green-100 text-sm">
                {nombreTotalArticles()} article{nombreTotalArticles() > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-green-200 transition p-2 rounded-full hover:bg-green-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenu du panier */}
        <div className="flex-1 overflow-y-auto p-6">
          {panier.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Votre panier est vide</h3>
              <p className="text-gray-500">Ajoutez des plantes pour commencer vos achats</p>
            </div>
          ) : (
            <div className="space-y-4">
              {panier.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    {/* Emoji de la plante */}
                    <div className="text-3xl flex-shrink-0">{item.forme}</div>

                    {/* Détails du produit */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
                      <p className="text-green-600 text-sm">{item.category}</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{item.price}€</p>
                    </div>

                    {/* Bouton supprimer */}
                    <button
                      onClick={() => onRetirer && onRetirer(item.id)}
                      className="text-red-500 hover:text-red-700 transition p-1 rounded-full hover:bg-red-50"
                      title="Supprimer l'article"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Contrôles de quantité */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => onModifierQuantite && onModifierQuantite(item.id, item.quantity - 1)}
                        className="bg-white text-gray-700 rounded-full p-2 hover:bg-gray-200 transition shadow-sm"
                        title="Réduire la quantité"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-semibold text-gray-800 min-w-[30px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onModifierQuantite && onModifierQuantite(item.id, item.quantity + 1)}
                        className="bg-white text-gray-700 rounded-full p-2 hover:bg-gray-200 transition shadow-sm"
                        title="Augmenter la quantité"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">
                        {item.price * item.quantity}€
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {item.price}€
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer avec total et actions */}
        {panier.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
            {/* Total */}
            <div className="flex justify-between items-center text-lg bg-white p-4 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-700">Total :</span>
              <span className="font-bold text-2xl text-green-600">
                {calculerTotal()}€
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={onVider}
                className="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Trash2 size={20} />
                <span>Vider le panier</span>
              </button>

              <button
                onClick={handleCommander}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Download size={20} />
                <span>Commander ({calculerTotal()}€)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Panier;