// UI Module for OliveStore
const UI = {
    // Show success message with toast
    showSuccess: function(message) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.innerHTML = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    // Show error message with toast
    showError: function(message) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-error';
        toast.innerHTML = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    // Dynamic button creation
    createActionButton: function(text, clickHandler, classes = 'btn-primary') {
        const button = document.createElement('button');
        button.className = `btn ${classes}`;
        button.innerHTML = text;
        if (clickHandler) {
            button.addEventListener('click', clickHandler);
        }
        return button;
    },

    // Add floating action button
    addFloatingActionButton: function(text, clickHandler) {
        const fab = document.createElement('button');
        fab.className = 'fab';
        fab.innerHTML = `<span class="fab-icon">+</span> ${text}`;
        fab.addEventListener('click', clickHandler);
        document.body.appendChild(fab);
        return fab;
    }
};

window.UI = UI;