<template>
    <div id="create-book">
        <div id="form">
            <span class="material-icons" @click = "goHome()">arrow_back</span>
            <h1 class = "create-main-heading">Edit the record.</h1>
            <div class = "book-input" id = "book-name-input">
                <label for = "book-name">Which book did you read?</label><br>
                <input type = "text" name = "book-name" id = "book-name" v-model = "chosenBook.title" disabled>
            </div>
        <div class = "book-input" id = "book-hours-input">
            <label for = "book-name">Reading time (hours lesser than 50)</label><br>
            <input type = "number" name = "time-taken" id = "time-taken" v-model="hours" required>
        </div> 
        <div class = "book-input" id = "book-rating-input">
            <label for = "book-name">Rating (out of 5)</label><br>
            <input type = "number" name = "rating" id = "rating" max = 5 min = 1 v-model="rating" required>
        </div> 
        <p v-if = "errorPresentEdit" id = "error-handling-text">{{this.errorMessageEdit}}</p>
        <div class = "book-btn-container">
            <button type = "button" @click = "editBook()" id = "add-book-btn">Edit Record</button>
        </div>
        <p id = "success-text" v-if = "success">Book has been edited successfully</p> 
        <p id = "success-text" v-if = "success">You will be redirected to the home page shortly</p>
        </div>
        <div id = "preview" v-if  = "chosenBook != {}">
            <img :src = "chosenBook.thumbnail" width ="30%">
            <p>{{chosenBook.title}}</p>
            <p>{{chosenBook.authors}}</p>
        </div>
    </div>
</template>

<script>
import {auth, db} from '../firebase/config'
import EventBus from '../eventBus'
export default {
    name: 'CreateBookRecord',
    metaInfo: {
        title: 'Book Tracker | Edit Book'
    },
    data() {
        return {
            chosenBook: {},
            hours: null,
            rating: null,
            success : false,
            editID: '',
            errorPresentEdit: false,
            errorMessageEdit : 'Please check if your inputs satisfy the requirements'
        }
    },
    methods: {
        editBook() {
            if(this.validateInputs()){
                this.errorPresentEdit = false
                db.collection('readBooksList').doc(this.editID).update({
                    hoursToRead: this.hours,
                    rating: this.rating
                })
                .then(response => {
                    this.success = true
                    EventBus.$emit('RECORD_EDITED')
                })
            }
            else {
                this.errorPresentEdit = true
            } 
        },
        validateInputs() {
            this.errorMessageEdit = 'Please check if your inputs satisfy the requirements'
            let count = 0
            if(this.rating > 0 && this.rating <=5 && this.rating != null)
                count++         
            if(this.hours > 0 && this.hours < 50 && this.hours != null) 
                count++  
            if(count == 2) 
                return true 
            else  {
                this.errorPresentEdit = true
                return false      
            } 
        },
        goHome() {
            this.$router.push({name: 'Home'})
        },
    },
    watch: {
        success : function() {
            if(this.success) {
              setTimeout(() =>{
                  this.success = false
                  this.goHome()
              }, 1000)                  
            }
        }
    },
    mounted() {
        if(auth.currentUser != null) {
            this.chosenBook = this.$route.params.editableBook
            this.hours = this.chosenBook.hoursToRead
            this.rating = this.chosenBook.rating
            this.editID = this.chosenBook.docID
        }
        else {
            this.$router.push({name: 'SignIn'})
        }
    }
}
</script>

<style scoped>
@import '../assets/css/CreateBook/create-book-desktop-styles.css';
@import '../assets/css/CreateBook/create-book-mobile-styles.css';
</style>
