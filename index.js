// I'm On A Call
// Server code for I'm On A Call which lets Wifi switches turn on Wifi lights. Both based on ESP8266 and some LEDs
// Initial code based on tutorial from http://blog.ragingflame.co.za/2014/7/21/using-nodejs-with-mysql

// User model
var knex = require('knex')({
  client: 'sqlite3',
	connection:{
		filename: "imonacall.sqlite3"
  }
});

var Bookshelf = require('bookshelf')(knex);
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('lodash');

app.use(require("morgan")("dev"));



var router = express.Router();

// for forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/*
 *   Models
**/

// User model
var User = Bookshelf.Model.extend({
    tableName: 'users'
});
// Switch/Light Unit model
var Unit = Bookshelf.Model.extend({
    tableName: 'units',
    group: function () {
      return this.belongsTo(Group, 'group_id');
    },
    owner: function () {
        return this.belongsTo(User, 'user_id');
    }
});
// Group model
var Group = Bookshelf.Model.extend({
    tableName: 'groups',
    units: function () {
       return this.belongsTo(Unit, 'group_id');
    }
});

//### Collections
var Users = Bookshelf.Collection.extend({
  model: User
});
var Units = Bookshelf.Collection.extend({
  model: Unit
});
var Groups = Bookshelf.Collection.extend({
  model: Group
});

/**
Next we need to define our API end points - we need to be able to perform basic CRUD operations on the following resources: `users`, `groups`, and `units`.
### Users
 - `GET    /users`    - fetch all users
 - `POST   /user`     - create a new user
 - `GET    /user/:id` - fetch a single user
 - `PUT    /user/:id` - update user
 - `DELETE /user/:id` - delete user
### Groups (One Switch and N Lights per Group. Need to add code to limit Switch to one. M Groups per User)
 - `GET    /groups`   - fetch all groups
 - `POST   /group`     - create a new group
 - `GET    /group/:id` - fetch a single group
 - `PUT    /group/:id` - update group
 - `DELETE /group/:id` - delete group
### Units (Lights and Switches)
 - `GET    /units`    - fetch all units
 - `POST   /unit`     - create a new unit
 - `GET    /unit/:id` - fetch a single unit
 - `PUT    /unit/:id` - update unit
 - `DELETE /unit/:id` - delete unit
 - `GET    /units/group/:id` - fetch all units from a single group
**/

router.route('/users')
  // fetch all users
  .get(function (req, res) {
    Users.forge()
    .fetch()
    .then(function (collection) {
      res.json({error: false, data: collection.toJSON()});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

  // create a user
  .post(function (req, res) {
    User.forge({
      name: req.body.name,
      email: req.body.email,
			password: req.body.password,
			mobile: req.body.mobile
    })
    .save()
    .then(function (user) {
      res.json({error: false, data: {id: user.get('id')}});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });

router.route('/user/:id')
  // fetch user
  .get(function (req, res) {
    User.forge({id: req.params.id})
    .fetch()
    .then(function (user) {
      if (!user) {
        res.status(404).json({error: true, data: {}});
      }
      else {
        res.json({error: false, data: user.toJSON()});
      }
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

  // update user details
  .put(function (req, res) {
    User.forge({id: req.params.id})
    .fetch({require: true})
    .then(function (user) {
      user.save({
        name: req.body.name || user.get('name'),
        email: req.body.email || user.get('email'),
				password: req.body.password || user.get('password'),
        mobile: req.body.mobile || user.get('mobile')
      })
      .then(function () {
        res.json({error: false, data: {message: 'User details updated'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

  // delete a user
  .delete(function (req, res) {
    User.forge({id: req.params.id})
    .fetch({require: true})
    .then(function (user) {
      user.destroy()
      .then(function () {
        res.json({error: true, data: {message: 'User successfully deleted'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });


router.route('/groups')
  // fetch all groups
  .get(function (req, res) {
    Groups.forge()
    .fetch()
    .then(function (collection) {
      res.json({error: false, data: collection.toJSON()});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

  // create a new group
  .post(function (req, res) {
    Group.forge({
			name: req.body.name,
			user_id: req.body.user_id
		})
    .save()
    .then(function (group) {
      res.json({error: false, data: {id: group.get('id')}});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });

router.route('/group/:id')
  // fetch all groups
  .get(function (req, res) {
    Group.forge({
			id: req.params.id
		})
    .fetch()
    .then(function (group) {
      if(!group) {
        res.status(404).json({error: true, data: {}});
      }
      else {
        res.json({error: false, data: group.toJSON()});
      }
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

  // update a group
  .put(function (req, res) {
    Group.forge({
			id: req.params.id
		})
    .fetch({require: true})
    .then(function (group) {
      group.save({name: req.body.name || group.get('name')})
      .then(function () {
        res.json({error: false, data: {message: 'Group updated'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

  // delete a group
  .delete(function (req, res) {
    Group.forge({
			id: req.params.id
		})
    .fetch({require: true})
    .then(function (group) {
      group.destroy()
      .then(function () {
        res.json({error: true, data: {message: 'Group successfully deleted'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });

router.route('/units')
  // fetch all units
  .get(function (req, res) {
    Units.forge()
    .fetch()
    .then(function (collection) {
      res.json({error: false, data: collection.toJSON()});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });

router.route('/unit/:id')
  // fetch a unit by id
  .get(function (req, res) {
    Unit.forge({id: req.params.id})
    .fetch({withRelated: ['group']})
    .then(function (unit) {
      if (!unit) {
        res.status(404).json({error: true, data: {}});
      }
      else {
        res.json({error: false, data: unit.toJSON()});
      }
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });


router.route('/units')
  .post(function (req, res) {
    // save unit variables
    Unit.forge({
      user_id: req.body.user_id,
      group_id: req.body.group_id,
      variant: req.body.variant,
			ip_address: req.body.ip_address,
			mac_address: req.body.mac_address,
			name: req.body.name,
			status: req.body.status
    })
    .save()
		.then(function (unit) {
			res.json({error: false, data: {id: unit.get('id')}});
		})
		.catch(function (err) {
			res.status(500).json({error: true, data: {message: err.message}});
		});
	});

router.route('/units/group/:id')
  .get(function (req, res) {
    Group.forge({id: req.params.id})
    .fetch({withRelated: ['units']})
    .then(function (group) {
      var units = group.related('units');

      res.json({error: false, data: units.toJSON()});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });

app.use('/api', router);

app.listen(3002, function() {
  console.log("Express server listening on port %d in %s mode", 3002, app.get('env'));
});
