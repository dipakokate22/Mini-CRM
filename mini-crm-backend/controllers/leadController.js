const { Op } = require('sequelize');
const { Lead, User } = require('../models');

async function createLead(req, res) {
  try {
    const { customer_name, email, phone, status, assigned_to } = req.body;

    if (!customer_name) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    const lead = await Lead.create({
      customer_name,
      email,
      phone,
      status: status || 'New',
      assigned_to: assigned_to || null
    });

    return res.status(201).json(lead);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create lead' });
  }
}

async function getLeads(req, res) {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { customer_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const { rows, count } = await Lead.findAndCountAll({
      where,
      include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }],
      limit: parseInt(limit, 10),
      offset,
      order: [['created_at', 'DESC']]
    });

    return res.json({
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch leads' });
  }
}

async function updateLead(req, res) {
  try {
    const { id } = req.params;
    const { customer_name, email, phone, status, assigned_to } = req.body;

    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.customer_name = customer_name ?? lead.customer_name;
    lead.email = email ?? lead.email;
    lead.phone = phone ?? lead.phone;
    lead.status = status ?? lead.status;
    lead.assigned_to = assigned_to ?? lead.assigned_to;

    await lead.save();

    return res.json(lead);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update lead' });
  }
}

async function deleteLead(req, res) {
  try {
    const { id } = req.params;
    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await lead.destroy();
    return res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete lead' });
  }
}

module.exports = {
  createLead,
  getLeads,
  updateLead,
  deleteLead
};
