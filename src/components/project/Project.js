import React, { Component } from "react";
import Link from "react-router-dom/es/Link";
import {connect} from "react-redux";
import {getProject, getProjectPlaylist} from "../../actions/project";


class Project extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.getProject()
    }

    render() {

        return (
            <div className="card card-body">
                <div className="card-deck">
                    <div className="card3">
                        <h2>Projects</h2>
                        <form>
                            {this.props.project.map((plData, i )=> (
                                <div className="card1" key={plData.id}>
                                    <div className="card4">
                                        {plData.type + ' ' + plData.id}
                                        <br />
                                        <Link to={{
                                            pathname: '/playlist/',
                                        }} className="link"><button onClick={()=>{this.props.getProjectPlaylist( plData.id )}} className={"btn-primary rounded-lg"}>Submit</button></Link>
                                    </div>
                                </div>
                            ))}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    project: state.project.project

});
export default connect(
    mapStateToProps,
    { getProject, getProjectPlaylist}
)(Project);