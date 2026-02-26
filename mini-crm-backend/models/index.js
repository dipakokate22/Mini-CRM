const sequelize = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Lead = require('./Lead');
const Followup = require('./Followup');

Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

User.hasMany(Lead, { foreignKey: 'assigned_to', as: 'leads' });
Lead.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

Lead.hasMany(Followup, { foreignKey: 'lead_id', as: 'followups' });
Followup.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });

User.hasMany(Followup, { foreignKey: 'created_by', as: 'createdFollowups' });
Followup.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

async function syncModels() {
  await sequelize.sync();
}

module.exports = {
  sequelize,
  Role,
  User,
  Lead,
  Followup,
  syncModels
};
