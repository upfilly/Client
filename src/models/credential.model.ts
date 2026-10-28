import {userType} from "@/models/type.model";

const KEY = 'crendentials'
let ls:any=''


let crendentialModel:any={
    getUser:()=>{
        return null
    },
    setUser:()=>{

    },
    logout:()=>{
      if (typeof window !== 'undefined') {
        localStorage.removeItem("crendentials")
        localStorage.removeItem("addedUser")
        localStorage.removeItem("token")
      }
    }
}

if (typeof window !== 'undefined') {
    ls = localStorage

    const setUser = (p:any) => {
        if (p) {
            ls?.setItem(KEY, JSON.stringify(p))
        } else {
            ls?.removeItem(KEY)
        }
    }
    
    const getUser = () => {
        try {
            let user: any = ls?.getItem(KEY)
            if (user) {
                const parsed = JSON.parse(user)
                if (parsed && (parsed.id || parsed._id)) {
                    return parsed
                }
            }
        } catch (e) {
            console.error('Failed to parse user credentials', e)
        }
        return null
    }
    
    const logout=()=>{
        ls?.removeItem(KEY)
        ls?.removeItem('token')
        localStorage.removeItem("crendentials")
        localStorage.removeItem("addedUser")
        localStorage.removeItem("token")
    }
    crendentialModel={setUser,getUser,logout}
  }




export default crendentialModel;
