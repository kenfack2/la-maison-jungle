import React from 'react'

const Recommendation = () => {
  const currentMonth = new Date().getMonth()
	const isSprint = currentMonth >= 2 && currentMonth <= 5
	console.log(currentMonth)
  if(!isSprint){
    return <div className='text-black text-center p-[32px] border-b-3 border-black text-[20px]'>C'est pas le moment de rempoter</div>
  }
  return (
    <div className='text-black text-center p-[32px] border-b-3 border-black text-[20px]'>C'est le momment de rempoter</div>
  )
}

export default Recommendation
