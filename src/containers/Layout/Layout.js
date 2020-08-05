import React, {Component} from 'react';
import {connect} from 'react-redux';
import Toolbar from '../../components/UI/Toolbar/Toolbar';

class Layout extends Component {
    render() {
        return (
            <React.Fragment>
                <Toolbar isAuthenticated={this.props.isAuthenticated}></Toolbar>
                <main>
                    {this.props.children}
                </main>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.tokenId != null
    }
}

export default connect(mapStateToProps)(Layout);