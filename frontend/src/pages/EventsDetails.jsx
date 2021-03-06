/** 
 * Created by: Jeanluc
 * Handles the View/UI for a  company that is logged in to update/add an Event's detail 
 */
import React from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBInput, MDBJumbotron, MDBIcon, MDBAnimation,MDBListGroup,MDBListGroupItem,MDBScrollbar
} from "mdbreact";
import SectionContainer from "../components/sectionContainer";
import { getEvents, addEvent} from './UserFunctions';
import './scrollbar.css';
import './style.css';
import {uploadEventPicture,deleteEvent} from './UserFunctions';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
class EventDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventPicStyle: null,
      owner: props.email,
      title:"",
      where: "",
      when: new Date(),
      what: "",
      eventPic: "",
      titles: [],
      wheres: [],
      whens: [],
      whats: [],
      eventPics:[],
      selectedImage:null,
      scrollContainerStyle: { width: "100%", maxHeight: "31.25em" }
    };
  }
/** aid refreshing of image type of states */
  resetEventPicture=()=>{
    this.setState({ eventPic:""})
    
  }
/**  handles input inputs*/
  addEventPicture = event => {
    this.setState({ 
      eventPic: URL.createObjectURL(event.target.files[0]), 
      eventPicStyle: { opacity: 1},
      selectedImage: event.target.files[0]
    })
  }
/**handles date picker changes */
  handleDateChange = (date) => {
    this.setState({
      when: date
    });
  };
  /**handles input changes for text inputs */
  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  };
  /**aids when state changes */
  resetEventList=()=>{
    this.setState({
      titles: [],
      wheres: [],
      whens: [],
      whats: [],
    })
  }
/**send uploaded event data to the controller */
  handleUpload = () => {
    let event = {
      owner: this.state.owner,
      title: this.state.title,
      when: this.state.when,
      where: this.state.where,
      what: this.state.what
    }
    addEvent(event)
      .then(res => {
        getEvents(this.state.owner)
        .then(events => {
          this.resetEventList();
          this.uploadImage(this.state.selectedImage)
          this.setState({
            titles: [...this.state.titles,...events.map(event=>event.title)],
            wheres: [...this.state.wheres,...events.map(event=>event.where)],
            whens: [...this.state.whens,...events.map(event=>event.when)],
            whats: [...this.state.whats,...events.map(event=>event.what)],
            eventPics:[...this.state.eventPics,...events.map(event=>event.imageData)]
          })
        })
        .catch(err => console.log('error'));
      })
      .catch(err => console.log(err));
  }
/** send uploded image to controller */
  uploadImage=(image)=> {
    let imageFormObj = new FormData();
    imageFormObj.append("imageName", this.state.owner+this.state.title); 
    imageFormObj.append("imageData", image);
    imageFormObj.append('owner', this.state.owner);
    imageFormObj.append('title',this.state.title);
    uploadEventPicture(imageFormObj)
          .then(data=>{
            if(data.success){
              this.resetEventPicture();
              this.setState({ eventPic:`http://localhost:5000/${data.imageData}?${Date.now}`, eventPicStyle: {opacity: 1, border:'1px solid red', color:''} })
              alert("Image has been successfully uploaded using multer");
            }
            else{
              alert("Error occured while uploading the image");
            }
          })

    
  } 

