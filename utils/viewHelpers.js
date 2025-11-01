/**
 * Helper to standardize view rendering with the main layout
 * @param {Response} res - Express response object
 * @param {string} view - View name
 * @param {Object} options - View options
 */
exports.renderWithLayout = (res, view, options = {}) => {
    const defaults = {
        layout: 'layouts/main',
        title: 'OliveStore',
        styles: [],
        scripts: [],
        messages: {},
        showFooter: true
    };

    // Merge defaults with provided options
    const viewData = { ...defaults, ...options };

    // Convert style/script arrays to include .css/.js if needed
    viewData.styles = (viewData.styles || []).map(style =>
        style.endsWith('.css') ? style : `/css/${style}.css`
    );
    viewData.scripts = (viewData.scripts || []).map(script =>
        script.endsWith('.js') ? script : `/js/${script}.js`
    );

    // First render the inner view to HTML, then render the layout passing the
    // inner HTML as `body`. This avoids depending on express-ejs-layouts.
    const innerData = { ...viewData };
    // Remove layout key for the inner render to avoid confusion
    delete innerData.layout;

    res.render(view, innerData, (err, html) => {
        if (err) {
            // Log and send a minimal error response
            // (we avoid throwing since this helper is used widely)
            // eslint-disable-next-line no-console
            console.error('Error rendering view', view, err);
            return res.status(500).send('Server error');
        }

        const layoutData = { ...viewData, body: html };
        // Render the layout (layouts/main) with the generated body
        res.render(viewData.layout, layoutData);
    });
};