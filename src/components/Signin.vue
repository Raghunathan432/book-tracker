<template> 
    <div id = "signin-container">
        <!-- <p style = "position: absolute; top: 1px; left: 50%; transform: translateX(-50%); font-size: 10px; color: grey; cursor: pointer;" @click = "$router.push({name: 'Changelog'})">Book Tracker (ver 1.4)</p> -->
        <div id="left">
            <h1 id = "main-heading">Book Tracker</h1>
            <div id="signin" v-if = "signInOrSignUp == 'signin'">
                <h3 id = "signin-heading">Sign in.</h3>
                <form>  
                    <div class="signin-input">
                        <label class = "signin-label">Email</label>
                        <input type = "email" class = "signin-inputfield" id = "email" v-model="email" required>
                    </div>
                    <div class="signin-input">
                        <label  class = "signin-label">Password</label>
                        <input type = "password" class = "signin-inputfield" id = "password" v-model="password" required>
                        <p id = "forgot-password" @click = "forgotPassword()">Forgot Password?</p>
                    </div>
                    <p v-if = "errorPresentSignIn" id = "error-handling-text">{{this.errorMessageSignIn}}</p>
                    <p v-if = "resetEmailSent && !errorPresentSignIn" id = "reset-email-success-text">{{this.resetEmailMessage}}</p>
                    <button type = "button" @click = "signIn()" id = "signin-btn">Sign In</button>
                    <p id = "signup-text">Don't have an account yet?<span id = "signup-link" @click = "signUpPromptClicked()">Sign up.</span></p>
                </form>   
            
            </div>
            <div id="signup" v-else>
                <h3 id = "signin-heading">Sign up.</h3>
                <form>  
                    <div class="signin-input">
                        <label  class = "signin-label">Email<span class="material-icons form-requirement-icons" @mouseenter = "emailTooltip = true" @mouseleave="emailTooltip = false">info</span><span class = "email-info" v-if = "emailTooltip">Should be a valid email "example@website.com"</span></label>
                        <input type = "email" class = "signin-inputfield" id = "email" v-model="email" required>
                    </div>
                    <div class="signin-input">
                        <label class = "signin-label">Username<span class="material-icons form-requirement-icons" @mouseenter = "usernameTooltip = true" @mouseleave="usernameTooltip = false">info</span><span class = "email-info" v-if = "usernameTooltip">Should be atleast 5 characters long and not more than 10 characters</span></label>
                        <input type = "text" class = "signin-inputfield" id = "username" v-model="username" required>
                    </div>
                    <div class="signin-input">
                        <label  class = "signin-label">Password<span class="material-icons form-requirement-icons" @mouseenter = "passwordTooltip = true" @mouseleave="passwordTooltip = false">info</span><span class = "email-info" v-if = "passwordTooltip">Should be atleast 6 characters long & Cannot be same as username</span></label>
                        <input type = "password" class = "signin-inputfield" id = "password" v-model="password" required>
                    </div>
                    <p v-if = "errorPresentSignUp" id = "error-handling-text">{{this.errorMessageSignUp}}</p>
                    <button type = "button" @click = "signUp()" id = "signin-btn">Sign Up</button>
                    <p id = "signup-text">Already have an account?<span id = "signup-link" @click = "signInPromptClicked()">Sign in.</span></p>
                </form>   
                
            </div>
        </div>
        <div id = "lol">
            <a href = ""><img src="../assets/images/Library-rafiki.svg" alt="Click to go to creator's page" width = "80%" style = "margin: 50px auto;"></a>
        </div>
    </div>
</template>

<script>
import {db, auth} from '@/firebase/config'
export default {
    name: 'Signin', 
    metaInfo: {
        title: 'Book Tracker | Sign in or Signup'
    },
    data() {
        return {
            email: '',
            password: '',
            username: '',
            errorPresentSignIn: false,
            errorMessageSignIn: '',
            errorPresentSignUp: false,
            errorMessageSignUp: '',
            signInOrSignUp : 'signin',
            emailTooltip: false,
            usernameTooltip: false,
            passwordTooltip: false,
            resetEmailSent: false,
            resetEmailMessage: '',
        }
    },
    methods: {
        signIn() {
            this.resetEmailSent = false
            if(this.validateInputs(1)) {
                this.errorPresentSignIn = false
                this.errorMessageSignIn = ''
                auth.signInWithEmailAndPassword(this.email,this.password).then(cred => {
                    this.errorPresentSignIn = false
                    this.$router.push({name: 'Home'})
                })
                .catch(err => {
                    if(err.a == null) {
                        this.errorPresentSignIn = true
                        let message = err.code.substr(5)
                        console.log(message)
                        if(message == 'wrong-password') {
                            this.errorMessageSignIn = "Please check your credentials and try again"
                        }
                        else if(message == 'user-not-found' || message == 'invalid-email'){
                            this.errorMessageSignIn = "Please check if you have entered the correct email"
                        } 
                    }
                })
            }
            else {
                this.errorPresentSignIn = true
                this.errorMessageSignIn = "Please check if you have entered both fields"
            }
        },
        signInPromptClicked() {
            this.username = ''
            this.password = ''
            this.email = ''
            this.signInOrSignUp = 'signin'    
        },
        signUpPromptClicked() {
            this.username = ''
            this.password = ''
            this.email = ''
            this.signInOrSignUp = 'signup'
        },
        signUp() {
            if(this.validateInputs(2)) {
                this.errorPresentSignUp = false
                this.errorMessageSignUp = ""
                auth.createUserWithEmailAndPassword(this.email, this.password)
                .then(cred => {
                    this.errorPresentSignUp = false
                    db.collection('users').add({
                        email: this.email,
                        username: this.username,
                        uid: cred.user.uid
                    })
                    .catch(err => {
                        onsole.log(err)
                    })
                    let user = auth.currentUser
                    // Send Verification email
                    user.sendEmailVerification()
                    this.$router.push({name: 'Home'})
                })
                .catch(err => {
                    if(err.a == null) {
                        this.errorPresentSignUp = true
                        this.errorMessageSignUp = err.message
                    }
                })
            }
            else {
                this.errorPresentSignUp = true
                this.errorMessageSignUp = "Please check if your inputs satisfy the requirements"
            }
        },
        validateInputs(op) {
            if(op == 1) {
                if(this.email && this.password) {
                    return true
                }
                else {
                    return false
                }
            }
            else if(op == 2) {
                if(this.email && (this.username.length >= 5 && this.username.length <=10) && this.password.length >= 6 && (this.password != this.username)) {
                    return true
                }
                else {
                    return false
                }
            }
        },
        forgotPassword() {
            if(this.email != '') {
                auth.sendPasswordResetEmail(this.email)
                .then(() => {
                    this.resetEmailSent = true
                    this.resetEmailMessage = 'Reset instructions sent to email'
                })
                .catch(err => {
                    this.resetEmailSent = false
                    let message = err.code.substr(5)
                    console.log(message)
                    if(message == 'user-not-found' || message == 'invalid-email') {
                        this.errorPresentSignIn = true
                        this.errorMessageSignIn = 'Please check if you have entered the right email'
                    }
                })
            }
            else {
                this.errorPresentSignIn = true
                this.errorMessageSignIn = 'Please enter your registered email'
            }
        },
    },
   
}
</script>

<style scoped>
@import '../assets/css/SignIn/signin-desktop-styles.css';
@import '../assets/css/SignIn/signin-mobile-styles.css';
</style>