/** stores eventlist
 * to be displayed on the side cards
 */
  displayEvent=(i)=>{
    this.setState({
      title:this.state.titles[i],
      where:this.state.wheres[i],
      when:this.state.whens[i],
      what:this.state.whats[i],
      eventPic:`http://localhost:5000/${this.state.eventPics[i]}?${Date.now}`,
      eventPicStyle:{opacity: 1}
    })
    console.log(this.state.when)
  }

  preventDefault=(e)=>{e.preventDefault();}

  componentWillMount() {
/**
 * calls the controller that gets existing events when the organisation logs in
 */
    if(this.state.owner){
      getEvents(this.state.owner)
        .then(events => {
          this.setState({
            titles: [...this.state.titles,...events.map(event=>event.title)],
            wheres: [...this.state.wheres,...events.map(event=>event.where)],
            whens: [...this.state.whens,...events.map(event=>new Date(event.when))],
            whats: [...this.state.whats,...events.map(event=>event.what)],
            eventPics:[...this.state.eventPics,...events.map(event=>event.imageData)]
          })
        })
        .catch(err => console.log('error')); 
    }
  }
  
  render() {
    return (
      <>
        <MDBRow>

          <MDBCol md='5'>
            <MDBAnimation type="slideInLeft" duration="500ms">
              <MDBContainer>
                <MDBRow>
                  <MDBCol md="12" className="mt-3 mx-auto">
                    <MDBJumbotron>
                      <h3 className="text-center mt-3 grey-text">
                        <MDBIcon icon="table" className="green-text mr-2 " />
                        Click on event to view
                      </h3>
                      <ul className="list-unstyled example-components-list">
                      <div className="scrollbar scrollbar-primary  mt-5 mx-auto" style={this.state.scrollContainerStyle}> 
                          {   
                            this.state.titles.map((event,index)=>{
                               return(
                                <div className="eventside">
                                  <MDBListGroup>
                                  <MDBListGroupItem 
                                  style={{backgroundColor:'#33b838',border:'1px solid white'}}
                                  className='btn'
                                  active href="#" key={index} 
                                  onClick={(e)=>{this.displayEvent(index); this.preventDefault(e)}}
                                  >
                                    <div className='p'>
                                    <div className="d-flex w-100 justify-content-between">
                                      <h5 className="mb-1">{this.state.titles[index]}</h5>
                                      <small>posted today</small>
                                    </div>
                                    <p className="mb-1">{this.state.whats[index]}</p>
                                    <small>{this.state.wheres[index]+" "+this.state.whens[index]}</small>
                                    </div>
                                  </MDBListGroupItem>
                                  </MDBListGroup> 
                                  </div>
                               )   
                            })
                          } 
                      </div>
                      </ul>
                    </MDBJumbotron>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </MDBAnimation>
          </MDBCol>

          <MDBCol md="7" >
            <h1 className="text-center mt-3 grey-text">Edit/Add Your Events</h1>
            <MDBRow >
              <MDBCol md="12">
                <MDBInput value={this.state.title} label="Title Of Your Event" onChange={this.changeHandler} name='title' />
              </MDBCol>
            </MDBRow>
            <MDBRow >
              <MDBCol md="12">
                <MDBInput value={this.state.where} label="Where is the event going to take place?" onChange={this.changeHandler} name='where' />
              </MDBCol>
            </MDBRow>

            <MDBRow>
              <MDBCol md="12">
              <span style={{color:'grey', marginRight:10}}>When is the event going to take place?</span>
                <DatePicker
                  selected={this.state.when}
                  onChange={this.handleDateChange}
                /> 
                
              </MDBCol>
            </MDBRow>

            <MDBRow>
              <MDBCol md="12">
                <MDBInput value={this.state.what} type="textarea" label="Describe your event" rows="2" onChange={this.changeHandler} name='what' />
              </MDBCol>
            </MDBRow>
 
            <MDBRow>
              <MDBCol md="12">
                <SectionContainer header="Event Picture">
                  <div class="file-field">
                    <div class="d-flex justify-content-center box1">
                        <img src={this.state.eventPic}
                          style={this.state.eventPicStyle || { opacity: 0, position: "absolute", pointerEvents: "none" }}
                          class="z-depth-1-half avatar-pic"
                          alt="event picture"

                        />
                        <button class="btn1" 
                        onClick={()=>this.fileInput.click()}
                        >
                          ADD
                        </button>
                    </div>
                  </div>
                  <div class="file-field">
                    <div class="d-flex justify-content-center">
                    
                      <form  method="post">
                        <input 
                          ref={fileInput => this.fileInput = fileInput}
                          style={{opacity:0,pointerEvents:"none", width:10}} 
                          type="file"
                          onChange={this.addEventPicture}
                        />
                    </form>
                    </div>
                  </div>
                </SectionContainer>
              </MDBCol>
            </MDBRow>

            <MDBRow>
              <MDBCol md="4">
                <MDBBtn onClick={this.handleUpload} className="btn btn-green">Upload</MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>           
        
      </>
    )
  }

}
export default EventDetails;