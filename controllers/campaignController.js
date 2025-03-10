const Campaign = require('../models/Campaign');

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
exports.getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Private
exports.getCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    // Make sure user owns the campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to access this campaign' });
    }

    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private
exports.createCampaign = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const campaign = await Campaign.create(req.body);

    res.status(201).json({
      success: true,
      data: campaign
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private
exports.updateCampaign = async (req, res, next) => {
  try {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    // Make sure user owns the campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this campaign' });
    }

    campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
exports.deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    // Make sure user owns the campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this campaign' });
    }

    await campaign.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get campaign stats
// @route   GET /api/campaigns/stats
// @access  Private
exports.getCampaignStats = async (req, res, next) => {
  try {
    const totalCampaigns = await Campaign.countDocuments({ user: req.user.id });
    const activeCampaigns = await Campaign.countDocuments({ 
      user: req.user.id,
      isActive: true,
      endDate: { $gte: new Date() }
    });

    res.status(200).json({
      success: true,
      data: {
        totalCampaigns,
        activeCampaigns
      }
    });
  } catch (err) {
    next(err);
  }
};