const smartMirror = (req, res, next) => {
  // This middleware function gets called whenever the user hits /
  // We want to run a python script test.py within this function
  console.log("Start the python process");
  next();
};

module.exports = smartMirror;
