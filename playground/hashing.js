const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log(hash);

var data = {
    id: 4,
    bla: '124',
    blabla: '1234'
};
var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data).toString);

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString;
if(resultHash = token.data){
    console.log('Data was not changed');
}else{
    console.log('Data was change. Do not trust!');
}
//sign takes the data to hash and the salt
var token = jwt.sign(data, '123abc')//takes the object(data and the user id) and signs it(creates that token hash and return the value )
console.log(token);

var decoded = jwt.decode(token, '123abc');
console.log('decoded', decoded);

var password = '123abc';
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    })
});

var hashedPassword = '';
bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
})