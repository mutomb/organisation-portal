import React, { Component } from "react";
import axios from 'axios';
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBMask, MDBView, MDBContainer } from "mdbreact";
import SimpleCalendar from "./SimpleCalendar";

//import Calendar from "./calendar";


export class Events extends Component {

  constructor(props){
    super(props);
    this.state={
      apiResponse:"",
      events : []
    };
}

componentDidMount(){

  axios.get('http://localhost:5000/eventDetails',{
  })
      .then(res=>{
          this.setState({events:res.data});
         
      })
      .catch(err=>{
          console.log('Error: anme '+err)
  })
}
    
  
    render() {

        return (
            
            <MDBContainer>
              <MDBCol>
                <MDBRow>
                  
                  <MDBCol md="12" className="mt-4">
                    <h2 className="text-center my-5 font-weight-bold">
                      Events
                      </h2>
                  </MDBCol>
               </MDBRow>
            <MDBRow>

            <MDBCol>
              <MDBCard className="my-5 px-5 pb-5">
                <MDBCardBody>
                {
                    this.state.events.map((item, index) => {
                      return (
                <MDBRow>
                    <MDBCol lg="5" xl="4">
                      <MDBView hover className="rounded z-depth-1-half mb-lg-0 mb-4">
                        <img
                          className="img-fluid"
                          src={item.imageData}
                          alt=""
                        />
                        <a href="#!">
                          <MDBMask overlay="white-slight" />
                        </a>
                      </MDBView>
                    </MDBCol>
                    <MDBCol lg="7" xl="8">
                      <h3 className="font-weight-bold mb-3 p-0">
                        <strong>{item.title}</strong>
                      </h3>
                      <h4>Organisation: {item.owner}</h4>
                      <h4>Date: {item.when}</h4>
                      <h4>Location: {item.where}</h4>
                      <p className="dark-grey-text">
                      {item.what}
                      </p>
                      <hr className="my-5" />
                  </MDBCol>
                </MDBRow>
                

                )
              })
            }
                
               
              </MDBCardBody>      
            </MDBCard>
            </MDBCol>
            
            <MDBCol>
              <SimpleCalendar/>
            </MDBCol>

            </MDBRow>
           
            
            </MDBCol>
       
           
            </MDBContainer>
          );
    }

}



export default Events;