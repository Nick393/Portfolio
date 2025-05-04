// script.js - Frontend JavaScript to handle form submission

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    const submitButton = document.querySelector('.submit-btn');
    
    if (contactForm) {
      contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable submit button while processing
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Get form data
        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          subject: document.getElementById('subject').value,
          message: document.getElementById('message').value
        };
        
        try {
          // Send form data to backend
          const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          
          const result = await response.json();
          
          // Handle the response
          if (response.ok) {
            // Success - create and show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = result.message;
            
            // Insert after form
            contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
            
            // Reset form
            contactForm.reset();
          } else {
            // Error handling for validation errors
            if (result.errors) {
              // Show validation errors
              const errorMessages = result.errors.map(err => err.msg).join('<br>');
              showErrorMessage(errorMessages);
            } else {
              showErrorMessage(result.message || 'Something went wrong. Please try again.');
            }
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          showErrorMessage('Network error. Please check your connection and try again.');
        } finally {
          // Re-enable button
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
        }
      });
    }
    
    // Helper function to show error messages
    function showErrorMessage(message) {
      // Remove any existing error messages
      const existingError = document.querySelector('.error-message');
      if (existingError) {
        existingError.remove();
      }
      
      // Create error element
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.innerHTML = message;
      
      // Insert before the form
      contactForm.parentNode.insertBefore(errorElement, contactForm);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        errorElement.remove();
      }, 5000);
    }
  });