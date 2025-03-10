const Referrer = require('../models/Referrer');
const Campaign = require('../models/Campaign');

// @desc    Get all referrers
// @route   GET /api/referrers
// @access  Private
exports.getReferrers = async (req, res, next) => {
  try {
    const referrers = await Referrer.find({ user: req.user.id })
      .populate('campaign', 'name');

    res.status(200).json({
      success: true,
      count: referrers.length,
      data: referrers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single referrer
// @route   GET /api/referrers/:id
// @access  Private
exports.getReferrer = async (req, res, next) => {
  try {
    const referrer = await Referrer.findById(req.params.id)
      .populate('campaign', 'name')
      .populate('referrals');

    if (!referrer) {
      return res.status(404).json({ success: false, error: 'Referrer not found' });
    }

    // Make sure user owns the referrer
    if (referrer.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to access this referrer' });
    }

    res.status(200).json({
      success: true,
      data: referrer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new referrer
// @route   POST /api/referrers
// @access  Private
exports.createReferrer = async (req, res, next) => {
  try {
    // Check if campaign exists and user owns it
    const campaign = await Campaign.findById(req.body.campaign);
    
    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to use this campaign' });
    }

    // Add user to req.body
    req.body.user = req.user.id;

    const referrer = await Referrer.create(req.body);

    res.status(201).json({
      success: true,
      data: referrer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update referrer
// @route   PUT /api/referrers/:id
// @access  Private
exports.updateReferrer = async (req, res, next) => {
  try {
    let referrer = await Referrer.findById(req.params.id);

    if (!referrer) {
      return res.status(404).json({ success: false, error: 'Referrer not found' });
    }

    // Make sure user owns the referrer
    if (referrer.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this referrer' });
    }

    referrer = await Referrer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: referrer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete referrer
// @route   DELETE /api/referrers/:id
// @access  Private
exports.deleteReferrer = async (req, res, next) => {
  try {
    const referrer = await Referrer.findById(req.params.id);

    if (!referrer) {
      return res.status(404).json({ success: false, error: 'Referrer not found' });
    }

    // Make sure user owns the referrer
    if (referrer.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this referrer' });
    }

    await referrer.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get referrer count
// @route   GET /api/referrers/count
// @access  Private
exports.getReferrerCount = async (req, res, next) => {
  try {
    const count = await Referrer.countDocuments({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      data: count
    });
  } catch (err) {
    next(err);
  }
};