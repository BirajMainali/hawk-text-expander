const promptlyStorage = ({
                         identifier = 'hawk__shortcut_storage',
                     } = {
    identifier: 'hawk__shortcut_storage',
}) => {
    const getData = () => JSON.parse(localStorage.getItem(identifier)) || [];
    return {
        getAll: () => getData(),
        get: (key) => getData().find(item => item.key === key),
        set: (key, value) => {
            const all = getData();
            const index = all.findIndex(item => item.key === key);
            if (index === -1) {
                all.push({key, value});
            } else {
                all[index].value = value;
            }
            localStorage.setItem(identifier, JSON.stringify(all));
        }, remove: (key) => {
            const all = getData();
            const index = all.findIndex(item => item.key === key);
            all.splice(index, 1);
            localStorage.setItem(identifier, JSON.stringify(all));
        },
    }
}