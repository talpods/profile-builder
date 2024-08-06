
const userManagmentRepo = require('../infrastructure/userManagmentRepo');

exports.createUser = async (req, res) => {
  try {
    // Extract user details from request body
    const { email, password, firstName, lastName, acl, createdAt } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName || !acl.roles) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await userManagmentRepo.getUserByEmail(email);
    if (existingUser) {
      return res.status(401).json({ success: false, message: 'User with this email already exists' });
    }

    // Call the createUser method from the repository
    const result = await userManagmentRepo.createUser(email, password, firstName, lastName, acl.roles, createdAt);

    // Send success response
    if (result.success) {
      return res.status(201).json({ success: true, message: 'User created successfully' });
    } else {
      // Send failure response
      return res.status(500).json({ success: false, message: result.message, error: result.error });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Error in createUser controller:', error);
    return res.status(501).json({ success: false, message: 'Internal server error', error: error.message });
  }
}


exports.getAllUsers = async (req, res) => {


  try {
    const listOfUsers = await userManagmentRepo.getAllUsers();
    if (!listOfUsers) {
      return res.render("error", { message: "There is no users to show" });
    } else {
      res.status(200).send(listOfUsers);
    }
  } catch (error) {
    console.error("Error while fetching users: " + error);
    res.status(500).send(error.message);
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate the email
    if (!email) {
      return res.status(400).send({ error: 'Email is required' });
    }
    const ispresent = await userManagmentRepo.getUserByEmail(email);
    if(ispresent){

    await userManagmentRepo.deleteUser(email);

    res.status(200).send({ message: 'User deleted successfully' });
  }else{
    res.status(404).send({ error: 'User not found' });
  }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { email, firstName, lastName, acl } = req.body;

    // Validate input
    if (!email || !firstName || !lastName || !acl.roles) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if the user exists
    const existingUser = await userManagmentRepo.getUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Call the updateUser method from the repository
    const result = await userManagmentRepo.updateUser(email, firstName, lastName, acl.roles);

    // Send success response
    if (result.success) {
      return res.status(200).json({ success: true, message: 'User updated successfully' });
    } else {
      // Send failure response
      return res.status(500).json({ success: false, message: result.message, error: result.error });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Error in updateUser controller:', error);
    return res.status(501).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Validate input
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Call the getUserByEmail method from the repository
    const user = await userManagmentRepo.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Send success response
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    // Handle unexpected errors
    console.error('Error in getUserByEmail controller:', error);
    return res.status(501).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate input
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and newPassword are required' });
    }

    // Check if the user exists
    const existingUser = await userManagmentRepo.getUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update the user's password
    const result = await userManagmentRepo.updatePassword(email, newPassword);

    if (result.success) {
      return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } else {
      return res.status(500).json({ success: false, message: 'Error updating password', error: result.error });
    }
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

