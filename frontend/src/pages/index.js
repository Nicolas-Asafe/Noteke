import Router from "next/router";
function Home() {
  return (
    <>
      <div className="ContentStandart ContentCenterIndexHome  AnimaAppear1">
        <form>
          <h1>Welcome!</h1>
          <button className="ContentStandart" onClick={()=>{
            Router.push('/Register')
          }}>Register</button>
          <button className="ContentStandart" onClick={()=>{
            Router.push('/Login')
          }}>Login</button>
        </form>
      </div>
    </>
  );
}
export default Home