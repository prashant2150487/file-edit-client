import type { JSX } from "react"
import { ROUTES } from "./routePaths"
import { Navigate } from "react-router-dom"
interface Props {
    children : JSX.Element
}
const ProtectedRoute = ({children}: Props) => {
    const isAutehticated = false
    if(!isAutehticated){
        return <Navigate to={ROUTES.LOGIN} />
    }
    return children
}
export default ProtectedRoute