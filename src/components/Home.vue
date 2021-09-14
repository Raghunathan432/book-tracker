<template>
   <div id = "home">
       <button type = "button" id = "create-record-button" @click = "createBookRecord()">+</button> 
        <h1 id = "dashboard-heading" v-if = "booksList.length != 0">Your Bookshelf</h1>
        <button id = "open-user-info-card-btn" v-if = "booksList.length != 0"><span class="material-icons" id = "person-icon" @click = "toggleUserCardMobile()" v-if = "!showUserCardMobile">person</span><span class="material-icons" id = "person-icon" @click = "toggleUserCardMobile()" v-else>close</span></button>
        <div id = "user-info-card-mobile-no-books" v-else>
            <div id = "left-uic">
                <h4 id = "username-on-card-mobile">{{this.username}}<span class = "material-icons email-verified-icon" v-if = "emailVerified">check_circle</span><span class = "material-icons email-not-verified-icon" v-else>error</span></h4>
                <h5 id = "email-on-card-mobile">{{this.email}}</h5>
                <div id="signout-btn-container-mobile">
                    <button id = "signout-btn-mobile" @click = "logout()">Sign out</button>
                </div>
            </div>
            <div id= "right-uic">
                <div id = "profileImage-mobile">{{this.initial}}</div>
            </div>
        </div>
        <div id = "user-info-card">
            <div id = "left-uic">
                <h4 id = "username-on-card">{{this.username}}<span class = "material-icons email-verified-icon " v-if = "emailVerified">check_circle</span><span class = "material-icons email-not-verified-icon" v-else @click = "sendVerificationEmail()">error</span></h4>
                <h5 id = "email-on-card">{{this.email}}</h5>
                <span v-if = "emailVerificationRequestSent" id = "verification-sent">Sent!</span>
                <div id="signout-btn-container">
                    <button id = "signout-btn" @click = "logout()">Sign out</button>
                </div>
            </div>
            <div id= "right-uic">
                <div id = "profileImage">{{this.initial}}</div>
            </div>
        </div>
        <div id = "user-info-card-mobile" v-if = "showUserCardMobile">
            <div id = "left-uic">
                <h4 id = "username-on-card-mobile">{{this.username}}<span class = "material-icons email-verified-icon" v-if = "emailVerified">check_circle</span><span class = "material-icons email-not-verified-icon" v-else>error</span></h4>
                <h5 id = "email-on-card-mobile">{{this.email}}</h5>
                <div id="signout-btn-container-mobile">
                    <button id = "signout-btn-mobile" @click = "logout()">Sign out</button>
                </div>
            </div>
            <div id= "right-uic">
                <div id = "profileImage-mobile">{{this.initial}}</div>
            </div>
        </div>
        <div id = "books-list-container" v-if = "booksList.length != 0" >
            <p id = "deleted-book" v-if = "deletedBookComplete">Book record "<span style = "color: black;">{{deletedBook}}</span>" has been successfully removed.</p>
            <table id = "books-list">
                <thead>
                <tr id = "header" cellpadding = "15px">
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Author(s)</th>
                    <th>Your Rating ( / 5)</th>
                    <th>Reading Time</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for = "book in booksList" :key = "book.id" class = "records">
                    <td class = "book-in-list"><img :src = "book.smallThumbnail" width = "30%"></td>
                    <td class = "book-in-list">{{book.title}}</td>
                    <td class = "book-in-list"><span  v-for = "author in book.authors" :key = "author.id">{{author}}, <br></span></td>
                    <td class = "book-in-list">{{book.rating}}</td>
                    <td class = "book-in-list">{{book.hoursToRead}} hours</td>
                    <td><span class = "material-icons" @click = "editBook(book.docID)">edit</span></td>
                    <td><span class = "material-icons" @click = "deleteBook(book.docID)" style = "color: red;">delete</span></td>
                </tr><br>
                </tbody>
            </table>
        </div>
        <div id = "no-books" v-else>
            <h1 id = "books-placeholder"><span class="material-icons" style = "font-size: 32px;">import_contacts</span><br>
                The books you add will be shown here</h1>
            <div id ="get-started-btn-container">    
                <button type = "button" id = "create-when-no-book-btn" @click = "createBookRecordMobile()">Get Started</button>    
            </div>
        </div>
        <div id = "books-list-mobile" v-if = "booksList.length != 0" >
            <h3 id = "your-list">Your Bookshelf</h3>
            <button type = "button" @click = "createBookRecordMobile()" id = "create-record-btn-mobile"><span class="material-icons">add</span></button>
            <div class = "book-card" v-for = "book in booksList" :key = "book.docID">
                <div class = "img">
                    <img :src = "book.smallThumbnail" class = "book-thumbnail-card">
                </div>
                <div class = "details">
                    <h3 class = "book-title-card">{{book.title}}</h3>
                    <h5 class = "book-authors-card"><span  v-for = "author in book.authors" :key = "author.id">{{author}},</span></h5> 
                    <p class = "book-rating-card">Rating : {{book.rating}}/5</p>
                    <p class = "book-hours-card">{{book.hoursToRead}} hours to read</p>
                    <div class = "options-in-card">
                        <span class = "material-icons material-icons-options" @click = "editBook(book.docID)">edit</span>&nbsp;&nbsp;
                        <span class = "material-icons material-icons-options" @click = "deleteBook(book.docID)" style = "color: red;">delete</span>
                    </div>
                </div>  
            </div> 
        </div>
        <modal name = "create-book" :width = "1000" :height = "500">
            <span class = "material-icons" id = "close-modal" @click = "closeCreate()">close</span>
            <CreateBookRecord/>
        </modal>        
    </div> 
