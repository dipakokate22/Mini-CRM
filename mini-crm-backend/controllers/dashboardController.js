const { Sequelize } = require('sequelize');
const { Lead } = require('../models');

async function getDashboardStats(req, res) {
  try {
    const totalLeads = await Lead.count();
    const convertedLeads = await Lead.count({ where: { status: 'Converted' } });
    const lostLeads = await Lead.count({ where: { status: 'Lost' } });

    const conversionRate =
      totalLeads === 0 ? 0 : Number(((convertedLeads / totalLeads) * 100).toFixed(1));

    const byStatus = await Lead.findAll({
      attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
      group: ['status']
    });

    return res.json({
      totalLeads,
      convertedLeads,
      lostLeads,
      conversionRate,
      byStatus
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to load dashboard stats' });
  }
}

module.exports = { getDashboardStats };
