/* 
    This module parses text output and redirects users to various endpoints (/calendar, /weather, etc)
*/

const direct = (req, res, next) => {
  const { speechText } = req.locals;
  // Parse output here, have some logic
  const route = "/calendar";
  res.redirect(route);
};
