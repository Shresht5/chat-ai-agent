import React from 'react'

const Loader = () => {
    return (
        <>
            <div className='flex items-center p-2'>
                <div className='circleAnimation'></div>
                <p className='pl-2 text-white font-stretch-75%'>Ai is sending ...</p>
            </div>
        </>
    )
}

export default Loader