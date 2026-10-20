import {Routes , Route } from 'react-router-dom'
import Home from './pages/home/Home'  
import SignIn from './pages/Auth/SignIn' 
import SignUp from './pages/Auth/SignUp' 

export default function App(){
    return (
        <Routes>
            <Route path='/' element={<Home/>}> </Route> 
            <Route path='/signin' element={<SignIn/>}></Route>
            <Route path='/signup' element={<SignUp/>}></Route>
        </Routes>
    )
}