import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Leaf, BarChart3, Users, ChevronLeft, ChevronRight, Target, Globe, Heart, Shield } from "lucide-react";

export default function DashboardAccueil() {
  // URL de base pour les images
  const baseUrl = process.env.PUBLIC_URL || '';

  // Références pour les animations
  const statsSectionRef = useRef(null);
  const carouselSectionRef = useRef(null);
  const objectivesSectionRef = useRef(null);

  // État pour le carousel des plantes
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Images de plantes pour le carousel - CHEMINS CORRIGÉS
  const plantImages = [
    `${baseUrl}/images/plantes/plante1.jpg`,
    `${baseUrl}/images/plantes/plante2.jpg`,
    `${baseUrl}/images/plantes/plante3.jpg`,
    `${baseUrl}/images/plantes/plante4.jpg`,
    `${baseUrl}/images/plantes/plante5.jpg`,
    `${baseUrl}/images/plantes/plante6.jpg`
  ];

  // Noms des plantes
  const plantNames = [
    "Monstera Deliciosa",
    "Ficus Lyrata",
    "Pothos Doré",
    "Sansevieria",
    "Calathea",
    "Cactus"
  ];

  // État pour le carousel des objectifs
  const [currentObjectiveIndex, setCurrentObjectiveIndex] = useState(0);

  // Objectifs de l'entreprise
  const objectives = [
    {
      icon: <Globe size={48} className="text-green-600" />,
      title: "Durabilité Écologique",
      description: "Réduction de notre empreinte carbone de 50% d'ici 2025 grâce à des pratiques agricoles responsables.",
      progress: 65
    },
    {
      icon: <Heart size={48} className="text-green-600" />,
      title: "Communauté Locale",
      description: "Soutenir 100 producteurs locaux et créer 50 emplois verts dans notre région.",
      progress: 40
    },
    {
      icon: <Target size={48} className="text-green-600" />,
      title: "Innovation Verte",
      description: "Développer 10 nouvelles espèces de plantes adaptées au changement climatique.",
      progress: 25
    },
    {
      icon: <Shield size={48} className="text-green-600" />,
      title: "Qualité Premium",
      description: "Garantir 99% de satisfaction client avec nos plantes certifiées biologiques.",
      progress: 85
    }
  ];

  // Défilement automatique des plantes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === plantImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [plantImages.length]);

  // Défilement automatique des objectifs
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentObjectiveIndex((prevIndex) =>
        prevIndex === objectives.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [objectives.length]);

  // Animation au scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, { threshold: 0.1 });

    const sections = [
      statsSectionRef.current,
      carouselSectionRef.current,
      objectivesSectionRef.current
    ].filter(Boolean);

    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  // Navigation
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === plantImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? plantImages.length - 1 : prevIndex - 1
    );
  };

  const nextObjective = () => {
    setCurrentObjectiveIndex((prevIndex) =>
      prevIndex === objectives.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevObjective = () => {
    setCurrentObjectiveIndex((prevIndex) =>
      prevIndex === 0 ? objectives.length - 1 : prevIndex - 1
    );
  };

  // Fonction pour obtenir les indices des images à afficher
  const getVisibleImages = () => {
    const images = [];
    for (let i = -1; i <= 1; i++) {
      let index = currentImageIndex + i;
      if (index < 0) index = plantImages.length - 1;
      if (index >= plantImages.length) index = 0;
      images.push({
        index,
        src: plantImages[index],
        name: plantNames[index],
        isCenter: i === 0
      });
    }
    return images;
  };

  const visibleImages = getVisibleImages();

  // Fallback SVG pour les images qui ne chargent pas
  const fallbackSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%234ade80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='48' fill='white'%3E🌱%3C/text%3E%3C/svg%3E";

  return (
    <div className="min-h-screen bg-green-50">
      {/* En-tête avec z-index réduit pour laisser passer le menu */}
      <header className="sticky top-0 z-30 bg-green-50/95 backdrop-blur-sm border-b border-green-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-center items-center">
          <h1 className="text-3xl font-bold text-green-800">
            🌿 La maison jungle
          </h1>
        </div>
      </header>

      <div className="space-y-20 py-10">
        {/* SECTION 1 : Cartes de statistiques */}
        <section
          ref={statsSectionRef}
          className="opacity-0 transform translate-y-10 transition-all duration-700"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white shadow-2xl rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-bold text-green-800 mb-6">
                Tableau de Bord 📊
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Surveillez les performances de votre boutique de plantes en temps réel
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card
                  icon={<Leaf size={32} className="text-green-600" />}
                  title="Plantes"
                  value="128"
                  description="Plantes disponibles"
                />
                <Card
                  icon={<ShoppingCart size={32} className="text-green-600" />}
                  title="Commandes"
                  value="56"
                  description="Commandes en cours"
                />
                <Card
                  icon={<Users size={32} className="text-green-600" />}
                  title="Clients"
                  value="34"
                  description="Clients fidèles"
                />
                <Card
                  icon={<BarChart3 size={32} className="text-green-600" />}
                  title="Revenus"
                  value="1 250 €"
                  description="Ce mois-ci"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 : Carousel des plantes */}
        <section
          ref={carouselSectionRef}
          className="opacity-0 transform translate-y-10 transition-all duration-700 delay-200"
        >
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-3xl font-bold text-green-800 mb-2 text-center">
              Nos Plantes en Vedette 🌸
            </h3>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Découvrez nos meilleures plantes soigneusement sélectionnées
            </p>

            <div className="relative bg-white rounded-3xl shadow-2xl p-8">
              {/* Conteneur du carousel avec 3 images */}
              <div className="relative">
                <div className="flex items-center justify-center space-x-4 md:space-x-8">
                  {visibleImages.map((image, positionIndex) => (
                    <div
                      key={image.index}
                      className={`flex flex-col items-center transition-all duration-500 ${
                        image.isCenter
                          ? 'z-10 scale-110'
                          : 'scale-90 opacity-70'
                      }`}
                    >
                      {/* Image */}
                      <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${
                        image.isCenter
                          ? 'w-72 h-72 md:w-96 md:h-96 border-4 border-green-500'
                          : 'w-56 h-56 md:w-72 md:h-72 border-2 border-green-300'
                      }`}>
                        <img
                          src={image.src}
                          alt={image.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = fallbackSvg;
                          }}
                        />

                        {/* Overlay pour l'image centrale */}
                        {image.isCenter && (
                          <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent flex items-end">
                            <div className="p-6 text-white w-full text-center">
                              <span className="text-xl font-bold block mb-2">⭐ Produit du moment</span>
                              <span className="text-lg">Prix spécial : 24,99 €</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Nom de la plante */}
                      <div className={`mt-6 text-center ${
                        image.isCenter ? 'scale-110' : 'scale-90'
                      } transition-transform duration-500`}>
                        <p className={`font-bold ${
                          image.isCenter
                            ? 'text-green-800 text-2xl'
                            : 'text-green-600 text-xl'
                        }`}>
                          {image.name}
                        </p>
                        {image.isCenter && (
                          <p className="text-green-600 text-lg mt-2 font-semibold">
                            Livraison gratuite
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Boutons de navigation */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-green-800 rounded-full p-4 shadow-2xl transition-all z-20 hover:scale-110"
                >
                  <ChevronLeft size={32} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-green-800 rounded-full p-4 shadow-2xl transition-all z-20 hover:scale-110"
                >
                  <ChevronRight size={32} />
                </button>
              </div>

              {/* Indicateurs de position */}
              <div className="flex justify-center mt-12 space-x-4">
                {plantImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-5 h-5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-green-600 scale-125'
                        : 'bg-green-300 hover:bg-green-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 : Carousel des objectifs */}
        <section
          ref={objectivesSectionRef}
          className="opacity-0 transform translate-y-10 transition-all duration-700 delay-400"
        >
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-3xl font-bold text-green-800 mb-2 text-center">
              Nos Objectifs Durables 🎯
            </h3>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Ensemble, construisons un avenir plus vert et responsable
            </p>

            <div className="relative bg-white rounded-3xl shadow-2xl p-8">
              <div className="max-w-4xl mx-auto">
                {/* Objectif actuel */}
                <div className="text-center transition-all duration-500">
                  <div className="flex justify-center mb-6">
                    {objectives[currentObjectiveIndex].icon}
                  </div>
                  <h4 className="text-2xl font-bold text-green-800 mb-4">
                    {objectives[currentObjectiveIndex].title}
                  </h4>
                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    {objectives[currentObjectiveIndex].description}
                  </p>

                  {/* Barre de progression */}
                  <div className="max-w-2xl mx-auto mb-8">
                    <div className="flex justify-between text-sm text-green-700 mb-2">
                      <span>Progression</span>
                      <span>{objectives[currentObjectiveIndex].progress}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-4">
                      <div
                        className="bg-green-600 h-4 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${objectives[currentObjectiveIndex].progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Boutons de navigation */}
                <div className="flex justify-center space-x-6 mt-8">
                  <button
                    onClick={prevObjective}
                    className="bg-green-600 text-white rounded-full p-4 shadow-lg transition-all hover:bg-green-700 hover:scale-110"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Indicateurs des objectifs */}
                  <div className="flex items-center space-x-3">
                    {objectives.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentObjectiveIndex(index)}
                        className={`w-4 h-4 rounded-full transition-all ${
                          index === currentObjectiveIndex
                            ? 'bg-green-600 scale-125'
                            : 'bg-green-300 hover:bg-green-400'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextObjective}
                    className="bg-green-600 text-white rounded-full p-4 shadow-lg transition-all hover:bg-green-700 hover:scale-110"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Liste de tous les objectifs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  {objectives.map((objective, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                        index === currentObjectiveIndex
                          ? 'border-green-500 bg-green-50 scale-105 shadow-lg'
                          : 'border-green-200 bg-white hover:border-green-300'
                      }`}
                      onClick={() => setCurrentObjectiveIndex(index)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          index === currentObjectiveIndex ? 'bg-green-100' : 'bg-green-50'
                        }`}>
                          {React.cloneElement(objective.icon, {
                            size: 24,
                            className: index === currentObjectiveIndex ? 'text-green-700' : 'text-green-600'
                          })}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-green-800">{objective.title}</h5>
                          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${objective.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-green-700 mt-1 block">
                            {objective.progress}% complété
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Pied de page */}
      <footer className="bg-green-800 text-white py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-lg">
            © {new Date().getFullYear()} GreenStore — Tous droits réservés.
          </p>
          <p className="text-green-200 mt-2">
            Cultivons ensemble un avenir plus vert 🌍
          </p>
        </div>
      </footer>
    </div>
  );
}

/* Composant de carte */
function Card({ icon, title, value, description }) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-200">
      <div className="flex items-center justify-center mb-6">
        <div className="p-4 bg-white rounded-2xl shadow-inner">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-green-800 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-green-700 mb-2">{value}</p>
      <p className="text-green-600">{description}</p>
    </div>
  );
}