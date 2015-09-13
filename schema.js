var Schema = {
  users: {
    id: {type: 'increments', nullable: false, primary: true},
    email: {type: 'string', maxlength: 254, nullable: false, unique: true},
    name: {type: 'string', maxlength: 150, nullable: false},
    password: {type: 'string', maxlength: 150, nullable: true},
    mobile: {type: 'string', maxlength: 50, nullable: true}
  },
  groups: {
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    name: {type: 'string', maxlength: 150, nullable: false}
  },
  units: {
    id: {type: 'increments', nullable: false, primary: true},
    variant: {type: 'string', maxlength: 150, nullable: false},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    group_id: {type: 'integer', nullable: false, unsigned: true},
    ip_address: {type: 'string', maxlength: 40, nullable: false, unique: true},
    mac_address: {type: 'string', maxlength: 15, nullable: false, unique: true},
    name: {type: 'string', maxlength: 150, nullable: false},
    status: {type: 'string', maxlength: 20, nullable: false}
  }
};
module.exports = Schema;
