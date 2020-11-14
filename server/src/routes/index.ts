const login = (req: any, res: any) => {
  res.json('Login Working');
};

const register = (req: any, res: any) => {
  res.json('Register Working');
};

module.exports = { login, register };
