import React, { Component } from "react";
import {connect} from "react-redux";
import {getPlaylist, getPlaylistImages} from "../../actions/playlist";
import {getProjectPlaylist} from "../../actions/project";
import {sendToBlue,imageToUpload,sendToBluePlaylist,launchWorkspace} from "../../actions/sendToBlue";
import store from "../../store";


class ViewImages extends Component {
    constructor(props) {
        super(props)
        console.log("viewImages constructor")
        this.state = {
            playlistImages: [],
        }
    };

    //get the width and height of images as they are loaded:
    onImgLoad = ({target:img}) => {
        const value = {height:img.naturalHeight,
        width:img.naturalWidth,source:img.src}
        this.state.playlistImages.push(value)
        this.state.counter++
        console.log("------ viewImage.onImageLoad = ", this.state.playlistImages)
    }

    //handle all images for playlist:
    sendToBluePlaylistBroker = () => {
        console.log('viewImages.this.props = ', this.props)
        console.log('ViewImages.resultPlaylist= ',this.props.playlistNameSelected)
        console.log('ViewImages.result.user.name= ',this.props.playlistImages[0].relationships.user.data.name)
        console.log('ViewImages.result.images= ',this.props.playlistImages[0].attributes.image)
        this.props.playlistImages.map((val2, i) =>  {
            //let selectedImage = (val2.attributes.sg_uploaded_movie_image)? (val2.attributes.sg_uploaded_movie_image.url) : val2.attributes.image
            //this.props.imageToUpload(selectedImage)
            this.processImageUpload(val2)
        })
        // this.props.sendToBluePlaylist()
        store.dispatch(sendToBluePlaylist())
    }

    //handle all images for playlist:
    launchWorkspace = () => {

        // this.props.sendToBluePlaylist()
        store.dispatch(launchWorkspace())
    }

    //called for one image only:
    submitImageUpload = (index) => {
        this.processImageUpload(index)
        this.props.sendToBlue(index)
    }

    processImageUpload = (index) => {
        console.log('=======> processImageUpload.index = ', index)
        console.log('   id = ' + index.id)
        const selectedImage = (index.attributes.sg_uploaded_movie_image)? (index.attributes.sg_uploaded_movie_image.url) : index.attributes.image
        const imageIndex = this.state.playlistImages.findIndex( el => el.source == selectedImage)
        this.state.playlistImages[imageIndex].versionID = index.id
        console.log('processImageUpload.this.state.playlistImages = ', this.state.playlistImages)
        console.log('   processImageUpload['+ imageIndex + '] = ', this.state.playlistImages[imageIndex])
        this.state.playlistImages.versionID = index.id
        this.props.imageToUpload(this.state.playlistImages[imageIndex].source, this.state.playlistImages, index.id)
    }

    render() {
        let uploadable;
        let launchWorkspace;
        this.state.playlistImages = []
        if(this.props.playlistImages.length === 0) {
            uploadable = <div className="card4"> No images </div>
        }else{
            uploadable = <button id="appButton" onClick={() => this.sendToBluePlaylistBroker()} className="btn-primary rounded-lg mt-1" type="button" name="index" value="Send to BlueScap" >Send all to BlueScape</button>
            launchWorkspace = <button id="appButton" onClick={() => this.launchWorkspace()} className="btn-primary rounded-lg mt-1 ml-5" type="button" name="index" value="Send to BlueScap" >Launch Workspace</button>

        }
        return(
            <div>
                <div className="containerCustomSendAll">
                {uploadable}{launchWorkspace}
                </div>
                <div className="card5 bg-light ">
                {this.props.playlistImages.map((val2, i) =>  (
                    <div key={i}>
                        <h2>{val2.attributes.cached_display_name}</h2>
                        <img width="100%" onLoad={this.onImgLoad} src={val2.attributes.sg_uploaded_movie_image ? val2.attributes.sg_uploaded_movie_image.url: val2.attributes.image}/>
                        <br />
                        <h2>Tags:</h2>
                        {val2.relationships.tags.data.map((val2, j)=><React.Fragment key={j}><div>{val2.name}</div></React.Fragment>)}
                        <button id="indButton" onClick={() => this.submitImageUpload(val2)} className="btn-primary rounded-lg" type="button" name="index" >Send image to Bluescape</button>
                    </div>
                    )
                )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    playlistImages: state.playlist.playlistImages,
    playlistNameSelected: state.playlist.playlistNameSelected,
});

export default connect(
    mapStateToProps,
    { getPlaylist, getProjectPlaylist, getPlaylistImages, sendToBlue, imageToUpload, sendToBluePlaylist, launchWorkspace}
)(ViewImages);