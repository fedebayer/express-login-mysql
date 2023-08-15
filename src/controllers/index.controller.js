export const index = (req, res) =>
  res.json({ message: "Welcome to the Login and Password Assignment System" });

export const getLogin = (req, res) => {
  res.send("Please log in:");
};

export const getAssignNewPassword = (req, res) => {
  res.send("Assign a new password:");
};
