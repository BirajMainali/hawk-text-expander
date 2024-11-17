document.addEventListener('DOMContentLoaded', (e) => {
    const elems = {
        form: document.querySelector("#shortcutForm"),
        shortcuts: document.querySelector("#shortcuts"),
        rowTemplate: document.querySelector("#shortcutTemplate")
    };

    const {set, remove, getAll} = promptlyStorage();


    elems.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = getFormData(elems.form);
        await set(formData.shortcut, formData.text);
        elems.form.reset();
        await loadShortcuts();
    });

    const loadShortcuts = async () => {
        const shortcuts = await getAll();
        elems.shortcuts.innerHTML = "";  // Clear the existing list

        shortcuts.forEach(item => {
            const rowElm = elems.rowTemplate.content.cloneNode(true);

            rowElm.querySelector("#shortcut").textContent = item.key;
            rowElm.querySelector("#text").textContent = item.value;

            // Handle Edit
            rowElm.querySelector("#edit").addEventListener('click', () => {
                elems.form.shortcut.value = item.key;
                elems.form.text.value = item.value;
            });

            // Handle Delete
            rowElm.querySelector("#delete").addEventListener('click', async () => {
                await remove(item.key);
                await loadShortcuts();  // Reload the shortcuts after removal
            });

            elems.shortcuts.appendChild(rowElm);
        });
    };

    (async () => {
        await loadShortcuts();
    })();
});

const getFormData = form =>
    Object.fromEntries(
        [...form.querySelectorAll("input, textarea")].map(
            ({name, value}) => [name, value]
        )
    );
