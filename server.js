var express = require('express');
var User = require('./user.js');
var Link = require('./link.js');
var Comment = require('./comment.js');
var http = require('http');
var io = require('socket.io');
var fs = require('fs');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

var app = express();
app.use(allowCrossDomain);
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: '2234567890QWERTY'}));
app.use(app.router);


function checkAuth(req, res, next) {
    if (typeof(req.session.user_id) == "number") {
        next();
    } else {
        res.send(403, 'You are not authorized!');
    }
}

var entries = [];
var users = [];
var comments = [];
var commentMap = [];

//sample data
entries.push(new Link(entries.length, "Title", "a", "http://www.google.ch"));
var comment = new Comment(0, "TestComment", "a");
comments.push(comment);
entries[0].comments.push(comment);
commentMap[comment.id] = entries[0].id;
//default user
users.push(new User(users.length, "a", "a") );
users.push(new User(users.length, "b", "b") );
  
function findUser(name)
{
	for (var i in users) 
	{
	   var user = users[i];
	   if( user.name == name)
	   {
		   return user;
	   }
	}
	return null;
}

function returnIndex(res, id, array) {
    if (array.length <= id || id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No entry found');
    }
    return res.json(array[id]);
}

/*
app.get('/', function(req, res) {
  res.type('text/plain'); 
  res.json(entries);
});
*/
 
app.get('/login', function (req, res) {
    if (typeof (req.session.user_id) == "number") {
        return res.json(users[req.session.user_id].name);
    }
    return res.send(403, "Please login");
});
 
 app.post('/login', function (req, res) {
    var post = req.body;  
	var user = findUser(post.name);	 
	if( !!user && post.password == user.password)
	{		
		req.session.user_id = user.id;		
		res.json(true);		
		return;
	}	
	res.json(false);
});

 app.post('/register', function(req, res) {
     var post = req.body;
     
     if (typeof(post.name) != "string" || typeof(post.password) != "string") {
         return res.send(400, 'Name and password must be of type string.');
     }
     
     if (findUser(post.name)) {
         return res.send(400, 'User exists.');
     }
     var user = new User(users.length, post.name, post.password);
     users.push(user);
     res.json(user);
 });
 
 app.get('/users', function (req, res) {
     res.json(users);
 });

 
 
 app.get('/entries', function (req, res) {
    res.json(entries);
});


app.post('/entry', function(req, res) {
    var newLink = new Link(entries.length, req.body.title, users[req.session.user_id].name, req.body.url);	
 	entries.push(newLink);
 	res.json(newLink);
 	io.sockets.emit('message', { action: "AddLink" });
    io.sockets.emit('add:entry', newLink.id);
});

app.get('/entry/:id', function(req, res) {
   returnIndex(res,  req.params.id, entries);
});

app.post('/entry/:id/up', checkAuth, function (req, res) {
    var rating = entries[req.params.id].rating._up(req.session.user_id);
    res.json(entries[req.params.id]);
    io.sockets.emit('message', { action: "Rated" });
    io.sockets.emit('vote:entry:' + req.params.id, rating);
});

app.post('/entry/:id/down', checkAuth, function (req, res) {
    var rating = entries[req.params.id].rating._down(req.session.user_id);
    res.json(entries[req.params.id]);
    io.sockets.emit('message', { action: "Rated" });
    io.sockets.emit('vote:entry:' + req.params.id, rating);
});

app.post('/entry/:id/comment', checkAuth, function (req, res) {
    var newComment = new Comment(comments.length, req.body.text, users[req.session.user_id].name);
    comments.push(newComment);

    var entry = entries[req.params.id];
    entry.comments.push(newComment);
    res.json(newComment);

    commentMap[newComment.id] = entry.id;
    io.sockets.emit('message', { action: "AddComment" });
    io.sockets.emit('add:comment:entry:' + req.params.id, newComment);
});

app.post('/comment/:id', checkAuth, function (req, res) {
    var newComment = new Comment(comments.length, req.body.text, users[req.session.user_id].name);
    comments.push(newComment);

    var comment = comments[req.params.id];
    comment.comments.push(newComment);

    var entry = entries[commentMap[req.params.id]];
    commentMap[newComment.id] = entry.id;

    res.json(newComment);
    io.sockets.emit('message', { action: "AddComment" });
    io.sockets.emit('add:comment:sub:entry:' + entry.id, newComment);
    io.sockets.emit('add:comment:comment:' + req.params.id, newComment);
});

app.post('/comment/:id/up', checkAuth, function (req, res) {
    var rating = comments[req.params.id].rating._up(req.session.user_id);
    res.json(comments[req.params.id]);
    io.sockets.emit('message', { action: "Rated" });
    io.sockets.emit('vote:comment:' + req.params.id, rating);
});

app.post('/comment/:id/down', checkAuth, function (req, res) {
    var rating = comments[req.params.id].rating._down(req.session.user_id);
    res.json(comments[req.params.id]);
    io.sockets.emit('message', { action: "Rated" });
    io.sockets.emit('vote:comment:' + req.params.id, rating);
});

app.post('/logout', function (req, res) {
	req.session.user_id  = null;	
	res.json(true);
});

app.use('/app', express.static(__dirname + '/app/'));

app.get('*', function(req, res, next) {

    var file = __dirname +  req.path;

    fs.exists(file, function(exists) {
        if (exists) {
            return next();
        } else {
            res.sendfile(__dirname + '/app/index.html');
        }
    });

});

//socket:
io = io.listen(app.listen(process.env.PORT || 4730));

io.sockets.on('connection', function (socket) {
    socket.emit('message', { action: 'connected' });
});

io.sockets.on('disconnect', function (socket) {
    socket.emit('message', { action: 'disconnect' });
});



