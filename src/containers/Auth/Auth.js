import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'
import classes from './Auth.module.css';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import {updateObject} from '../../shared/utility';
import * as actions from '../../store/actions/index';

class Auth extends Component {
    state = {
        signUp: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'E-mail adddress'
                },
                value: ''
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password (at least 6 characters)'
                },
                value: ''
            },
            confirmPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Re-enter Password'
                },
                value: ''
            },
        },
        signIn: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'E-mail adddress'
                },
                value: ''
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password (at least 6 characters)'
                },
                value: ''
            }
        },
        error: null
    }

    componentDidMount() {
        this.props.onAuthCheckStateHandler();
    }

    inputChangedHandler = (event, elementId, formType) => {
        const newValue = updateObject(this.state[formType][elementId], {
            value: event.target.value
        })
        const newForm = updateObject(this.state[formType], {
            [elementId]: newValue
        })
        this.setState({[formType]: newForm});
        // this.setState({[formType]: {
        //     ...this.state[formType],
        //     [elementId]: {
        //         ...this.state[formType][elementId],
        //         value: event.target.value
        //     }
        // }})
    }

    signInHandler = () => {
        this.props.onSignInHandler(
            this.state.signIn.email.value, 
            this.state.signIn.password.value);
    }

    signUpHandler = () => {
        if (this.state.signUp.password.value !== 
            this.state.signUp.confirmPassword.value) {
            this.setState({error: 'PASSWORDS_MISMATCH'});
        } else {
            this.props.onSignUpHandler(
                this.state.signUp.email.value, 
                this.state.signUp.password.value);
        }
    }

    clearErrorHandler = () => {
        this.setState({error: null});
        this.props.onClearErrorHandler();
    }

    render() {
        // Set up the sign in input elements
        const signInElementsArray = [];
        for (let key in this.state.signIn) {
            signInElementsArray.push({
                id: key,
                config: this.state.signIn[key]
            });
        }
        let signInForm = signInElementsArray.map (element => (
            <Input 
                key={element.id}
                elementType={element.config.elementType} 
                elementConfig={element.config.elementConfig} 
                value={element.config.value}
                changed={(event) => 
                    this.inputChangedHandler(event, element.id, 'signIn')}></Input>
        ))

        // Set up the sign out input elements
        const signUpElementsArray = [];
        for (let key in this.state.signUp) {
            signUpElementsArray.push({
                id: key,
                config: this.state.signUp[key]
            });
        }
        let signUpForm = signUpElementsArray.map (element => (
            <Input 
                key={element.id}
                elementType={element.config.elementType} 
                elementConfig={element.config.elementConfig} 
                value={element.config.value}
                invalid={!element.config.valid}
                shouldValidate={element.config.validation}
                changed={(event) => 
                    this.inputChangedHandler(event, element.id, 'signUp')}></Input>
        ))

        // Set up the sign in form and sign up form
        let forms = (
            <React.Fragment>
                <div className={classes.Auth}>
                    <h1>SIGN IN</h1>
                    {signInForm}
                    <Button onClick={this.signInHandler}>SUBMIT</Button>
                </div>
                <div className={classes.Auth}>
                    <h1>SIGN UP</h1>
                    {signUpForm}
                    <Button onClick={this.signUpHandler}>SUBMIT</Button>
                </div>
            </React.Fragment>
        );
        
        // Check whether the page is loading or not
        if (this.props.loading) {
            forms = (
                <div className={classes.Spinner}>
                    <Spinner></Spinner>
                </div>
            );
        }

        // Redirect users to the main page if they are already signed in
        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to='/playlists'></Redirect>
        }

        return (
            <React.Fragment>
                {authRedirect}
                {forms}
                <Modal 
                    show={this.props.error != null || this.state.error != null}
                    close={this.clearErrorHandler}>
                        {this.props.error ? this.props.error.message : this.state.error}</Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        loading: state.auth.loading,
        isAuthenticated: state.auth.tokenId != null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSignInHandler: (email, password) => dispatch(actions.auth(email, password, false)),
        onSignUpHandler: (email, password) => dispatch(actions.auth(email, password, true)),
        onAuthCheckStateHandler: () => dispatch(actions.authCheckState()),
        onClearErrorHandler: () => dispatch(actions.clearError())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);