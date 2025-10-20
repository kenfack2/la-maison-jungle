import { useState, useEffect } from 'react';
import { ShoppingCart, Calendar, DollarSign, Package, Download } from 'lucide-react';

function Profil() {
  const [commandes, setCommandes] = useState([]);
  const [commandeSelectionnee, setCommandeSelectionnee] = useState(null);

  // Charger les commandes depuis le localStorage
  useEffect(() => {
    const commandesSauvegardees = JSON.parse(localStorage.getItem('commandes') || '[]');
    // Trier par date (plus récent en premier)
    const commandesTriees = commandesSauvegardees.sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );
    setCommandes(commandesTriees);
  }, []);

  // Regénérer le PDF pour une commande
// Fonction de conversion émoji -> symbole texte (identique)
const getSymboleTexte = (emoji) => {
  const correspondances = {
    '🌱': '🌱',
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
  return correspondances[emoji] || '🌱';
};

// Regénérer le PDF pour une commande
const regenererPDF = (commande) => {
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

  // Calculer le total de toutes les commandes
  const totalDepense = commandes.reduce((total, commande) => total + commande.total, 0);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête du profil */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">👤 Mon Profil</h1>
          <p className="text-gray-600 text-lg">
            Gérez vos informations personnelles et consultez votre historique d'achats
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{commandes.length}</h3>
            <p className="text-gray-600">Commandes passées</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="text-green-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {commandes.reduce((total, cmd) => total + cmd.nombreArticles, 0)}
            </h3>
            <p className="text-gray-600">Plantes achetées</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="text-orange-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{totalDepense}€</h3>
            <p className="text-gray-600">Total dépensé</p>
          </div>
        </div>

        {/* Historique des commandes */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
            <Calendar className="mr-3" size={28} />
            Historique des Commandes
          </h2>

          {commandes.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune commande</h3>
              <p className="text-gray-500">Vos commandes apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-4">
              {commandes.map((commande) => (
                <div
                  key={commande.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setCommandeSelectionnee(
                    commandeSelectionnee?.id === commande.id ? null : commande
                  )}
                >
                  {/* En-tête de la commande */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">
                        Commande #{commande.id}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        <Calendar size={14} className="inline mr-1" />
                        {new Date(commande.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-green-600">
                        {commande.total}€
                      </p>
                      <p className="text-gray-500 text-sm">
                        {commande.nombreArticles} article{commande.nombreArticles > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Détails de la commande (affichés si sélectionnée) */}
                  {commandeSelectionnee?.id === commande.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="font-semibold text-gray-800 mb-3">Détails de la commande :</h5>
                      <div className="space-y-3">
                        {commande.articles.map((article, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{article.forme}</span>
                              <div>
                                <p className="font-medium text-gray-800">{article.name}</p>
                                <p className="text-sm text-gray-600">{article.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{article.quantity} × {article.price}€</p>
                              <p className="text-green-600 font-bold">
                                {article.quantity * article.price}€
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bouton pour re-télécharger le PDF */}
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            regenererPDF(commande);
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
                        >
                          <Download size={16} />
                          <span>Télécharger la facture</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section informations personnelles */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6">📝 Informations Personnelles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="+33 1 23 45 67 89"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Votre adresse"
              />
            </div>
          </div>
          <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold">
            Sauvegarder les modifications
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profil;