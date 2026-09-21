import { useEffect, useState } from "react";

export const useAuth = () => {
    const [token, setToken] = useState<string>("")
    const [isLogin, setIsLogin] = useState<boolean>(false)
    useEffect(() => {
        const tokenFromLocal = localStorage.getItem("authToken")
        if (tokenFromLocal && tokenFromLocal !== undefined) {
            setToken(tokenFromLocal)
            setIsLogin(true)
        }
    }, [])

    return { token, isLogin }
}
