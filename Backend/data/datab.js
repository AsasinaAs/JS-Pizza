var mongoose	=	require('mongoose');
mongoose.connect('mongodb://kma-test:root@mongodb-818-0.cloudclusters.net/kma-test?authSource=admin');
var db =	mongoose.connection;
db.on('error',	function	(err)	{
    console.log('connection	error:',	err.message);
});
db.once('open',	function	callback	()	{
    console.log("Connected	to	DB!");
});
var MovieSchema =	new	mongoose.Schema({
   name: String,
   age: Number,
});
//При створенні моделі задається назва колекції (таблиці)
var Student	=	mongoose.model('asya-fedchuk',	MovieSchema);
for(var i=0; i<10; i++){
    var student	=	new	Student({
        name: "asd"+i,
        age: +i,
    });
    student.save(function(err,	movie_datab){
        if(!err)	{
            console.log(movie_datab._id);
        }
    });
}
exports.getAll = function(callback){
    Student.find({}, function(error,data){
        callback(error,data);
    })
}