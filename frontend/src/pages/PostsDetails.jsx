/** 
 * Created by: Jeanluc
 * Handles the View/UI for a  company that is logged in to update/add an Post's detail 
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
import { getPosts, addPost } from './UserFunctions';
import './scrollbar.css'
import {uploadPostPicture} from './UserFunctions'
import './style.css';

class PostDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postPicStyle:null,
      owner: props.email,
      name: props.name,
      title:"",
      what: "",
      postPic:"",
      titles: [],
      whats: [],
      postPics:[],
      selectedImage:null,
      scrollContainerStyle: { width: "100%", maxHeight: "31.25em" }
    };
  }
/** aid refreshing of image type of states */
  resetPostPicture=()=>{
    this.setState({ postPic:""})
  }
/**  handles input inputs*/
  addPostPicture=event =>{
    this.setState({postPic:URL.createObjectURL(event.target.files[0]),
      postPicStyle:{opacity:1, color:'red'},
      selectedImage: event.target.files[0]
    })
  }

  /**handles input changes for text inputs */
  changeHandler=event=>{
    const name=event.target.name;
    const value=event.target.value;
    this.setState({[name]: value});
  }
    /**aids when state changes */
  resetPostList(){
    this.setState({
      titles: [],
      whats: []
    })
  }
/**send uploaded Post data to the controller */
  handleUpload = () => {
    let post = {
      owner: this.state.owner,
      title: this.state.title,
      what: this.state.what,
      name:this.state.name
    }
    addPost(post)
      .then(res => {
        getPosts(this.state.owner)
        .then(posts => {
          this.resetPostList();
          this.uploadImage(this.state.selectedImage)
          this.setState({
            titles: [...this.state.titles,...posts.map(post=>post.title)],
            whats: [...this.state.whats,...posts.map(post=>post.what)],
            postPics:[...this.state.postPics,...posts.map(post=>post.imageData)]
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
    uploadPostPicture(imageFormObj)
          .then(data=>{
            if(data.success){
              this.resetPostPicture();
              this.setState({ postPic:`http://localhost:5000/${data.imageData}?${Date.now}`, postPicStyle: {opacity: 1} })
              alert("Image has been successfully uploaded using multer");
            }
            else{
              alert("Error occured while uploading the image");
            }
          })   
  } 
/** stores postlist
 * to be displayed on the side cards
 */
  displayPost=(i)=>{
    this.setState({
      title:this.state.titles[i],
      what:this.state.whats[i],
      postPic:`http://localhost:5000/${this.state.postPics[i]}?${Date.now}`,
      postPicStyle:{opacity: 1}
    })
  }

  preventDefault=(e)=>{e.preventDefault(); console.log(e)}
  componentWillMount() {
    /**
      * calls the controller that gets existing posts when the organisation logs in
    */
    if(this.state.owner){
      getPosts(this.state.owner)
        .then(posts => {
          this.setState({
            titles: [...this.state.titles,...posts.map(post=>post.title)],
            whats: [...this.state.whats,...posts.map(post=>post.what)],
            postPics:[...this.state.postPics,...posts.map(post=>post.imageData)]
          })
        })
        .catch(err => console.log('error')); 
    }
  }

  render(){
    return(
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
                    Click on post to view
                  </h3>
                  <ul className="list-unstyled example-components-list">
                  <div className="scrollbar scrollbar-primary  mt-5 mx-auto" style={this.state.scrollContainerStyle}> 
                      {   
                        this.state.titles.map((post,index)=>{
                            return(
                              <div className="eventside">
                                <MDBListGroup >
                                <MDBListGroupItem active href="#" key={index} 
                                onClick={(e)=>{this.displayPost(index); this.preventDefault(e)}} 
                                style={{backgroundColor:'#33b838',border:'2px solid white'}}
                                >
                                  <div className='p'>
                                    <div className="d-flex w-100 justify-content-between">
                                      <h5 className="mb-1">{this.state.titles[index]}</h5>
                                    </div>
                                    <p className="mb-1">{this.state.whats[index]}</p>
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

        <MDBCol md="7">
            <h1 className="text-center mt-3 grey-text">Edit/Add Your Posts</h1>
            <MDBRow >
                  <MDBCol md="12" onChange={this.handleChange} value={this.state.value}>
                    <MDBInput value={this.state.title} label="Title Of Your Post" onChange={this.changeHandler} name='title' />
                  </MDBCol>
            </MDBRow> 
            <MDBRow >
                <MDBCol md="12">
                  <MDBInput value={this.state.what} label="Describe Your Post" type="textarea" rows="2" onChange={this.changeHandler} name='what' />
                </MDBCol>
            </MDBRow>

            <MDBRow>      
              <MDBCol md="12">
                <SectionContainer header="Post Picture">
                    <div class="file-field">
                    <div class="d-flex justify-content-center box1">
                        <img src={this.state.postPic}
                          style={this.state.postPicStyle || {opacity:0, position:"absolute", pointerEvents:"none"}} 
                          class="z-depth-1-half avatar-pic"
                          alt="Post Picture" 
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
                      <form metho='post'>
                      <input onClick={this.fileSelectedHandler} 
                              ref={fileInput=>this.fileInput=fileInput}
                              style={{opacity:0, position:"absolute", pointerEvents:"none"}} 
                              type="file"
                              id="inputGroupFile01" 
                              onChange={this.addPostPicture}
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
export default PostDetails;