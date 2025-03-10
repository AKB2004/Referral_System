const Referral = require('../models/Referral');
const Referrer = require('../models/Referrer');
const Campaign = require('../models/Campaign');

// @desc    Get all referrals
// @route   GET /api/referrals
// @access  Private
exports.getReferrals = async (req, res, next) => {
  try {
    let query = { user: req.user.id };

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by campaign if provided
    if (req.query.campaign) {
      query.campaign = req.query.campaign;
    }

    const referrals = await Referral.find(query)
      .populate({
        path: 'referrer',
        select: 'name email'
      })
      .populate({
        path: 'campaign',
        select: 'name'
      });

    res.status(200).json({
      success: true,
      count: referrals.length,
      data: referrals
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single referral
// @route   GET /api/referrals/:id
// @access  Private
exports.getReferral = async (req, res, next) => {
  try {
    const referral = await Referral.findById(req.params.id)
      .populate({
        path: 'referrer',
        select: 'name email'
      })
      .populate({
        path: 'campaign',
        select: 'name rewardType rewardDetails'
      });

    if (!referral) {
      return res.status(404).json({ success: false, error: 'Referral not found' });
    }

    // Make sure user owns the referral
    if (referral.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to access this referral' });
    }

    res.status(200).json({
      success: true,
      data: referral
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new referral
// @route   POST /api/referrals
// @access  Private
exports.createReferral = async (req, res, next) => {
  try {
    // Check if referrer exists and user owns it
    const referrer = await Referrer.findById(req.body.referrer);
    
    if (!referrer) {
      return res.status(404).json({ success: false, error: 'Referrer not found' });
    }

    if (referrer.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to use this referrer' });
    }

    // Get campaign from referrer
    const campaign = await Campaign.findById(referrer.campaign);

    // Add user and campaign to req.body
    req.body.user = req.user.id;
    req.body.campaign = campaign._id;
    req.body.reward = campaign.rewardDetails;

    const referral = await Referral.create(req.body);

    res.status(201).json({
      success: true,
      data: referral
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update referral status
// @route   PUT /api/referrals/:id
// @access  Private
exports.updateReferralStatus = async (req, res, next) => {
  try {
    let referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({ success: false, error: 'Referral not found' });
    }

    // Make sure user owns the referral
    if (referral.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this referral' });
    }

    // Only update status and purchaseValue
    const updatedData = {
      status: req.body.status,
      purchaseValue: req.body.purchaseValue || referral.purchaseValue
    };

    referral = await Referral.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: referral
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete referral
// @route   DELETE /api/referrals/:id
// @access  Private
exports.deleteReferral = async (req, res, next) => {
  try {
    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({ success: false, error: 'Not authorized to update this referral' });
    }