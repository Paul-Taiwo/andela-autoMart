export default (req, res, next) => {
  let { firstname, lastname } = req.body;
  // Remove unnecessary spaces
  firstname = firstname.trim().replace(/\s+/g, '');
  lastname = lastname.trim().replace(/\s+/g, '');
  // Check if firstname and lastname contains a number
  const yes = `${firstname}${lastname}`.split('').some(x => Number.isInteger(parseInt(x, 10)));

  if (yes) {
    return res.status(400).json({
      status: 400,
      error: 'Name cannot contain number(s)',
    });
  }

  if (Number.isInteger(parseInt(firstname, 10)) || Number.isInteger(parseInt(lastname, 10))) {
    return res.status(400).json({
      status: 400,
      error: 'Name cannot be a number',
    });
  }

  return next();
};
