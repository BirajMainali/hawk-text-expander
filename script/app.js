document.addEventListener('DOMContentLoaded', () => {
    const shortcutForm = document.getElementById('shortcutForm');
    const addShortcutBtn = document.getElementById('addShortcutBtn');
    const saveShortcutBtn = document.getElementById('saveShortcutBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const shortcutKeyInput = document.getElementById('shortcutKey');
    const shortcutTextInput = document.getElementById('shortcutText');
    const shortcutsList = document.getElementById('shortcutsList');

    let editingId = null;

    const { create, remove, get, getAll } = store();

    function loadShortcuts() {
        const shortcuts = getAll();
        shortcutsList.innerHTML = '';

        if (shortcuts.length === 0) {
            shortcutsList.innerHTML = `
                <div class="empty-state">
                    No shortcuts added yet. Click "Add Shortcut" to create one.
                </div>
            `;
            return;
        }

        shortcuts.forEach(shortcut => {
            const shortcutElement = createShortcutElement(shortcut);
            shortcutsList.appendChild(shortcutElement);
        });
    }

    function createShortcutElement(shortcut) {
        const div = document.createElement('div');
        div.className = 'shortcut-item';
        div.innerHTML = `
            <div class="shortcut-key">${escapeHtml(shortcut.key)}</div>
            <div class="shortcut-text">${escapeHtml(shortcut.text)}</div>
            <div class="shortcut-actions">
                <button class="btn-edit" onclick="editShortcut('${shortcut.id}')" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="btn-delete" onclick="deleteShortcut('${shortcut.id}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
        return div;
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function saveShortcut() {
        const key = shortcutKeyInput.value.trim();
        const text = shortcutTextInput.value.trim();
        if (!key || !text) {
            alert('Please fill in both shortcut key and text');
            return;
        }
        create({
            id: editingId,
            key: key,
            value: text,
        });
        resetForm();
        loadShortcuts();
    }

    window.editShortcut = function (id) {
        const shortcut = get(id);
        if (!shortcut) return;
        editingId = id;
        shortcutKeyInput.value = shortcut.key;
        shortcutTextInput.value = shortcut.text;
        shortcutForm.classList.add('active');
        shortcutKeyInput.focus();
    };

    window.deleteShortcut = function (id) {
        const ack = confirm('Are you sure you want to delete this shortcut?');
        if (!ack) return;
        remove({ id });
        loadShortcuts();
    }


    function resetForm() {
        editingId = null;
        shortcutKeyInput.value = '';
        shortcutTextInput.value = '';
        shortcutForm.classList.remove('active');
    }

    addShortcutBtn.addEventListener('click', () => {
        resetForm();
        shortcutForm.classList.add('active');
        shortcutKeyInput.focus();
    });

    saveShortcutBtn.addEventListener('click', saveShortcut);
    cancelBtn.addEventListener('click', resetForm);

    // Initialize
    loadShortcuts();
});