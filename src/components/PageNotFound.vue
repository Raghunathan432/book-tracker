<template>
    <div class="e-404">
        <h1>The page you're looking for could not be found. <span @click = "$router.push({name: 'SignIn'})">Go Home?</span></h1>
        <img src = "../assets/images/24.svg">
         
    </div>
</template>

<script>
export default {
    name: 'PageNotFound',    
    metaInfo: {
        title: 'Book Tracker | 404'
    },
}
</script>

<style scoped>
#e-404 {
    overflow: hidden !important;
    display: grid;
    grid-template-columns: 1fr 1fr;;
}
img  {
    width: 55%;
    margin: auto;
    /* position: absolute;
    top: 50%;
    right: 0;
    transform:  translateY(-50%); */
}
h1 {
    color: rgba(0,0,0,0.4);
    font-family: 'PT Sans', sans-serif;
    font-size: 50px;
}
span {
    color : #1DA1F2; 
    cursor: pointer;
}
span:hover {
    text-decoration: underline;
}
</style>
