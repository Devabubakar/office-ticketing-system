module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/*
  Copyright @ Abubakar Ali 
  Dec 2020
 */
