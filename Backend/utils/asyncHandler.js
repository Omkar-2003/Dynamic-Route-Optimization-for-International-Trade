const asyncHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    // logger.error("An error occurred:", error);
    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  asyncHandler,
};
