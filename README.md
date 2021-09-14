<h1>Documentation</h1>
<h2>Project Prerequisites</h2>
<ul>
  <li>A Firebase project</li>
  <li>A Google Developer Profile and an API key with access to Google Books API</li>
</ul>

<h2>Features</h2>
<ul>
  <li>Secure authentication of users powered by Firebase including email verification and password reset</li>
  <li>Book Search powered by largest book API - Google Books API</li>
  <li>Clean UI with ease of use</li>
  <li>Responsive</li>
</ul>


<h2>Screenshots</h2>
<img src = "https://github.com/Raghunathan432/book-tracker/blob/master/Signin.png">
<img src = "https://github.com/Raghunathan432/book-tracker/blob/master/Home.png">
<img src = "https://github.com/Raghunathan432/book-tracker/blob/master/Create.png">



<h2>Installation</h2>
<h4>Clone the Repository</h4>

```
$ git clone https://github.com/Raghunathan432/book-tracker.git
```

<h4>Install npm dependencies</h4>
<p>Go to the repository's root folder and open a terminal and run the following command:</p>

```
$ npm install
```
<h4>Setup Firebase and Books API</h4>
<p>Open /src/firebase/config.js and replace the firebase config with your firebase config details and uncomment the code</p>

  ```
  var firebaseConfig = { 
  apiKey: "YOUR API_KEY",
  authDomain: "YOUR AUTH DOMAIN",
  projectId: "YOUR PROJECT ID",
  appId: "YOUR APP ID",	
};
  ```

<p>Open /src/books-api/apiKey.js and paste the Google Developer API key you created</p>

```
let apiKey  = 'YOUR API_KEY'

export default apiKey
```


<h2>Run</h2>

```
$ npm run serve
```