</template>
<script>
import {auth, db} from '@/firebase/config'
import EventBus from '../eventBus'
import CreateBookRecord from './CreateBookRecord.vue'
import EditRecord from './EditRecord.vue'

export default {
    name: 'Home',
    metaInfo: {
        title: 'Book Tracker | Home'
    },
    components: {
        CreateBookRecord,
        EditRecord
    },
    data() {
        return {
            booksList: [],
            deletedBookComplete: false,
            deletedBook: '',
            username: '',
            email: '',
            initial: '',
            userIconClicked : false,
            showUserCardMobile: false,
            emailVerified: false,
            emailVerificationRequestSent: false,
        }
    },
    methods: {
        createBookRecord() {
            this.$modal.show('create-book')
        },
        createBookRecordMobile() {
            this.$router.push({name: 'CreateBookRecord', params: {authUsername: this.authUsername}})
        },
        closeCreate() {
            this.$modal.hide('create-book')
        },
        editBook(id) {
            let payload = this.booksList.filter((book) => {
                    return book.docID == id
                })[0] 
           this.$router.push({name: 'EditRecord', params: {editableBook: payload}})
        },
        deleteBook(id) {
            this.deletedBook = this.booksList.filter(book => {
                return book.docID == id
            })[0].title
            db.collection('readBooksList').doc(id).delete()
            .then(() => {
                this.refreshBookList()
            })      
            this.deletedBookComplete = true
        },
        refreshBookList() {
            this.booksList = []
            db.collection('readBooksList').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    if(doc.data().uid == auth.currentUser.uid) {
                        let book = doc.data()
                        book.docID = doc.id
                        this.booksList.push(book)
                        this.booksList.sort(this.compareTitles)
                    }
                })
            })  
        },
        compareTitles(book1, book2) {
            if (book1.title < book2.title)
                return -1
            if (book1.title > book2.title)
                return 1
            return 0
        },
        logout() {
            auth.signOut()
            .then(() => {
                this.$router.push({name: 'SignIn'})
            })
        },
        toggleUserCardMobile() {
            this.showUserCardMobile = !this.showUserCardMobile
        },
        sendVerificationEmail() {
            let user = auth.currentUser
            user.sendEmailVerification()
            .then(()=> {
                this.emailVerificationRequestSent = true
            })
        },
    },
    watch: {
        deletedBookComplete : function() {
            if(this.deletedBookComplete) {
              setTimeout(() =>{
                  this.deletedBookComplete = false
                  this.deletedBook = ''
              }, 5000)                  
            }
        },
        emailVerificationRequestSent: function() {
            if(this.emailVerificationRequestSent) {
                setTimeout(() =>{
                  this.emailVerificationRequestSent = false
              }, 2500)         
            }
        }
    },
    created() {
        if(!auth.currentUser) {
            this.$router.push({name : 'SignIn'})
        }
        else {
            this.refreshBookList()
            db.collection('users').where('uid','==',auth.currentUser.uid).get()
            .then(snapshot => {
              this.username = snapshot.docs[0].data().username
              this.email = snapshot.docs[0].data().email
              this.initial = this.username.charAt(0)
            })
            this.emailVerified = auth.currentUser.emailVerified
            
        }  
    },
    mounted() {
        EventBus.$on('RECORD_CREATED', (payload) => {
            this.closeCreate()
            this.refreshBookList()
        })
        EventBus.$on('RECORD_EDITED', () => {
            setTimeout(()=>{
                this.refreshBookList()
            },1100)
        })
    },
}
</script>

<style scoped>
@import '../assets/css/Home/home-desktop-styles.css';
@import '../assets/css/Home/home-mobile-styles.css';
</style>
