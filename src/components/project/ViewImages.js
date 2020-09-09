import React, { Component } from "react";
import {connect} from "react-redux";
import {getPlaylist, getPlaylistImages} from "../../actions/playlist";
import {getProjectPlaylist} from "../../actions/project";

class ViewImages extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dimensions: [],
        }
    };

    onImgLoad = ({target:img}) => {
        const value = {height:img.naturalHeight,
            width:img.naturalWidth,source:img.src}
        this.state.dimensions.push(value)
        this.state.counter++
        console.log('onImgLoad', img);
    }
    sendToBluePlaylist = () => {
        console.log('ViewImages.resultPlaylist= ',this.props.playlistNameSelected)
        console.log('ViewImages.result.user.name= ',this.props.playlistImages[0].relationships.user.data.name)
        console.log('ViewImages.result.images= ',this.props.playlistImages[0].attributes.image)
    }

    sendToBlue = (index) => {
        const selectedImage = (index.attributes.sg_uploaded_movie_image)? (index.attributes.sg_uploaded_movie_image.url) : index.attributes.image
        console.log('dimensions',this.state.dimensions);
        const image = this.state.dimensions.find( el => el.source == selectedImage)
        console.log('Image.height', image.height);
        console.log('Image.width', image.width);
        console.log('ViewImages.resultPlaylist= ',this.props.playlistNameSelected)
        console.log('ViewImages.result.user.name= ',index.relationships.user.data.name)
        console.log('ViewImages.result.images= ',(selectedImage))

    }

    render() {
        let uploadable;
        if(this.props.playlistImages.length === 0) {
            uploadable = <div className="card4"> No images </div>
        }else{
            uploadable = <button id="appButton" onClick={this.sendToBluePlaylist} className="btn-primary rounded-lg" type="button" name="index" value="Send to BlueScap" >Send all to BlueScape</button>
        }
        return(
            <div>
                <div className="containerCustomSendAll">
                {uploadable}
                </div>
                <div className="card5">
                {this.props.playlistImages.map((val2, i) =>  (
                    <div key={i}><h2>{val2.attributes.cached_display_name}</h2>
                        <img width="100%" onLoad={this.onImgLoad} src={val2.attributes.sg_uploaded_movie_image ? val2.attributes.sg_uploaded_movie_image.url: val2.attributes.image}/>
                        <br />
                        <h2>Tags:</h2>
                        {val2.relationships.tags.data.map(val2=><React.Fragment>{val2.name}<br/></React.Fragment>)}
                        <br />
                        <button id="indButton" onClick={() => this.sendToBlue(val2)} className="btn-primary" type="button" name="index" >Send image to Bluescape</button>
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
    playlistNameSelected: state.playlist.playlistNameSelected
});

export default connect(
    mapStateToProps,
    { getPlaylist, getProjectPlaylist, getPlaylistImages}
)(ViewImages);