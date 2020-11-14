const Clarifai = require('clarifai');

 
// Clarifai api key 
const app = new Clarifai.App({
    apiKey: ''
   })

   // apiKey : 'b49d8766d11d4623b4b03f409594f115'  look like this.. paste your own api key above

   const handleApiCall = (req,res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
    .then(data =>{
        res.json(data);
    })
    .catch(err => res.status('400').json('Unable to fetch api'))
   }
   
const handleImage = (req,res,db) =>{
    const {  id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries =>{
        // console.log(entries);
        res.json(entries[0]);
    })
    .catch(err =>{
        res.status('400').json('unable to get entries');
    })
}

module.exports = {
    handleImage,
    handleApiCall
};