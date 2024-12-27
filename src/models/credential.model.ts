import {userType} from "@/models/type.model";

const KEY = 'crendentials'
let ls:any=''


let crendentialModel:any={
    getUser:()=>{
        return userType
    },
    setUser:()=>{

    },
    logout:()=>{
    localStorage.removeItem("crendentials")
    localStorage.removeItem("addedUser")
    localStorage.removeItem("token")
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
        let value = ''
        let user:any = ls?.getItem(KEY)
        if (user) value = JSON.parse(user)
        return value
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
