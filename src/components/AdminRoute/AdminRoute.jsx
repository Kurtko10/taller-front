import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { amIAdmin } from "../../app/slices/userSlice"


export const AdminRoute = ({Component}) => {

    const isAdmin = useSelector(amIAdmin)

    return isAdmin ? <Component /> : <Navigate to="/" /> 
}