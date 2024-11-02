const store = ({ idPrefix: storeIdentifier = "hawk-notes" } = {}) => {
    const getAll = () => {
        return JSON.parse(localStorage.getItem(storeIdentifier) || '[]');
    };

    const update = ({ id, key, value }) => {
        const items = getAll();
        const existingItem = items.find(item => item.id === id);
        if (!existingItem) {
            throw new Error(`Item with id ${id} does not exist`);
        }
        existingItem.key = key;
        existingItem.text = value;
        localStorage.setItem(storeIdentifier, JSON.stringify(items));
    };

    return {
        create: ({ id, key: shortcutKey, value }) => {
            const items = getAll();
            const existingItem = items.find(item => item.id === id);
            if (existingItem) {
                update({ id, key: shortcutKey, value });
                return;
            }

            const item = {
                id: `${storeIdentifier}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                key: shortcutKey,
                text: value,
            };

            localStorage.setItem(storeIdentifier, JSON.stringify([...items, item]));
        },
        remove: ({ id, key }) => {
            const items = getAll();
            const existingItem = items.find(item => item.id === id);
            if (!existingItem) {
                throw new Error(`Item with key ${key} and id ${id} does not exist`);
            }
            localStorage.setItem(storeIdentifier, JSON.stringify(items.filter(item => item.id !== id)));
        },
        get: (key) => {
            const items = getAll();
            return items.find(item => item.key === key) || null;
        },
        getAll,
    };
};