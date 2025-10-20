import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function MenuBurger({ onNavigate }) {
	const [isOpen, setIsOpen] = useState(false)

	const handleNavigate = (page) => {
		onNavigate(page) // 👈 change la page dans App.jsx
		setIsOpen(false) // ferme le menu
	}

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="p-3 text-gray-800 focus:outline-none"
			>
				{isOpen ? <X size={28} /> : <Menu size={28} />}
			</button>

			{isOpen && (
				<div className="absolute left-0 top-12 bg-white shadow-lg rounded-lg w-48 border border-gray-200 z-50">
					<ul className="flex flex-col text-gray-800">
						<li
							className="p-3 hover:bg-gray-100 cursor-pointer"
							onClick={() => handleNavigate('dashboard')}
						>
							Accueil
						</li>
						<li
							className="p-3 hover:bg-gray-100 cursor-pointer"
							onClick={() => handleNavigate('shop')}
						>
							Boutique
						</li>
						<li
							className="p-3 hover:bg-gray-100 cursor-pointer"
							onClick={() => handleNavigate('profil')}
						>
							Profil
						</li>
					</ul>
				</div>
			)}
		</div>
	)
}
