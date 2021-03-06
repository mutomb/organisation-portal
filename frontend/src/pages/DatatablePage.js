import React, { Component } from "react";
import axios from 'axios';
import { MDBDataTable, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from "mdbreact";
import SectionContainer from "../components/sectionContainer";

export class DatatablePage extends Component {

  //function testClickEvent(param) {
    //console.log(param);
  //}
  constructor(props){
    super(props);
    this.state={

      apiResponse:"",
      organisation:["jhgjgh","hgjhg","hjgh"],
      socialIssue:this.props.name,
      location:'',
      events : [],
      data : {
        columns: [
          {
            label: "Social Issue",
            field: "name",
            width: 150,
            attributes: {
              "aria-controls": "DataTable",
              "aria-label": "Name"
            }
          },
          {
            label: "Orginisation",
            field: "position",
            width: 270
          },
          {
            label: "Location",
            field: "office",
            width: 200
          }
          
        ],
        rows: [
          {
           
           
          }
        ]
      }
    };
}

componentDidMount(){

  axios.get('http://localhost:5000/organisation/'+this.state.socialIssue,{
  })
      .then(res=>{
          
          //this.setState({data:res.data});
          for( var i=0;i< res.data.length ; i++) {
            res.data[i].socialissues = [this.state.socialIssue];
          }
          
          this.setState({data:{columns:this.state.data.columns,rows:res.data}});
          
        
         
      })
      .catch(err=>{
          console.log('Error: anme '+err)
  })
}


  

 
render() {
  return (
    <MDBContainer className="mt-3">
      
      <MDBRow className="py-3">
        <MDBCol md="12">
          <SectionContainer  noBorder>
            <MDBCard>
              <MDBCardBody>
                <MDBDataTable
                  striped
                  bordered
                  hover
                  entriesOptions={[5, 20, 25]}
                  entries={5}
                  pagesAmount={4}
                  data={this.state.data}
                />
              </MDBCardBody>
            </MDBCard>
          </SectionContainer>
        </MDBCol>
      </MDBRow>

     
    </MDBContainer>
          );
        }
    
    }

export default DatatablePage;
