import logo from '../assets/logo.png'
import Recommendation from './Recommendation'

function Banner() {

	const title = 'La maison jungle'
	return <div >
		<div className='text-black text-right p-8 font-bold flex justify-end flex-row items-center'>
			<img src={logo} alt='La maison jungle' className='h-11 w-11' />
			<h1 className='pl-8'>{title}</h1>
		</div>
		<Recommendation/>
	</div>
}


export default Banner
