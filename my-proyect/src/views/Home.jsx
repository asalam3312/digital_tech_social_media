import React, { useContext } from 'react'
import { Context } from '../js/store/appContext'

const Home = () => {
    const { store, actions } = useContext(Context)
  return (
    <div>Home
        <h5>Personas en global:{store.personas}</h5>
    </div>
  )
}

export default Home