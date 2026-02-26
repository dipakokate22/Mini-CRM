const { Followup, Lead } = require('../models');

async function createFollowup(req, res) {
  try {
    const { lead_id, followup_date, notes } = req.body;

    if (!lead_id || !followup_date) {
      return res.status(400).json({ message: 'Lead and followup date are required' });
    }

    const lead = await Lead.findByPk(lead_id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const followup = await Followup.create({
      lead_id,
      followup_date,
      notes,
      created_by: req.user.id
    });

    return res.status(201).json(followup);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create followup' });
  }
}

async function getFollowupsByLead(req, res) {
  try {
    const { leadId } = req.params;

    const followups = await Followup.findAll({
      where: { lead_id: leadId },
      order: [['followup_date', 'DESC']]
    });

    return res.json(followups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch followups' });
  }
}

module.exports = {
  createFollowup,
  getFollowupsByLead
};
