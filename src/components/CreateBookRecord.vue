<template>
    <div id="create-book">
        <div id="form">
            <div id = "gohome">
                <span class="material-icons" @click = "goHome()">arrow_back</span>
            </div>
            <h1 class = "create-main-heading">Add a book to your list.</h1>
            <div class = "book-input" id = "book-name-input">
                <label for = "book-name">Which book did you read?</label><br>
                <input type = "text" name = "book-name" id = "book-name" @keyup="searchBook()"  @focus = "searchOpenFlag = true" @blur = "closeSearchResults()" v-model = "searchQuery" required>
                <div id = "search-results" v-if = "searchQuery != '' && results.length != 0 && searchOpenFlag">
                    <div v-for="result in results" :key="result.id" class = "book-search-result" @click = "chooseBook(result)">
                        <p class = "result-title">{{result.volumeInfo.title}}</p>
                        <div class = "authors" v-for = "author in result.volumeInfo.authors" :key = "author.id">
                            <p class = "authors">{{author}}</p>
                        </div>
                    </div>               
                </div> 
                
            </div>
            <div class = "book-input" id = "book-hours-input">
                <label for = "book-name">Reading time (in hrs lesser than 50)</label><br>
                <input type = "number" name = "time-taken" id = "time-taken" v-model="hours" required>
            </div> 
            <div class = "book-input" id = "book-rating-input">
                <label for = "book-name">Rating (out of 5)</label><br>
                <input type = "number" name = "rating" id = "rating" max = 5 min = 1 v-model="rating" required  @keyup.enter = "addBookToList()"/>
            </div> 
            <p v-if = "errorPresentCreate" id = "error-handling-text">{{this.errorMessageCreate}}</p>
            <div class = "book-btn-container">
                <button type = "button" @click = "addBookToList()" id = "add-book-btn">Add to List</button>
            </div>
            <p id = "success-text" v-if = "success">Book has been added to your list successfully</p> 
        </div>
        <div id = "preview" v-if  = "chosenBook != {} && searchQuery != '' ">
            <!-- <h1 class = "create-main-heading">Preview</h1> -->
            <img :src = "chosenBook.thumbnail" width ="30%">
            <p>{{chosenBook.title}}</p>
            <p>{{chosenBook.authors}}</p>
        </div>
        <div id="no-chosen-book" v-else>
            <span class="material-icons" id = "placeholder-book">auto_stories</span>
            <h3 id = "placeholder-text">Details of the book you choose will appear here</h3>
        </div>
    </div>
</template>

<script>
import APIKEY from '../books-api/apikey'
import axios from 'axios'
import {auth, db} from '../firebase/config'
import EventBus from '../eventBus'
export default {
    name: 'CreateBookRecord',
    metaInfo: {
        title: 'Book Tracker | Create Book Record'
    },
    data() {
        return {
            apiKey: APIKEY,
            searchQuery: '',
            results: [],
            chosenBook: {},
            hours: null,
            rating: null,
            success : false,
            bookTest: '',
            errorPresentCreate: '',
            errorMessageCreate: 'Please check if your inputs satisfy the requirements', 
            searchOpenFlag : false
        }
    },
    methods: {
        searchBook() {
            let uri = 'https://www.googleapis.com/books/v1/volumes?q=' + this.searchQuery + '&key=' + this.apiKey
            if(this.searchQuery.length >= 1) {
                axios.get(uri).then(response => {
                    this.results  = response.data.items.slice(0,5)
                })
                .catch(err => {
                    console.log(err)
                })        
            }
        },
        chooseBook(result) {
            console.log("here")
            this.chosenBook = ({id: result.id, title: result.volumeInfo.title, authors: result.volumeInfo.authors, smallThumbnail: result.volumeInfo.imageLinks.smallThumbnail, thumbnail :  result.volumeInfo.imageLinks.thumbnail })
            this.results = []
            this.searchQuery = this.chosenBook.title
            this.bookDoesNotExist()
        },
        closeSearchResults() {
            setTimeout(() => {
                this.searchOpenFlag = false
            }, 150)
        },
        addBookToList() {
            if(this.searchQuery != '' && this.validateInputs() && this.bookTest == true) {
                this.errorPresentCreate =  false
                this.hours =  parseFloat(+this.hours).toFixed(1)
                this.rating = parseFloat(+this.rating).toFixed(1)
                db.collection('readBooksList').add({
                    id: this.chosenBook.id,
                    title: this.chosenBook.title,
                    authors: this.chosenBook.authors,
                    smallThumbnail: this.chosenBook.smallThumbnail,
                    thumbnail: this.chosenBook.thumbnail,
                    hoursToRead: this.hours,
                    rating: this.rating,
                    uid: auth.currentUser.uid
                })
                .then(response => {
                    EventBus.$emit('RECORD_CREATED',{title: this.chosenBook.title})
                    this.goHome()
                    
                })
            }
            else {
                this.errorPresentCreate = true
                if(this.searchQuery == '') {
                    this.errorMessageCreate = 'Please choose a book to add'
                }
                if(this.bookTest == false && this.searchQuery != '') {
                    this.errorMessageCreate = 'The chosen book already exists in your shelf'
                } 
            } 
        },
        validateInputs() {
            this.errorMessageCreate = 'Please check if your inputs satisfy the requirements'
            let count = 0
            if(this.rating > 0 && this.rating <=5 && this.rating != null)
                count++         
            if(this.hours > 0 && this.hours < 50 && this.hours != null) 
                count++  
            if(count == 2) 
                return true 
            else  {
                this.errorPresentCreate = true
                return false      
            }          
        },
        bookDoesNotExist() {
           db.collection('readBooksList').where('id','==',this.chosenBook.id).where('uid', '==', auth.currentUser.uid).get()
            .then(snapshot => {
                if(snapshot.docs.length == 0) {
                    this.bookTest = true
                }
                else {
                    this.bookTest = false
                }
            })
        },
        goHome() {
            this.$router.push({name: 'Home', params: {authUsername: this.authUsername}})
        } 
    },
    watch: {
        searchQuery: function() {
            if(this.searchQuery == '') {
                this.chosenBook = []
            }
        },
    },
    mounted() {
        if(auth.currentUser == null) {
            this.$router.push({name: 'SignIn'})
        }
    }
}
</script>

<style scoped>
@import '../assets/css/CreateBook/create-book-desktop-styles.css';
@import '../assets/css/CreateBook/create-book-mobile-styles.css';
</style>
