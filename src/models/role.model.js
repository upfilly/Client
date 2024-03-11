const list=[
    {id:'brand',name:'Brand'},
    {id:'influencers',name:'Influencer'}
]

const name=(r)=>{
    let ext=list.find(itm=>itm.id==r)
    return ext?ext.name:'--'
}

const roleModel={list,name}
export default roleModel