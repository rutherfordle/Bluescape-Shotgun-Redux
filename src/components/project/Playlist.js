import React, { Component } from "react";
import ViewImages from "./ViewImages";
import {connect} from "react-redux";
import {getProjectPlaylist} from "../../actions/project";
import {getPlaylist,getPlaylistImages,removePlaylist} from "../../actions/playlist";
import Link from "react-router-dom/es/Link";

class Playlist extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount()
    {
        this.props.getPlaylist()
        this.props.removePlaylist()
    }

    render() {
        let viewImages = (this.props.playlistImages)? < ViewImages />:'';
        return (
                <div className="card-deck bg-light">
                    <div className="card3">
                        <h2>Playlist</h2>
                        <form id={"appInsert"}>
                            {this.props.playlist.map((plData )=> (
                                <div className="card1" key={plData.id}>
                                    <div className="card4">
                                        {plData.attributes.code}
                                        <br />
                                        <button
                                            className="btn btn-primary card4 rounded-lg"
                                            type="button"
                                            name="index"
                                            onClick={()=>{this.props.getPlaylistImages(plData.id, plData.attributes.code, plData.relationships.created_by.data.name)}}
                                        >Submit</button>
                                    </div>
                                </div>
                            ))}
                        </form>
                        <div className="container">
                            <Link to={'/'}>
                                <p className="menu-item" >Go back to Project</p>
                            </ Link>
                        </div>
                    </div>
                    <div className="card2">
                       {viewImages}
                    </div>
                </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    playlist: state.playlist.playlist,
    playlistImages: state.playlist.playlistImages
});

export default connect(
    mapStateToProps,
    { getPlaylist, getProjectPlaylist, getPlaylistImages,removePlaylist }
)(Playlist);