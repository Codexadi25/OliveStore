// Admin Module for handling user CRUD operations
const AdminModule = {
    init: function() {
        this.attachEventListeners();
        this.setupRoleManagement();
    },

    attachEventListeners: function() {
        // Delete user handler
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                if (!confirm('Are you sure you want to delete this user?')) return;
                
                const userId = btn.dataset.userId;
                try {
                    const response = await fetch(`/api/admin/users/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        UI.showSuccess('User deleted successfully');
                        btn.closest('tr').remove();
                    } else {
                        const data = await response.json();
                        UI.showError(data.message || 'Failed to delete user');
                    }
                } catch (error) {
                    UI.showError('Error deleting user');
                    console.error(error);
                }
            });
        });

        // Role update handler
        document.querySelectorAll('.update-role').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const userId = btn.dataset.userId;
                const role = btn.closest('tr').querySelector('.role-select').value;
                
                try {
                    const response = await fetch(`/api/admin/users/${userId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ role })
                    });
                    
                    if (response.ok) {
                        UI.showSuccess('Role updated successfully');
                    } else {
                        const data = await response.json();
                        UI.showError(data.message || 'Failed to update role');
                    }
                } catch (error) {
                    UI.showError('Error updating role');
                    console.error(error);
                }
            });
        });
    },

    setupRoleManagement: function() {
        // Role selection behavior
        document.querySelectorAll('.role-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.role-option').forEach(o => {
                    o.classList.remove('selected');
                });
                option.classList.add('selected');
            });
        });
    },

    // Utility function to format dates
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    AdminModule.init();
});