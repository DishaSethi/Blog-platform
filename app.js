const express=require('express');
const app=express();
const path=require('path');

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');



const homeRoutes=require('./routes/homeRoutes');

app.use('/',homeRoutes);

const PORT=process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});