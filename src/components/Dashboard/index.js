import { Component } from "react"
import Cookies from 'js-cookie'
import { Link } from "react-router-dom"

import './index.css'

class Dashboard extends Component{
  state ={
    dashboard:null,
    loading:true,
    er:'',
    search:'',
    sort:'',
    curr_page:1,
  }
  componentDidMount(){
    this.dashboardData()
  }
  dashboardData=async ()=>{
    const {search,sort}=this.state
    const token=Cookies.get('jwt_token')
    let url="https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals"
    const params=[]

    if(search){
 params.push(`search=${search}`)  
  }
  if (sort){
    params.push(`sort=${sort}`)
  }
  if (params.length>0){
    url+=`?${params.join('&')}`

  }

  const options={
    method:'GET',
    headers:{
      Authorization:`Bearer ${token}`,

    },
  }
  try{
    const response=await fetch(url,options)
    const data=await response.json()
    if (response.ok){
      this.setState({
        dashboardData:data.data,
        loading:false,

      })
    }else{
      this.setState({
        er:data.message,
        loading:false,
      })
    }
  }
catch(er){
  this.setState({
    
      er:'Something went Wrong',
      loading:false,
   
  })
}
  }
  


  searchChange=event=>{
   this.setState(
  {
    search: event.target.value,
    curr_page: 1,
  },
  this.dashboardData,
)
  }
  changeSort=event=>{
    this.setState(
      {
        sort:event.target.value,
      },
      this.dashboardData,
    )
  }

  logout=()=>{
    Cookies.remove('jwt_token')
    window.location.href='/login'
  }
  copyText=value=>{
    navigator.clipboard.writeText(value)
  }

  ChangePage=page=>{
    this.setState({
      curr_page:page,

    })
  }

  ren_Overview=metrics=>(
    <div className="overview-grid">
      {
        metrics.map(item=>(
          <div key={item.id} className="overview-card">
            <h2>{item.value}</h2>
            <p>{item.label}</p>
            </div>
        ))
      }
    </div>
  )
  render(){
  const{  dashboardData,
    loading,
    er,
    curr_page,
  }=this.state
  if (loading){
    return <h1>Loading...</h1>
  }
  if (er){
    return <h1>{er}</h1>
  }

 const {
  metrics,
  serviceSummary,
  referral,
  referrals,
} = dashboardData

  const rowPerpage=10

  const start=
  (curr_page-1)*rowPerpage

  const end = start + rowPerpage

  const curr_rows=referrals.slice(
    start,
    end,
  )

  const totalPages=Math.ceil(
    referrals.length/rowPerpage,
  )
  return(
    <div className="dash_cont">
    <nav className="navbar">
    <h1 className="logo">
            Go Business
          </h1>
          <div className="nav-right">
          <Link to='/' className="link-home">
          Home 
          </Link>

          <button type="button" className="logout-btn" onClick={this.logout}>Log Out</button>
          </div>
          </nav>

    <div className="cont-2">
      <h1 className="dash-heading">
        Referral Dashboard
      </h1>
      <p className="dash-para">
        Track your referrals, earnings and partner activity in one place.
      </p>
      <section className="section">
        <h3>Overview</h3>
        {this.ren_Overview(metrics)}
      </section>

      <section className="section">
        <h3>Service Summary</h3>
        <div className="sum-grid">
          <div className="summ-card">
            <p>SERVICE</p>
            <h4>
              {
                serviceSummary.service}
            </h4>

          </div>
          <div className="summ-card">
            <p>YOUR REFFERALS</p>
            <h4>{
            serviceSummary.yourReferrals
            }</h4>

          </div>

           <div className="summ-card">
            <p>ACTIVE REFFERALS</p>
            <h4>{
            serviceSummary.activeReferrals
            }</h4>

          </div>

           <div className="summ-card">
            <p>TOTAL REF. EARNINGS</p>
            <h4>{
            serviceSummary.totalRefEarnings
            }</h4>

          </div>
        </div>



      </section>

      <section className="section">
        <h3>Refer friends and earn moree</h3>
        <div className="refer-grid">
          <div className="copy-box">
            <input type='text' readOnly value={referral.link}/>
            <button type='button' onClick={()=>this.copyText(
              referral.link,
            )}>copyText</button>
          </div>
          <div className="copy-box">
            <input type="text" readOnly value={referral.code}/>
            <button type="button" onClick={()=> this.copyText(referral.code,)}>
              Copy
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="table-headder">
          <h3>All Referrals</h3>
          <div className="controls">
            <input type='search' placeholder="Name or Service..." onChange={this.searchChange}/>
            <select onChange={this.changeSort}>
              <option value='desc'>
                Newest First
                </option>
                <option value='asc'>
                  Oldest First
                  </option>            </select>

          </div>


        </div>

        
      </section>

    </div>
   </div>


  )
}
}
export default Dashboard