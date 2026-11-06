import {Routes , Route } from 'react-router-dom'
import Home from './pages/home/Home'  
import SignIn from './pages/Auth/SignIn' 
import SignUp from './pages/Auth/SignUp' 
import DashboardLayout from './components/app/DashboardLayout'
import OverviewPage from './pages/dashboard/OverviewPage'
import { DogsPage, DogDetailsPage, DogCreatePage, DogEditPage } from './pages/dogs/DogsPages'
import { ReportsPage, ReportDetailsPage, CreateReportPage } from './pages/reports/ReportsPages'
import { VolunteersPage, VolunteerDetailsPage } from './pages/volunteers/VolunteersPages'
import ProfilePage from './pages/profile/ProfilePage'
import RabiesAwarenessPage from './pages/awareness/RabiesAwarenessPage'
import './dashboard.css'

export default function App(){
    return (
        <Routes>
            <Route path='/' element={<Home/>}> </Route> 
            <Route path='/signin' element={<SignIn/>}></Route>
            <Route path='/signup' element={<SignUp/>}></Route>
            <Route element={<DashboardLayout/>}>
                <Route path='/dashboard' element={<OverviewPage/>}/>
                <Route path='/dogs' element={<DogsPage/>}/>
                <Route path='/dogs/create' element={<DogCreatePage/>}/>
                <Route path='/dogs/:id' element={<DogDetailsPage/>}/>
                <Route path='/dogs/:id/edit' element={<DogEditPage/>}/>
                <Route path='/reports' element={<ReportsPage/>}/>
                <Route path='/reports/create' element={<CreateReportPage/>}/>
                <Route path='/reports/:id' element={<ReportDetailsPage/>}/>
                <Route path='/volunteers' element={<VolunteersPage/>}/>
                <Route path='/volunteers/:id' element={<VolunteerDetailsPage/>}/>
                <Route path='/profile' element={<ProfilePage/>}/>
                <Route path='/awareness' element={<RabiesAwarenessPage/>}/>
            </Route>
        </Routes>
    )
}
