import crendentialModel from "@/models/credential.model"
import environment from "../environment"
const user=crendentialModel.getUser()

const permission=(p)=>{
    if (user && user?.permission_detail && p) {
        return user?.permission_detail[p]
    }else{
        return false
    }
}

const isTranslatePage = () => {
    let value = false
    let url = window.location.href
    if (url.includes('translation')) value = true
    return value
}

const generatekeysArr = (arr, key = 'typeofresult') => {
    let keys = {}
    if (!arr) return { keys, arr: [] }
    arr.map(itm => {
        if (keys[itm[key]]) {
            keys[itm[key]].push(itm)
        } else {
            keys[itm[key]] = [itm]
        }
    })
    return {
        keys, arr: Object.keys(keys).map(itm => {
            return { key: itm, value: keys[itm] }
        })
    }
}

const userImg = (img) => {
    let value = '/assets/img/person.jpg'
    if (img) value = environment.api + img
    return value
}

const noImg = (img,modal='blogs') => {
    let value = '/assets/img/placeholder.png'
    if (img) value = environment.api + img
    return value
}

const getPrams = (p) => {
    const params = new URLSearchParams(window.location.search)
    return params.get(p)
}


const isNumber = (e) => {
    let key = e.target;
    let maxlength = key.maxLength ? key.maxLength : 1;

    let max = Number(key.max ? key.max : key.value);
    if (Number(key.value) > max) key.value = max;

    // let min = key.min;
    // if (min && Number(key.value)<Number(min)) key.value = min;

    if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
    key.value = key.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');

    return key.value
}

const isRatio = (e) => {
    let key = e.target;
    let maxlength = key.maxLength ? key.maxLength : 1;

    let max = Number(key.max ? key.max : key.value);
    if (Number(key.value) > max) key.value = max;

    // let min = key.min;
    // if (min && Number(key.value)<Number(min)) key.value = min;

    if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
    key.value = key.value.replace(/[^0-9.>]/g, '').replace(/(\..*?)\..*/g, '$1');

    return key.value
}

const find = (arr, value, key = 'key') => {
    if (Array.isArray(arr)) {
        let ext = arr.find(itm => itm[key] == value);
        return ext;
    } else {
        return null;
    }
}



/* ###################### Form Methods #########################  */

// get Single field error
const getError = (key, fvalue, formValidation) => {
    let ext = find(formValidation, key)
    let res = matchError(ext, fvalue)
    return res
}

const emailRequiredFor = (role) => {
    let value = false
    if (role == 'Clinic Admin' || role == 'Counsellor' || role == 'Owner' || role == 'admin') value = true
    return value
}


const validateUsername = (val) => {
    return /^(?=[a-zA-Z0-9._-]{8,20}$)(?!.*[_.-]{2})[^_.-].*[^_.-]$/.test(val);
}

const dialMatch = (val) => {
    let value = false
    value = val.match(/^(?=.*[0-9])(?=.*[+])[0-9+]{2,5}$/)
    return value
}
const emailvalidation = (val) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) {
        return true
    }
    return false
}
// match errors for fields
const matchError = (ext, fValue) => {

    let invalid = false
    let kValue = fValue[ext.key]
    let value = { minLength: false, maxLength: false, confirmMatch: false ,required:false}
    if (ext.required) {
        if (!kValue || (!kValue.length && typeof kValue!='object')){
            invalid = true
        }
    }
    if (ext.minLength && kValue) {
        if (kValue.length < ext.minLength) value.minLength = true
    }
    if (ext.maxLength && kValue) {
        if (kValue.length > ext.maxLength) value.maxLength = true
    }
    if (ext.dialCode && kValue) {
        if (dialMatch(kValue)) {
            kValue.indexOf("+");
            if (kValue.indexOf("+") != 0) {
                value.dialCode = true
            }

        } else {
            value.dialCode = true
        }
    }

    if (ext.username && kValue) {
        if (!validateUsername(kValue)) value.username = true
    }

    if (ext.confirmMatch && kValue) {
        if (fValue[ext.confirmMatch[0]] != fValue[ext.confirmMatch[1]]) value.confirmMatch = true
    }

    let vArr = Object.keys(value)
    vArr.map(itm => {
        if (value[itm]) invalid = true
    })

    let res = { invalid: invalid, err: value }
    return res
}

// get form error (All Fields)
const getFormError = (formValidation, fvalue) => {
    let invalid = false
    formValidation.map(ext => {
        if (matchError(ext, fvalue).invalid) {
            invalid = true
        }
    })

    return invalid
}

/* ###################### Form Methods end #########################  */

const route=(route)=>{
    localStorage.setItem('route',route)
    let el=document.getElementById('routerDiv')
    setTimeout(()=>{
        if(el) el.click()
    })
}

function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


const methodModel = {permission, capitalizeFirstLetter,userImg,route, isNumber, isRatio, find, getError, getFormError, getPrams, emailRequiredFor, emailvalidation, noImg, isTranslatePage, generatekeysArr }
export default methodModel