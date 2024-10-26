// Registration
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const location = document.getElementById('location').value;

    const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, location }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Registration successful');
        localStorage.setItem('token', data.token);
    } else {
        alert('Registration failed: ' + data.message);
    }
});


// Login
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;

    const loginError = document.getElementById('loginError');
    loginError.textContent = ''; // Clear any previous error message

    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const contentType = response.headers.get("content-type");
        console.log('Response content type:', contentType);

        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            console.log('Response status:', response.status); // Log the response status
            console.log('Response data:', data); // Log the response data

            if (response.ok) {
                alert('Login successful');
                localStorage.setItem('token', data.token);
            } else {
                console.log('Login failed:', data.message); // Log the failure message
                loginError.textContent = 'Login failed: Invalid email or password'; // Display error message
            }
        } else {
            console.error('Expected JSON response but got:', contentType);
            loginError.textContent = 'Login failed: Server error occurred'; // Display error message
        }
    } catch (error) {
        console.error('Error during login:', error);
        loginError.textContent = 'Login failed: An error occurred'; // Display error message
    }
});

// Logout
const logout = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from storage
    
    if (!token) {
        alert('Not logged in');
        return;
    }
    
    const response = await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include token in headers
        }
    });

    const data = await response.json();
    
    if (response.ok) {
        alert('Logout successful');
        localStorage.removeItem('token'); // Remove token from storage
    } else {
        alert(`Logout failed: ${data.message}`);
    }
};

// Attach logout function to logout button
document.getElementById('logoutButton').addEventListener('click', logout);

// Delete User
const deleteUser = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from storage
    
    if (!token) {
        alert('Not logged in');
        return;
    }

    const response = await fetch('http://localhost:5000/api/users/me', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include token in headers
        }
    });

    const data = await response.json();

    if (response.ok) {
        alert('User deleted successfully');
        localStorage.removeItem('token'); // Remove token from storage
    } else {
        alert(`Delete user failed: ${data.message}`);
    }
};

// Attach delete function to delete button
document.getElementById('deleteButton').addEventListener('click', deleteUser);

// Forgot Password
document.getElementById('forgotPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('emailForgot').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('OTP sent to your email');
        } else {
            alert('Forgot password failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error during forgot password:', error);
        alert('Forgot password failed: An error occurred');
    }
});

// Reset Password
document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('emailReset').value;
    const otp = document.getElementById('otp').value;
    const newPassword = document.getElementById('newPassword').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp, newPassword }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Password reset successful');
        } else {
            alert('Password reset failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error during password reset:', error);
        alert('Password reset failed: An error occurred');
    }
});

// Update Profile
document.getElementById('updateProfileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('nameUpdate').value;
    const email = document.getElementById('emailUpdate').value;
    const password = document.getElementById('passwordUpdate').value;
    const location = document.getElementById('locationUpdate').value;

    const token = localStorage.getItem('token'); // Retrieve token from storage
    
    const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include token in headers
        },
        body: JSON.stringify({ name, email, password, location }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Profile updated successfully');
    } else {
        alert('Profile update failed: ' + data.message);
    }
});

// Add Book
document.getElementById('addBookForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const condition = document.getElementById('condition').value;
    const availabilityStatus = document.getElementById('availabilityStatus').value === 'true';
    const location = document.getElementById('booklocation').value;

    const bookData = { title, author, genre, condition, availabilityStatus, location };
    console.log('Book Data:', bookData); // Log book data to see what's being sent

    const token = localStorage.getItem('token'); // Retrieve token from storage

    const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include token in headers
        },
        body: JSON.stringify({ title, author, genre, condition, availabilityStatus, location }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Book added successfully');
    } else {
        alert('Book addition failed: ' + data.message);
    }
});
